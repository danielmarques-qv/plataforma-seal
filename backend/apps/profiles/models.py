"""
Profile model - Maps to seal.profiles table in Supabase.
Central user state and gamification data.
"""
import uuid
from django.db import models


class Profile(models.Model):
    """
    Perfil do Operador SEAL.
    Centraliza estado do usuário e dados de gamificação.
    """
    
    # Onboarding steps constants
    STEP_CADASTRO = 0      # Recruta - Cadastro inicial
    STEP_KICKOFF = 1       # Briefing - Agendamento de kickoff
    STEP_CONTRATO = 2      # Engajamento - Contrato e treinamento
    STEP_OPERACIONAL = 3   # Operacional - Acesso total
    
    ONBOARDING_CHOICES = [
        (STEP_CADASTRO, 'Recruta'),
        (STEP_KICKOFF, 'Briefing'),
        (STEP_CONTRATO, 'Engajamento'),
        (STEP_OPERACIONAL, 'Operacional'),
    ]
    
    id = models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4,
        help_text="Referência ao auth.users do Supabase"
    )
    
    onboarding_step = models.IntegerField(
        default=0,
        choices=ONBOARDING_CHOICES,
        help_text="Etapa atual do onboarding: 0=Cadastro, 1=Kickoff, 2=Contrato, 3=Operacional"
    )
    
    email = models.TextField(
        blank=True, 
        null=True,
        help_text="Email do operador"
    )
    
    full_name = models.TextField(
        blank=True, 
        null=True,
        help_text="Nome completo do operador"
    )
    
    phone = models.TextField(
        blank=True, 
        null=True,
        help_text="Telefone de contato"
    )
    
    pix_key = models.TextField(
        blank=True, 
        null=True,
        help_text="Chave PIX para pagamentos"
    )
    
    financial_goal = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=0,
        help_text="Meta financeira mensal (Input de Sonhos)"
    )
    
    current_commission = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=0,
        help_text="Soma de comissões ganhas"
    )
    
    families_saved_count = models.IntegerField(
        default=0,
        help_text="Contador de famílias salvas (leads em RESGATE)"
    )
    
    heptagram_scores = models.JSONField(
        default=dict,
        blank=True,
        help_text="Notas do quizz Heptagrama (ex: {'tecnica': 8, 'venda': 5})"
    )
    
    dream_description = models.TextField(
        blank=True, 
        null=True,
        help_text="Descrição dos objetivos pessoais do operador"
    )
    
    commission_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=5.00,
        help_text="Porcentagem de comissão do estrategista (padrão: 5%)"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        managed = False  # Não sobrescrever o banco existente do Supabase
        db_table = '"seal"."profiles"'
        verbose_name = 'Perfil'
        verbose_name_plural = 'Perfis'
    
    def __str__(self):
        return f"{self.full_name or 'Operador'} (Step {self.onboarding_step})"
    
    @property
    def is_operational(self) -> bool:
        """Verifica se o operador tem acesso operacional completo."""
        return self.onboarding_step >= self.STEP_OPERACIONAL
    
    @property
    def progress_percentage(self) -> float:
        """Calcula o progresso em direção à meta financeira."""
        if self.financial_goal and self.financial_goal > 0:
            return min(100, (float(self.current_commission) / float(self.financial_goal)) * 100)
        return 0
