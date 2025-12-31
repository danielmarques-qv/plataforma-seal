"""
Onboarding API endpoints - Calendly integration.
"""
from datetime import datetime
from ninja import Router
from django.http import HttpRequest

from core.auth import supabase_auth
from apps.profiles.models import Profile
from .models import Onboarding
from .schemas import (
    OnboardingOutSchema,
    CalendlyWebhookPayload,
    CheckScheduleSchema,
    MessageSchema,
)

router = Router()


@router.get("/check-schedule", response=CheckScheduleSchema, auth=supabase_auth)
def check_schedule(request):
    """
    Verifica se o usuário logado tem uma reunião agendada.
    """
    profile = request.auth
    
    # Busca agendamento para este perfil
    schedule = Onboarding.objects.filter(person=profile).first()
    
    if schedule:
        return {
            "has_schedule": True,
            "schedule_time": schedule.time
        }
    
    return {
        "has_schedule": False,
        "schedule_time": None
    }


@router.post("/calendly-webhook", response=MessageSchema)
def calendly_webhook(request: HttpRequest):
    """
    Webhook para receber eventos do Calendly.
    Quando uma reunião é marcada, registra na tabela onboarding.
    """
    import json
    
    try:
        body = json.loads(request.body)
        event_type = body.get('event')
        payload = body.get('payload', {})
        
        print(f"[Calendly Webhook] Evento: {event_type}")
        print(f"[Calendly Webhook] Payload: {payload}")
        
        # Evento de criação de agendamento
        if event_type == 'invitee.created':
            invitee = payload.get('invitee', {})
            event = payload.get('event', {})
            
            email = invitee.get('email', '').lower()
            event_uri = event.get('uri', '')
            start_time_str = event.get('start_time', '')
            
            print(f"[Calendly] Email: {email}, Start: {start_time_str}")
            
            if email and start_time_str:
                # Busca o perfil pelo email
                try:
                    profile = Profile.objects.get(email__iexact=email)
                    
                    # Parse da data
                    start_time = datetime.fromisoformat(start_time_str.replace('Z', '+00:00'))
                    
                    # Cria ou atualiza o registro de onboarding
                    onboarding, created = Onboarding.objects.update_or_create(
                        person=profile,
                        defaults={
                            'time': start_time,
                            'calendly_event_uri': event_uri
                        }
                    )
                    
                    # Avança o perfil para o próximo step se ainda estiver no step 1
                    if profile.onboarding_step == Profile.STEP_KICKOFF:
                        profile.onboarding_step = Profile.STEP_CONTRATO
                        profile.save()
                        print(f"[Calendly] Perfil {email} avançado para step {Profile.STEP_CONTRATO}")
                    
                    return {"status": "ok", "message": f"Agendamento registrado para {email}"}
                    
                except Profile.DoesNotExist:
                    print(f"[Calendly] Perfil não encontrado para email: {email}")
                    return {"status": "warning", "message": f"Perfil não encontrado: {email}"}
        
        # Evento de cancelamento
        elif event_type == 'invitee.canceled':
            invitee = payload.get('invitee', {})
            email = invitee.get('email', '').lower()
            
            if email:
                try:
                    profile = Profile.objects.get(email__iexact=email)
                    Onboarding.objects.filter(person=profile).delete()
                    
                    # Volta o step se necessário
                    if profile.onboarding_step == Profile.STEP_CONTRATO:
                        profile.onboarding_step = Profile.STEP_KICKOFF
                        profile.save()
                    
                    return {"status": "ok", "message": f"Agendamento cancelado para {email}"}
                except Profile.DoesNotExist:
                    pass
        
        return {"status": "ok", "message": "Evento processado"}
        
    except Exception as e:
        print(f"[Calendly Webhook] Erro: {e}")
        return {"status": "error", "message": str(e)}


@router.post("/dev-simulate-schedule", response=MessageSchema, auth=supabase_auth)
def dev_simulate_schedule(request):
    """
    [DEV ONLY] Simula um agendamento do Calendly para testes locais.
    Remove em produção!
    """
    from django.conf import settings
    
    if not settings.DEBUG:
        return {"status": "error", "message": "Endpoint disponível apenas em desenvolvimento"}
    
    profile = request.auth
    
    # Cria agendamento fake para daqui 7 dias
    from datetime import datetime, timedelta
    from django.utils import timezone
    
    fake_time = timezone.now() + timedelta(days=7)
    
    onboarding, created = Onboarding.objects.update_or_create(
        person=profile,
        defaults={
            'time': fake_time,
            'calendly_event_uri': 'dev-test-event'
        }
    )
    
    # Avança o step
    if profile.onboarding_step == Profile.STEP_KICKOFF:
        profile.onboarding_step = Profile.STEP_CONTRATO
        profile.save()
    
    return {
        "status": "ok", 
        "message": f"Agendamento simulado para {fake_time.strftime('%d/%m/%Y às %H:%M')}"
    }


@router.post("/confirm-schedule", response=MessageSchema, auth=supabase_auth)
def confirm_schedule(request):
    """
    Endpoint para polling - verifica se o usuário tem agendamento e avança o step.
    Chamado pelo frontend após redirecionar do Calendly.
    """
    profile = request.auth
    
    # Verifica se tem agendamento
    schedule = Onboarding.objects.filter(person=profile).first()
    
    if schedule:
        # Avança para o próximo step se ainda não avançou
        if profile.onboarding_step == Profile.STEP_KICKOFF:
            profile.onboarding_step = Profile.STEP_CONTRATO
            profile.save()
        
        return {
            "status": "ok", 
            "message": f"Reunião confirmada para {schedule.time.strftime('%d/%m/%Y às %H:%M')}"
        }
    
    return {
        "status": "pending",
        "message": "Aguardando confirmação do agendamento"
    }
