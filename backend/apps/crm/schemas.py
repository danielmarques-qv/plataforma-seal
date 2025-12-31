"""
Pydantic schemas for CRM API endpoints.
"""
from typing import Optional, List
from decimal import Decimal
from datetime import datetime
from ninja import Schema
from uuid import UUID


class LeadCreateSchema(Schema):
    """Schema para criação de novo lead."""
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    potential_value: Decimal = 0
    notes: Optional[str] = None
    status: str = 'RADAR'


class LeadUpdateSchema(Schema):
    """Schema para atualização de lead."""
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    potential_value: Optional[Decimal] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class LeadOutSchema(Schema):
    """Schema de saída para dados do lead."""
    id: int
    strategist_id: UUID
    status: str
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    potential_value: Decimal
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class LeadMoveSchema(Schema):
    """Schema para mover lead entre colunas do Kanban."""
    status: str


class KanbanBoardSchema(Schema):
    """Schema para retorno do board Kanban completo."""
    RADAR: List[LeadOutSchema] = []
    COMBATE: List[LeadOutSchema] = []
    EXTRAÇÃO: List[LeadOutSchema] = []
    RESGATE: List[LeadOutSchema] = []
    total_count: int = 0
    families_saved: int = 0
