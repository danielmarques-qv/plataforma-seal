"""
Pydantic schemas for Profile API endpoints.
"""
from typing import Optional, Dict
from decimal import Decimal
from ninja import Schema
from uuid import UUID


class HeptagramScoresSchema(Schema):
    """Schema para notas do Heptagrama (quizz de 7 dimensões)."""
    tecnica: int = 0
    venda: int = 0
    comunicacao: int = 0
    lideranca: int = 0
    resiliencia: int = 0
    organizacao: int = 0
    mindset: int = 0


class ProfileOutSchema(Schema):
    """Schema de saída para dados do perfil."""
    id: UUID
    onboarding_step: int
    full_name: Optional[str] = None
    phone: Optional[str] = None
    pix_key: Optional[str] = None
    financial_goal: Decimal
    current_commission: Decimal
    families_saved_count: int
    heptagram_scores: Dict = {}
    dream_description: Optional[str] = None
    progress_percentage: float


class ProfileCreateSchema(Schema):
    """Schema para criação/atualização inicial do perfil (Step 0)."""
    full_name: str
    phone: str
    pix_key: str
    financial_goal: Decimal
    dream_description: Optional[str] = None
    heptagram_scores: Dict


class ProfileUpdateSchema(Schema):
    """Schema para atualização parcial do perfil."""
    full_name: Optional[str] = None
    phone: Optional[str] = None
    pix_key: Optional[str] = None
    financial_goal: Optional[Decimal] = None
    dream_description: Optional[str] = None
    heptagram_scores: Optional[Dict] = None


class OnboardingStepUpdateSchema(Schema):
    """Schema para avançar o onboarding step."""
    step: int


class MessageSchema(Schema):
    """Schema padrão para mensagens de resposta."""
    status: str
    message: str
