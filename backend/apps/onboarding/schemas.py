"""
Pydantic schemas for Onboarding API endpoints.
"""
from typing import Optional
from datetime import datetime
from ninja import Schema
from uuid import UUID


class OnboardingOutSchema(Schema):
    """Schema de saída para agendamento."""
    id: int
    person_id: UUID
    time: datetime
    calendly_event_uri: Optional[str] = None


class CalendlyWebhookPayload(Schema):
    """Schema para payload do webhook do Calendly."""
    event: str
    payload: dict


class CheckScheduleSchema(Schema):
    """Schema para verificar se usuário tem agendamento."""
    has_schedule: bool
    schedule_time: Optional[datetime] = None


class MessageSchema(Schema):
    """Schema padrão para mensagens."""
    status: str
    message: str
