from django.contrib import admin
from .models import Commission


@admin.register(Commission)
class CommissionAdmin(admin.ModelAdmin):
    list_display = ['id', 'strategist', 'lead', 'amount', 'status', 'paid_at', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['strategist__full_name', 'lead__name']
    list_editable = ['status']
    readonly_fields = ['id', 'created_at']
    raw_id_fields = ['strategist', 'lead']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Comissão', {
            'fields': ('strategist', 'lead', 'amount', 'status', 'paid_at')
        }),
        ('Detalhes', {
            'fields': ('description',),
            'classes': ('collapse',)
        }),
        ('Datas', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
