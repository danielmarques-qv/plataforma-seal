"""
Pydantic schemas for Training API endpoints.
"""
from typing import Optional, List
from datetime import datetime
from ninja import Schema


class TrainingModuleOutSchema(Schema):
    """Schema de saída para módulos de treinamento."""
    id: int
    title: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    order_index: int
    required_step: int
    duration_minutes: int
    is_active: bool


class TrainingModuleWithProgressSchema(Schema):
    """Schema de módulo com status de progresso do usuário."""
    id: int
    title: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    order_index: int
    required_step: int
    duration_minutes: int
    is_completed: bool = False
    completed_at: Optional[datetime] = None
    is_locked: bool = False


class ModuleProgressUpdateSchema(Schema):
    """Schema para marcar módulo como concluído."""
    module_id: int
    completed: bool = True


class TrainingOverviewSchema(Schema):
    """Schema para visão geral do treinamento."""
    total_modules: int
    completed_modules: int
    available_modules: int
    locked_modules: int
    progress_percentage: float
    modules: List[TrainingModuleWithProgressSchema]
