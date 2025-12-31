from django.contrib import admin
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'email', 'phone', 'onboarding_step', 'commission_percentage', 'created_at']
    list_filter = ['onboarding_step', 'created_at']
    search_fields = ['full_name', 'email', 'phone']
    list_editable = ['commission_percentage']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Identificação', {
            'fields': ('id', 'full_name', 'email', 'phone')
        }),
        ('Onboarding', {
            'fields': ('onboarding_step',)
        }),
        ('Comissão', {
            'fields': ('commission_percentage',),
            'description': 'Porcentagem de comissão sobre vendas (padrão: 5%)'
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
