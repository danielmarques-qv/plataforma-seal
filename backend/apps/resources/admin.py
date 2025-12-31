from django.contrib import admin
from .models import Resource


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'category', 'file_type', 'download_count', 'is_active', 'created_at']
    list_filter = ['category', 'file_type', 'is_active']
    search_fields = ['title', 'description']
    list_editable = ['is_active']
    readonly_fields = ['download_count', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Conteúdo', {
            'fields': ('title', 'description', 'category')
        }),
        ('Arquivo', {
            'fields': ('file_url', 'file_type', 'thumbnail_url')
        }),
        ('Estatísticas', {
            'fields': ('download_count', 'is_active')
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
