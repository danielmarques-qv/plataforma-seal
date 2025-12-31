from django.contrib import admin
from .models import TrainingModule, ModuleProgress


@admin.register(TrainingModule)
class TrainingModuleAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'order_index', 'required_step', 'duration_minutes', 'is_active']
    list_filter = ['is_active', 'required_step']
    search_fields = ['title', 'description']
    list_editable = ['order_index', 'required_step', 'is_active']
    ordering = ['order_index']
    
    fieldsets = (
        ('Conteúdo', {
            'fields': ('title', 'description', 'video_url', 'thumbnail_url')
        }),
        ('Configuração', {
            'fields': ('order_index', 'required_step', 'duration_minutes', 'is_active')
        }),
    )


@admin.register(ModuleProgress)
class ModuleProgressAdmin(admin.ModelAdmin):
    list_display = ['id', 'profile', 'module', 'completed', 'completed_at']
    list_filter = ['completed', 'completed_at']
    search_fields = ['profile__full_name', 'module__title']
    readonly_fields = ['created_at', 'updated_at']
    raw_id_fields = ['profile', 'module']
