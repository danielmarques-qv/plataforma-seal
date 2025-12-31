"""
Resource model - Maps to seal.resources table in Supabase.
Manages scripts, playbooks, and downloadable resources.
"""
from django.db import models


class Resource(models.Model):
    """
    Recurso do Arsenal SEAL.
    Scripts, Playbooks e documentos de apoio para estrategistas.
    """
    
    # Category constants
    CATEGORY_SCRIPT = 'SCRIPT'
    CATEGORY_PLAYBOOK = 'PLAYBOOK'
    CATEGORY_TEMPLATE = 'TEMPLATE'
    CATEGORY_GUIDE = 'GUIDE'
    
    CATEGORY_CHOICES = [
        (CATEGORY_SCRIPT, 'Script de Vendas'),
        (CATEGORY_PLAYBOOK, 'Playbook Tático'),
        (CATEGORY_TEMPLATE, 'Template'),
        (CATEGORY_GUIDE, 'Guia/Manual'),
    ]
    
    id = models.BigAutoField(primary_key=True)
    
    title = models.TextField(
        help_text="Título do recurso"
    )
    
    description = models.TextField(
        blank=True,
        null=True,
        help_text="Descrição do recurso"
    )
    
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default=CATEGORY_SCRIPT,
        help_text="Categoria do recurso"
    )
    
    file_url = models.TextField(
        help_text="URL do arquivo para download"
    )
    
    thumbnail_url = models.TextField(
        blank=True,
        null=True,
        help_text="URL da imagem de preview"
    )
    
    file_type = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        help_text="Tipo do arquivo (pdf, docx, xlsx, etc.)"
    )
    
    order_index = models.IntegerField(
        default=0,
        help_text="Ordem de exibição"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Se o recurso está ativo"
    )
    
    download_count = models.IntegerField(
        default=0,
        help_text="Contador de downloads"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        managed = False  # Não sobrescrever o banco existente do Supabase
        db_table = '"seal"."resources"'
        verbose_name = 'Recurso'
        verbose_name_plural = 'Recursos'
        ordering = ['category', 'order_index']
    
    def __str__(self):
        return f"[{self.category}] {self.title}"
