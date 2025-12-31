"""
Training Module model - Maps to seal.training_modules table in Supabase.
Manages training videos and content for strategists.
"""
from django.db import models


class TrainingModule(models.Model):
    """
    Módulo de Treinamento SEAL.
    Vídeos e conteúdos para capacitação de estrategistas.
    """
    
    id = models.BigAutoField(primary_key=True)
    
    title = models.TextField(
        help_text="Título do módulo de treinamento"
    )
    
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Descrição detalhada do módulo"
    )
    
    video_url = models.TextField(
        blank=True,
        null=True,
        help_text="URL do vídeo (YouTube, Vimeo, etc.)"
    )
    
    thumbnail_url = models.TextField(
        blank=True,
        null=True,
        help_text="URL da thumbnail do vídeo"
    )
    
    order_index = models.IntegerField(
        default=0,
        help_text="Ordem de exibição do módulo"
    )
    
    required_step = models.IntegerField(
        default=0,
        help_text="Step mínimo do onboarding para visualizar este módulo"
    )
    
    duration_minutes = models.IntegerField(
        default=0,
        help_text="Duração estimada do módulo em minutos"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Se o módulo está ativo e visível"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        managed = False  # Não sobrescrever o banco existente do Supabase
        db_table = '"seal"."training_modules"'
        verbose_name = 'Módulo de Treinamento'
        verbose_name_plural = 'Módulos de Treinamento'
        ordering = ['order_index']
    
    def __str__(self):
        return f"{self.order_index}. {self.title}"


class ModuleProgress(models.Model):
    """
    Progresso do usuário em módulos de treinamento.
    Rastreia quais módulos foram assistidos.
    """
    
    id = models.BigAutoField(primary_key=True)
    
    profile = models.ForeignKey(
        'profiles.Profile',
        on_delete=models.CASCADE,
        related_name='module_progress',
        db_column='profile_id'
    )
    
    module = models.ForeignKey(
        TrainingModule,
        on_delete=models.CASCADE,
        related_name='progress_records',
        db_column='module_id'
    )
    
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        managed = False
        db_table = '"seal"."module_progress"'
        verbose_name = 'Progresso de Módulo'
        verbose_name_plural = 'Progressos de Módulos'
        unique_together = ['profile', 'module']
    
    def __str__(self):
        status = "✓" if self.completed else "○"
        return f"{status} {self.profile} - {self.module}"
