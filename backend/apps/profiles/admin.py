from django.contrib import admin
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'email', 'phone', 'onboarding_step', 'created_at']
    list_filter = ['onboarding_step', 'created_at']
    search_fields = ['full_name', 'email', 'phone']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Identificação', {
            'fields': ('id', 'full_name', 'email', 'phone')
        }),
        ('Onboarding', {
            'fields': ('onboarding_step',)
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
