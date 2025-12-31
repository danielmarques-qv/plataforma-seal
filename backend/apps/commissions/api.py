"""
Commissions API endpoints using Django Ninja.
Tracks and displays commission information for strategists.
"""
from typing import List
from decimal import Decimal
from ninja import Router
from ninja.errors import HttpError
from django.db.models import Sum

from core.auth import supabase_auth
from apps.profiles.models import Profile
from .models import Commission
from .schemas import (
    CommissionOutSchema,
    CommissionSummarySchema,
    CommissionRulesSchema,
)

router = Router()


def check_operational_access(profile: Profile):
    """
    Verifica se o usuário tem acesso operacional (onboarding_step = 3).
    """
    if profile.onboarding_step < Profile.STEP_OPERACIONAL:
        raise HttpError(
            403,
            "ACESSO NEGADO: Complete seu treinamento para acessar as comissões."
        )


@router.get("/summary", response=CommissionSummarySchema, auth=supabase_auth)
def get_commission_summary(request):
    """
    Retorna resumo das comissões do estrategista.
    OPERAÇÃO: Relatório Financeiro Tático.
    """
    profile = request.auth
    check_operational_access(profile)
    
    commissions = Commission.objects.filter(strategist=profile)
    
    # Calcula totais
    pending = commissions.filter(status__in=[Commission.STATUS_PENDING, Commission.STATUS_APPROVED])
    paid = commissions.filter(status=Commission.STATUS_PAID)
    
    total_pending = pending.aggregate(total=Sum('amount'))['total'] or Decimal('0')
    total_paid = paid.aggregate(total=Sum('amount'))['total'] or Decimal('0')
    
    return CommissionSummarySchema(
        total_earned=total_pending + total_paid,
        total_pending=total_pending,
        total_paid=total_paid,
        pending_count=pending.count(),
        paid_count=paid.count(),
        commissions=list(commissions[:50])  # Últimas 50 comissões
    )


@router.get("/list", response=List[CommissionOutSchema], auth=supabase_auth)
def list_commissions(request, status: str = None):
    """
    Lista comissões do estrategista.
    OPERAÇÃO: Extrato de Operações Financeiras.
    """
    profile = request.auth
    check_operational_access(profile)
    
    commissions = Commission.objects.filter(strategist=profile)
    
    if status:
        commissions = commissions.filter(status=status.upper())
    
    return list(commissions)


@router.get("/pending", response=List[CommissionOutSchema], auth=supabase_auth)
def list_pending_commissions(request):
    """
    Lista comissões pendentes do estrategista.
    OPERAÇÃO: Recompensas Aguardando Liberação.
    """
    profile = request.auth
    check_operational_access(profile)
    
    commissions = Commission.objects.filter(
        strategist=profile,
        status__in=[Commission.STATUS_PENDING, Commission.STATUS_APPROVED]
    )
    
    return list(commissions)


@router.get("/rules", response=CommissionRulesSchema, auth=supabase_auth)
def get_commission_rules(request):
    """
    Retorna as regras de comissionamento.
    OPERAÇÃO: Manual de Recompensas.
    """
    profile = request.auth
    check_operational_access(profile)
    
    # Regras estáticas de comissionamento (podem vir do banco futuramente)
    return CommissionRulesSchema(
        title="Regras de Comissionamento SEAL",
        description="Sistema de recompensas para estrategistas de alta performance.",
        tiers=[
            {
                "tier": 1,
                "name": "Operador Iniciante",
                "min_sales": 0,
                "max_sales": 5,
                "commission_rate": 10,
                "bonus": None
            },
            {
                "tier": 2,
                "name": "Operador Tático",
                "min_sales": 6,
                "max_sales": 15,
                "commission_rate": 12,
                "bonus": "Bônus de R$ 500 ao atingir 10 vendas"
            },
            {
                "tier": 3,
                "name": "Operador Elite",
                "min_sales": 16,
                "max_sales": 30,
                "commission_rate": 15,
                "bonus": "Bônus de R$ 1.500 ao atingir 20 vendas"
            },
            {
                "tier": 4,
                "name": "Comandante SEAL",
                "min_sales": 31,
                "max_sales": None,
                "commission_rate": 18,
                "bonus": "Bônus de R$ 5.000 ao atingir 50 vendas + viagem exclusiva"
            }
        ]
    )


@router.get("/stats", auth=supabase_auth)
def get_commission_stats(request):
    """
    Retorna estatísticas detalhadas de comissões.
    OPERAÇÃO: Análise de Performance Financeira.
    """
    profile = request.auth
    check_operational_access(profile)
    
    commissions = Commission.objects.filter(strategist=profile)
    
    # Estatísticas por status
    stats_by_status = {}
    for status_code, status_name in Commission.STATUS_CHOICES:
        status_commissions = commissions.filter(status=status_code)
        total = status_commissions.aggregate(total=Sum('amount'))['total'] or Decimal('0')
        stats_by_status[status_code] = {
            "name": status_name,
            "count": status_commissions.count(),
            "total": float(total)
        }
    
    return {
        "status": "RELATÓRIO GERADO",
        "total_commissions": commissions.count(),
        "by_status": stats_by_status,
        "current_commission": float(profile.current_commission),
        "financial_goal": float(profile.financial_goal),
        "progress_percentage": profile.progress_percentage
    }
