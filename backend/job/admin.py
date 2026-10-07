from django.contrib import admin
from .models import Job, Skill


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "company",
        "location",
        "job_type",
        "experience_required",
        "is_active",
        "created_at",
    )

    list_filter = (
        "job_type",
        "is_active",
        "location",
    )

    search_fields = (
        "title",
        "description",
        "location",
    )