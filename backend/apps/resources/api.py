"""
Resources API endpoints using Django Ninja.
Manages scripts, playbooks, and downloadable resources (Arsenal).
"""
from typing import List
from ninja import Router
from ninja.errors import HttpError
from django.shortcuts import get_object_or_404
from django.db.models import Sum

from core.auth import supabase_auth
from apps.profiles.models import Profile
from .models import Resource
from .schemas import (
    ResourceOutSchema,
    ResourcesByCategorySchema,
    CategoryStatsSchema,
)

router = Router()


def check_operational_access(profile: Profile):
    """
    Verifica se o usuário tem acesso operacional (onboarding_step = 3).
    Implementa a lógica de CADEADOS para o Arsenal.
    """
    if profile.onboarding_step < Profile.STEP_OPERACIONAL:
        raise HttpError(
            403,
            "ACESSO NEGADO: Complete seu treinamento para acessar o Arsenal."
        )


@router.get("/arsenal", response=ResourcesByCategorySchema, auth=supabase_auth)
def get_arsenal(request):
    """
    Retorna todos os recursos do Arsenal organizados por categoria.
    OPERAÇÃO: Inventário do Arsenal.
    """
    profile = request.auth
    check_operational_access(profile)
    
    resources = Resource.objects.filter(is_active=True)
    
    # Organiza por categoria
    arsenal = {
        'SCRIPT': [],
        'PLAYBOOK': [],
        'TEMPLATE': [],
        'GUIDE': [],
    }
    
    for resource in resources:
        if resource.category in arsenal:
            arsenal[resource.category].append(resource)
    
    return ResourcesByCategorySchema(
        SCRIPT=arsenal['SCRIPT'],
        PLAYBOOK=arsenal['PLAYBOOK'],
        TEMPLATE=arsenal['TEMPLATE'],
        GUIDE=arsenal['GUIDE'],
        total_count=resources.count()
    )


@router.get("/list", response=List[ResourceOutSchema], auth=supabase_auth)
def list_resources(request, category: str = None):
    """
    Lista recursos, opcionalmente filtrados por categoria.
    OPERAÇÃO: Busca no Arsenal.
    """
    profile = request.auth
    check_operational_access(profile)
    
    resources = Resource.objects.filter(is_active=True)
    
    if category:
        resources = resources.filter(category=category.upper())
    
    return list(resources)


@router.get("/categories", response=List[CategoryStatsSchema], auth=supabase_auth)
def get_categories_stats(request):
    """
    Retorna estatísticas por categoria de recursos.
    OPERAÇÃO: Relatório do Arsenal.
    """
    profile = request.auth
    check_operational_access(profile)
    
    category_display = {
        'SCRIPT': 'Scripts de Vendas',
        'PLAYBOOK': 'Playbooks Táticos',
        'TEMPLATE': 'Templates',
        'GUIDE': 'Guias e Manuais',
    }
    
    stats = []
    for cat_code, cat_name in category_display.items():
        resources = Resource.objects.filter(is_active=True, category=cat_code)
        total_downloads = resources.aggregate(total=Sum('download_count'))['total'] or 0
        
        stats.append(CategoryStatsSchema(
            category=cat_code,
            category_display=cat_name,
            count=resources.count(),
            total_downloads=total_downloads
        ))
    
    return stats


@router.get("/{resource_id}", response=ResourceOutSchema, auth=supabase_auth)
def get_resource(request, resource_id: int):
    """
    Retorna detalhes de um recurso específico.
    OPERAÇÃO: Briefing do Equipamento.
    """
    profile = request.auth
    check_operational_access(profile)
    
    resource = get_object_or_404(Resource, id=resource_id, is_active=True)
    return resource


@router.post("/{resource_id}/download", auth=supabase_auth)
def register_download(request, resource_id: int):
    """
    Registra um download de recurso e retorna a URL.
    OPERAÇÃO: Requisição de Equipamento.
    """
    profile = request.auth
    check_operational_access(profile)
    
    resource = get_object_or_404(Resource, id=resource_id, is_active=True)
    
    # Incrementa contador de downloads
    resource.download_count += 1
    resource.save()
    
    return {
        "status": "EQUIPAMENTO LIBERADO",
        "message": f"Download de '{resource.title}' autorizado.",
        "file_url": resource.file_url,
        "file_type": resource.file_type
    }
