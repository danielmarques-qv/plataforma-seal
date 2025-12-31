"""
Training API endpoints using Django Ninja.
Manages training modules and progress tracking.
"""
from typing import List
from datetime import datetime
from ninja import Router
from ninja.errors import HttpError
from django.shortcuts import get_object_or_404
from django.utils import timezone

from core.auth import supabase_auth
from apps.profiles.models import Profile
from .models import TrainingModule, ModuleProgress
from .schemas import (
    TrainingModuleOutSchema,
    TrainingModuleWithProgressSchema,
    ModuleProgressUpdateSchema,
    TrainingOverviewSchema,
)

router = Router()


@router.get("/modules", response=TrainingOverviewSchema, auth=supabase_auth)
def get_training_overview(request):
    """
    Retorna visão geral dos módulos de treinamento com progresso.
    OPERAÇÃO: Briefing de Missões de Treinamento.
    """
    profile = request.auth
    user_step = profile.onboarding_step
    
    # Busca todos os módulos ativos
    all_modules = TrainingModule.objects.filter(is_active=True)
    
    # Busca progresso do usuário
    progress_map = {
        p.module_id: p for p in ModuleProgress.objects.filter(profile=profile)
    }
    
    modules_with_progress = []
    completed_count = 0
    available_count = 0
    locked_count = 0
    
    for module in all_modules:
        is_locked = module.required_step > user_step
        progress = progress_map.get(module.id)
        is_completed = progress.completed if progress else False
        completed_at = progress.completed_at if progress and progress.completed else None
        
        if is_locked:
            locked_count += 1
        else:
            available_count += 1
            if is_completed:
                completed_count += 1
        
        modules_with_progress.append(
            TrainingModuleWithProgressSchema(
                id=module.id,
                title=module.title,
                description=module.description,
                video_url=None if is_locked else module.video_url,
                thumbnail_url=module.thumbnail_url,
                order_index=module.order_index,
                required_step=module.required_step,
                duration_minutes=module.duration_minutes,
                is_completed=is_completed,
                completed_at=completed_at,
                is_locked=is_locked
            )
        )
    
    total = len(modules_with_progress)
    progress_pct = (completed_count / available_count * 100) if available_count > 0 else 0
    
    return TrainingOverviewSchema(
        total_modules=total,
        completed_modules=completed_count,
        available_modules=available_count,
        locked_modules=locked_count,
        progress_percentage=round(progress_pct, 1),
        modules=modules_with_progress
    )


@router.get("/modules/{module_id}", response=TrainingModuleWithProgressSchema, auth=supabase_auth)
def get_module_detail(request, module_id: int):
    """
    Retorna detalhes de um módulo específico.
    OPERAÇÃO: Briefing Detalhado da Missão.
    """
    profile = request.auth
    
    module = get_object_or_404(TrainingModule, id=module_id, is_active=True)
    
    # Verifica se está bloqueado
    is_locked = module.required_step > profile.onboarding_step
    if is_locked:
        raise HttpError(
            403,
            f"ACESSO NEGADO: Este módulo requer onboarding step {module.required_step}."
        )
    
    # Busca progresso
    try:
        progress = ModuleProgress.objects.get(profile=profile, module=module)
        is_completed = progress.completed
        completed_at = progress.completed_at
    except ModuleProgress.DoesNotExist:
        is_completed = False
        completed_at = None
    
    return TrainingModuleWithProgressSchema(
        id=module.id,
        title=module.title,
        description=module.description,
        video_url=module.video_url,
        thumbnail_url=module.thumbnail_url,
        order_index=module.order_index,
        required_step=module.required_step,
        duration_minutes=module.duration_minutes,
        is_completed=is_completed,
        completed_at=completed_at,
        is_locked=False
    )


@router.post("/modules/{module_id}/complete", auth=supabase_auth)
def mark_module_complete(request, module_id: int):
    """
    Marca um módulo como concluído.
    OPERAÇÃO: Missão Cumprida.
    """
    profile = request.auth
    print(f"[Training] Completando módulo {module_id} para perfil {profile.id}")
    
    try:
        module = get_object_or_404(TrainingModule, id=module_id, is_active=True)
        print(f"[Training] Módulo encontrado: {module.title}")
        
        # Verifica se está bloqueado
        if module.required_step > profile.onboarding_step:
            raise HttpError(403, "ACESSO NEGADO: Módulo bloqueado.")
        
        # Cria ou atualiza progresso
        progress, created = ModuleProgress.objects.get_or_create(
            profile=profile,
            module=module,
            defaults={'completed': True, 'completed_at': timezone.now()}
        )
        print(f"[Training] Progresso criado: {created}, completed: {progress.completed}")
        
        if not created and not progress.completed:
            progress.completed = True
            progress.completed_at = timezone.now()
            progress.save()
            print(f"[Training] Progresso atualizado")
        
        return {
            "status": "MISSÃO CUMPRIDA",
            "message": f"Módulo '{module.title}' concluído com sucesso.",
            "module_id": module.id,
            "completed_at": progress.completed_at
        }
    except Exception as e:
        print(f"[Training] Erro ao completar módulo: {e}")
        raise


@router.get("/pending", response=List[TrainingModuleWithProgressSchema], auth=supabase_auth)
def get_pending_modules(request):
    """
    Retorna módulos pendentes (não concluídos e disponíveis).
    OPERAÇÃO: Missões Pendentes.
    """
    profile = request.auth
    user_step = profile.onboarding_step
    
    # Módulos disponíveis (não bloqueados)
    available_modules = TrainingModule.objects.filter(
        is_active=True,
        required_step__lte=user_step
    )
    
    # IDs de módulos já concluídos
    completed_ids = set(
        ModuleProgress.objects.filter(
            profile=profile,
            completed=True
        ).values_list('module_id', flat=True)
    )
    
    pending = []
    for module in available_modules:
        if module.id not in completed_ids:
            pending.append(
                TrainingModuleWithProgressSchema(
                    id=module.id,
                    title=module.title,
                    description=module.description,
                    video_url=module.video_url,
                    thumbnail_url=module.thumbnail_url,
                    order_index=module.order_index,
                    required_step=module.required_step,
                    duration_minutes=module.duration_minutes,
                    is_completed=False,
                    completed_at=None,
                    is_locked=False
                )
            )
    
    return pending
