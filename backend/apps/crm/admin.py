from django.contrib import admin
from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'status', 'strategist', 'potential_value', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'email', 'phone']
    list_editable = ['status']
    readonly_fields = ['id', 'created_at', 'updated_at']
    raw_id_fields = ['strategist']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Informações do Lead', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Status e Valor', {
            'fields': ('status', 'potential_value', 'strategist')
        }),
        ('Notas', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
