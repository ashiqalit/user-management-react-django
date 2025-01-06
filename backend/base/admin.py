from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserProfile


class CustomUserAdmin(UserAdmin):
    list_display = (
        "email",
        "first_name",
        "last_name",
        "username",
        "last_login",
        "date_joined",
        "is_active",
        "is_admin",
        "is_superadmin",
    )

    search_fields = ("email", "username", "first_name", "last_name")

    list_filter = ("is_active", "is_admin", "is_superadmin")

    readonly_fields = ("date_joined", "last_login")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Personal Info",
            {"fields": ("first_name", "last_name", "username")},
        ),
        (
            "Permissions",
            {"fields": ("is_admin", "is_active", "is_staff", "is_superadmin")},
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    ordering = ("email",)

    filter_horizontal = ()


class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "profile_picture")
    search_fields = ("user__first_name", "user__last_name", "user__email")

    fieldsets = ((None, {"fields": ("user", "profile_picture")}),)


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
