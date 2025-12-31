"""
Onboarding model - Maps to seal.onboarding table in Supabase.
Tracks meeting schedules from Calendly.
"""
from django.db import models
from apps.profiles.models import Profile


class Onboarding(models.Model):
    """
    Registro de agendamentos do Calendly para onboarding.
    """
    
    id = models.BigAutoField(primary_key=True)
    
    person = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='onboarding_meetings',
        db_column='person',
        help_text="Perfil do usuário que agendou"
    )
    
    time = models.DateTimeField(
        help_text="Data e horário da reunião agendada"
    )
    
    calendly_event_uri = models.TextField(
        blank=True,
        null=True,
        help_text="URI do evento no Calendly"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        managed = False
        db_table = '"seal"."onboarding"'
        verbose_name = 'Agendamento Onboarding'
        verbose_name_plural = 'Agendamentos Onboarding'
        ordering = ['-time']
    
    def __str__(self):
        return f"{self.person} - {self.time}"
