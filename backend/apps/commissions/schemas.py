"""
Pydantic schemas for Commissions API endpoints.
"""
from typing import Optional, List
from decimal import Decimal
from datetime import datetime
from ninja import Schema
from uuid import UUID


class CommissionOutSchema(Schema):
    """Schema de saída para comissões."""
    id: int
    strategist_id: UUID
    lead_id: Optional[int] = None
    amount: Decimal
    status: str
    description: Optional[str] = None
    paid_at: Optional[datetime] = None
    created_at: datetime


class CommissionSummarySchema(Schema):
    """Schema para resumo de comissões."""
    total_earned: Decimal
    total_pending: Decimal
    total_paid: Decimal
    pending_count: int
    paid_count: int
    commissions: List[CommissionOutSchema]


class CommissionRulesSchema(Schema):
    """Schema para regras de comissionamento."""
    title: str
    description: str
    tiers: List[dict]
