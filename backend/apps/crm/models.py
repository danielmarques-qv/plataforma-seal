"""
CRM Lead model - Maps to seal.crm_leads table in Supabase.
Manages leads through the tactical pipeline.
"""
from django.db import models
from apps.profiles.models import Profile


class Lead(models.Model):
    """
    Lead do CRM - Pipeline Tático de Vendas.
    Colunas: RADAR -> COMBATE -> EXTRAÇÃO -> RESGATE
    """
    
    # Status constants (Military Tactical Pipeline)
    STATUS_RADAR = 'RADAR'          # Lead frio - identificado
    STATUS_COMBATE = 'COMBATE'      # Em reunião/negociação
    STATUS_EXTRACAO = 'EXTRAÇÃO'    # Proposta enviada
    STATUS_RESGATE = 'RESGATE'      # Venda fechada - família salva
    
    STATUS_CHOICES = [
        (STATUS_RADAR, 'RADAR - Lead Frio'),
        (STATUS_COMBATE, 'COMBATE - Em Reunião'),
        (STATUS_EXTRACAO, 'EXTRAÇÃO - Proposta Enviada'),
        (STATUS_RESGATE, 'RESGATE - Família Salva'),
    ]
    
    id = models.BigAutoField(primary_key=True)
    
    strategist = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='leads',
        db_column='strategist_id',
        help_text="Estrategista responsável pelo lead"
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_RADAR,
        help_text="Status atual no pipeline tático"
    )
    
    name = models.TextField(
        help_text="Nome do lead/cliente"
    )
    
    phone = models.TextField(
        blank=True,
        null=True,
        help_text="Telefone de contato"
    )
    
    email = models.TextField(
        blank=True,
        null=True,
        help_text="Email de contato"
    )
    
    potential_value = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        help_text="Valor potencial do negócio"
    )
    
    notes = models.TextField(
        blank=True,
        null=True,
        help_text="Observações sobre o lead"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        managed = False  # Não sobrescrever o banco existente do Supabase
        db_table = '"seal"."crm_leads"'
        verbose_name = 'Lead'
        verbose_name_plural = 'Leads'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.status})"
