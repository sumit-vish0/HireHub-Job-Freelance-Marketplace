from django.contrib import admin
from .models import Application, Interview


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "candidate",
        "job",
        "status",
        "applied_at",
    )

    list_filter = (
        "status",
        "applied_at",
    )

    search_fields = (
        "candidate__username",
        "job__title",
    )


@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = (
        "application",
        "scheduled_at",
        "meeting_link",
    )

    list_filter = ("scheduled_at",)