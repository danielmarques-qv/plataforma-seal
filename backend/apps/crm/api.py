"""
CRM API endpoints using Django Ninja.
Implements the Frontline Kanban board with tactical pipeline.
"""
from typing import List
from ninja import Router
from ninja.errors import HttpError
from django.shortcuts import get_object_or_404
from django.db import transaction

from core.auth import supabase_auth, require_operational
from apps.profiles.models import Profile
from apps.commissions.models import Commission
from .models import Lead
from .schemas import (
    LeadCreateSchema,
    LeadUpdateSchema,
    LeadOutSchema,
    LeadMoveSchema,
    KanbanBoardSchema,
)
from decimal import Decimal


def create_commission_for_lead(profile: Profile, lead: Lead):
    """
    Cria uma comissão automaticamente quando lead vai para RESGATE.
    Valor = potential_value × commission_percentage / 100
    Atualiza current_commission do profile.
    """
    # Verifica se já existe comissão para este lead
    existing = Commission.objects.filter(strategist=profile, lead=lead).first()
    if existing:
        return existing
    
    # Calcula valor da comissão
    commission_rate = Decimal(str(profile.commission_percentage)) / Decimal('100')
    commission_amount = Decimal(str(lead.potential_value)) * commission_rate
    
    # Cria comissão com status PENDING
    commission = Commission.objects.create(
        strategist=profile,
        lead=lead,
        amount=commission_amount,
        status=Commission.STATUS_PENDING,
        description=f"Comissão automática - Lead: {lead.name}"
    )
    
    # Atualiza current_commission do profile (soma de todas as comissões pendentes + aprovadas)
    from django.db.models import Sum
    total = Commission.objects.filter(
        strategist=profile,
        status__in=[Commission.STATUS_PENDING, Commission.STATUS_APPROVED]
    ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
    
    profile.current_commission = total
    profile.save()
    
    return commission

router = Router()


def check_operational_access(profile: Profile):
    """
    Verifica se o usuário tem acesso operacional (onboarding_step = 3).
    Implementa a lógica de CADEADOS.
    """
    if profile.onboarding_step < Profile.STEP_OPERACIONAL:
        raise HttpError(
            403,
            "ACESSO NEGADO: Complete seu treinamento para acessar o Frontline CRM."
        )


@router.get("/board", response=KanbanBoardSchema, auth=supabase_auth)
def get_kanban_board(request):
    """
    Retorna o board Kanban completo com leads organizados por status.
    OPERAÇÃO: Visão Tática do Campo de Batalha.
    """
    profile = request.auth
    check_operational_access(profile)
    
    # Busca todos os leads do estrategista
    leads = Lead.objects.filter(strategist=profile)
    
    # Organiza por status
    board = {
        'RADAR': [],
        'COMBATE': [],
        'EXTRAÇÃO': [],
        'RESGATE': [],
    }
    
    for lead in leads:
        if lead.status in board:
            board[lead.status].append(lead)
    
    return KanbanBoardSchema(
        RADAR=board['RADAR'],
        COMBATE=board['COMBATE'],
        EXTRAÇÃO=board['EXTRAÇÃO'],
        RESGATE=board['RESGATE'],
        total_count=leads.count(),
        families_saved=len(board['RESGATE'])
    )


@router.get("/leads", response=List[LeadOutSchema], auth=supabase_auth)
def list_leads(request, status: str = None):
    """
    Lista todos os leads do estrategista, opcionalmente filtrados por status.
    OPERAÇÃO: Reconhecimento de Alvos.
    """
    profile = request.auth
    check_operational_access(profile)
    
    leads = Lead.objects.filter(strategist=profile)
    
    if status:
        leads = leads.filter(status=status)
    
    return list(leads)


@router.post("/leads", response=LeadOutSchema, auth=supabase_auth)
def create_lead(request, payload: LeadCreateSchema):
    """
    Cria um novo lead no pipeline.
    OPERAÇÃO: Identificação de Novo Alvo.
    """
    profile = request.auth
    check_operational_access(profile)
    
    # Valida o status
    valid_statuses = [Lead.STATUS_RADAR, Lead.STATUS_COMBATE, Lead.STATUS_EXTRACAO, Lead.STATUS_RESGATE]
    if payload.status not in valid_statuses:
        raise HttpError(400, f"Status inválido. Use: {', '.join(valid_statuses)}")
    
    lead = Lead.objects.create(
        strategist=profile,
        name=payload.name,
        phone=payload.phone,
        email=payload.email,
        potential_value=payload.potential_value,
        notes=payload.notes,
        status=payload.status
    )
    
    # Se criado diretamente em RESGATE, incrementa contador e cria comissão
    if lead.status == Lead.STATUS_RESGATE:
        profile.families_saved_count += 1
        profile.save()
        create_commission_for_lead(profile, lead)
    
    return lead


@router.get("/leads/{lead_id}", response=LeadOutSchema, auth=supabase_auth)
def get_lead(request, lead_id: int):
    """
    Retorna detalhes de um lead específico.
    OPERAÇÃO: Briefing do Alvo.
    """
    profile = request.auth
    check_operational_access(profile)
    
    lead = get_object_or_404(Lead, id=lead_id, strategist=profile)
    return lead


@router.put("/leads/{lead_id}", response=LeadOutSchema, auth=supabase_auth)
def update_lead(request, lead_id: int, payload: LeadUpdateSchema):
    """
    Atualiza dados de um lead.
    OPERAÇÃO: Atualização de Intel.
    """
    profile = request.auth
    check_operational_access(profile)
    
    lead = get_object_or_404(Lead, id=lead_id, strategist=profile)
    old_status = lead.status
    
    for attr, value in payload.dict(exclude_unset=True).items():
        if value is not None:
            setattr(lead, attr, value)
    
    lead.save()
    
    # Atualiza contador de famílias salvas se moveu para RESGATE
    if old_status != Lead.STATUS_RESGATE and lead.status == Lead.STATUS_RESGATE:
        profile.families_saved_count += 1
        profile.save()
        create_commission_for_lead(profile, lead)
    # Decrementa se saiu de RESGATE
    elif old_status == Lead.STATUS_RESGATE and lead.status != Lead.STATUS_RESGATE:
        profile.families_saved_count = max(0, profile.families_saved_count - 1)
        profile.save()
    
    return lead


@router.patch("/leads/{lead_id}/move", response=LeadOutSchema, auth=supabase_auth)
def move_lead(request, lead_id: int, payload: LeadMoveSchema):
    """
    Move um lead para uma nova coluna do Kanban.
    OPERAÇÃO: Avanço Tático.
    """
    profile = request.auth
    check_operational_access(profile)
    
    valid_statuses = [Lead.STATUS_RADAR, Lead.STATUS_COMBATE, Lead.STATUS_EXTRACAO, Lead.STATUS_RESGATE]
    if payload.status not in valid_statuses:
        raise HttpError(400, f"Status inválido. Use: {', '.join(valid_statuses)}")
    
    lead = get_object_or_404(Lead, id=lead_id, strategist=profile)
    old_status = lead.status
    
    with transaction.atomic():
        lead.status = payload.status
        lead.save()
        
        # Atualiza contador de famílias salvas e cria comissão
        if old_status != Lead.STATUS_RESGATE and payload.status == Lead.STATUS_RESGATE:
            profile.families_saved_count += 1
            profile.save()
            create_commission_for_lead(profile, lead)
        elif old_status == Lead.STATUS_RESGATE and payload.status != Lead.STATUS_RESGATE:
            profile.families_saved_count = max(0, profile.families_saved_count - 1)
            profile.save()
    
    return lead


@router.delete("/leads/{lead_id}", auth=supabase_auth)
def delete_lead(request, lead_id: int):
    """
    Remove um lead do pipeline.
    OPERAÇÃO: Cancelamento de Missão.
    """
    profile = request.auth
    check_operational_access(profile)
    
    lead = get_object_or_404(Lead, id=lead_id, strategist=profile)
    
    # Se estava em RESGATE, decrementa contador
    if lead.status == Lead.STATUS_RESGATE:
        profile.families_saved_count = max(0, profile.families_saved_count - 1)
        profile.save()
    
    lead.delete()
    
    return {"status": "MISSÃO CANCELADA", "message": f"Lead '{lead.name}' removido com sucesso."}
