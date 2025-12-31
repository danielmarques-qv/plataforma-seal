from django.contrib import admin
from .models import Onboarding


@admin.register(Onboarding)
class OnboardingAdmin(admin.ModelAdmin):
    list_display = ['id', 'person', 'time', 'calendly_event_uri', 'created_at']
    list_filter = ['created_at', 'time']
    search_fields = ['person__full_name', 'calendly_event_uri']
    readonly_fields = ['id', 'created_at']
    raw_id_fields = ['person']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Agendamento', {
            'fields': ('person', 'time', 'calendly_event_uri')
        }),
        ('Datas', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
