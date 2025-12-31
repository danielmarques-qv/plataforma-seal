"""
Commission model - Maps to seal.commissions table in Supabase.
Tracks commissions earned by strategists.
"""
from django.db import models
from apps.profiles.models import Profile
from apps.crm.models import Lead


class Commission(models.Model):
    """
    Comissão do Estrategista SEAL.
    Rastreia comissões pendentes e pagas.
    """
    
    # Status constants
    STATUS_PENDING = 'PENDING'
    STATUS_APPROVED = 'APPROVED'
    STATUS_PAID = 'PAID'
    STATUS_CANCELLED = 'CANCELLED'
    
    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pendente'),
        (STATUS_APPROVED, 'Aprovada'),
        (STATUS_PAID, 'Paga'),
        (STATUS_CANCELLED, 'Cancelada'),
    ]
    
    id = models.BigAutoField(primary_key=True)
    
    strategist = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='commissions',
        db_column='strategist_id',
        help_text="Estrategista que recebe a comissão"
    )
    
    lead = models.ForeignKey(
        Lead,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='commissions',
        db_column='lead_id',
        help_text="Lead associado à comissão"
    )
    
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Valor da comissão"
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
        help_text="Status da comissão"
    )
    
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Descrição ou observações"
    )
    
    paid_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Data do pagamento"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        managed = False  # Não sobrescrever o banco existente do Supabase
        db_table = '"seal"."commissions"'
        verbose_name = 'Comissão'
        verbose_name_plural = 'Comissões'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"R$ {self.amount} ({self.status}) - {self.strategist}"
