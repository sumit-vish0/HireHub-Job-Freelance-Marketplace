from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User ,CandidateProfile


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    fieldsets = UserAdmin.fieldsets + (
        ("HireHub Information", {
            "fields": ("role",),
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ("HireHub Information", {
            "fields": ("email", "role"),
        }),
    )

    list_display = (
        "username",
        "email",
        "role",
        "is_staff",
        "is_active",
    )

    list_filter = (
        "role",
        "is_staff",
        "is_active",
    )

    search_fields = (
        "username",
        "email",
    )

@admin.register(CandidateProfile)
class CandidateProfileAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "location",
        "created_at",
    )

    search_fields = (
        "user__username",
        "user__email",
        "location",
    )

    filter_horizontal = (
        "skills",
    )