"""
Profile API endpoints using Django Ninja.
"""
from ninja import Router
from django.shortcuts import get_object_or_404

from core.auth import supabase_auth
from .models import Profile
from .schemas import (
    ProfileOutSchema,
    ProfileCreateSchema,
    ProfileUpdateSchema,
    OnboardingStepUpdateSchema,
    MessageSchema,
)

router = Router()


@router.get("/me", response=ProfileOutSchema, auth=supabase_auth)
def get_my_profile(request):
    """
    Retorna o perfil do operador logado.
    OPERAÇÃO: Identificação do Agente.
    """
    return request.auth


@router.put("/me", response=ProfileOutSchema, auth=supabase_auth)
def update_my_profile(request, payload: ProfileUpdateSchema):
    """
    Atualiza dados do perfil do operador logado.
    OPERAÇÃO: Atualização de Dados Táticos.
    """
    profile = request.auth
    
    for attr, value in payload.dict(exclude_unset=True).items():
        if value is not None:
            setattr(profile, attr, value)
    
    profile.save()
    return profile


@router.post("/onboarding/complete-step-0", response=ProfileOutSchema, auth=supabase_auth)
def complete_onboarding_step_0(request, payload: ProfileCreateSchema):
    """
    Completa o Step 0 (Cadastro de Sonhos/Pix e Heptagrama).
    OPERAÇÃO: Registro do Recruta.
    Avança automaticamente para Step 1 após salvar.
    """
    profile = request.auth
    
    # Só permite se ainda estiver no step 0
    if profile.onboarding_step != Profile.STEP_CADASTRO:
        from ninja.errors import HttpError
        raise HttpError(400, "Esta etapa já foi concluída.")
    
    # Atualiza os dados
    profile.full_name = payload.full_name
    profile.phone = payload.phone
    profile.pix_key = payload.pix_key
    profile.financial_goal = payload.financial_goal
    profile.dream_description = payload.dream_description
    profile.heptagram_scores = payload.heptagram_scores
    
    # Avança para o próximo step
    profile.onboarding_step = Profile.STEP_KICKOFF
    profile.save()
    
    return profile


@router.post("/onboarding/complete-step-1", response=ProfileOutSchema, auth=supabase_auth)
def complete_onboarding_step_1(request):
    """
    Completa o Step 1 (Kickoff agendado e confirmado).
    OPERAÇÃO: Briefing Confirmado.
    Avança para Step 2.
    """
    profile = request.auth
    
    if profile.onboarding_step != Profile.STEP_KICKOFF:
        from ninja.errors import HttpError
        raise HttpError(400, "Esta etapa não está disponível.")
    
    profile.onboarding_step = Profile.STEP_CONTRATO
    profile.save()
    
    return profile


@router.post("/onboarding/complete-step-2", response=ProfileOutSchema, auth=supabase_auth)
def complete_onboarding_step_2(request):
    """
    Completa o Step 2 (Contrato assinado).
    OPERAÇÃO: Engajamento Confirmado.
    Avança para Step 3 (Operacional - Acesso Total).
    """
    profile = request.auth
    
    if profile.onboarding_step != Profile.STEP_CONTRATO:
        from ninja.errors import HttpError
        raise HttpError(400, "Esta etapa não está disponível.")
    
    profile.onboarding_step = Profile.STEP_OPERACIONAL
    profile.save()
    
    return profile


@router.get("/dashboard-stats", response=dict, auth=supabase_auth)
def get_dashboard_stats(request):
    """
    Retorna estatísticas do dashboard do operador.
    OPERAÇÃO: Relatório de Guerra.
    """
    profile = request.auth
    
    return {
        "operador": profile.full_name or "Operador",
        "familias_salvas": profile.families_saved_count,
        "comissao_atual": float(profile.current_commission),
        "meta_financeira": float(profile.financial_goal),
        "progresso_percentual": profile.progress_percentage,
        "onboarding_step": profile.onboarding_step,
        "heptagram_scores": profile.heptagram_scores,
    }
