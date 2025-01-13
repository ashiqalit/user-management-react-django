from django.urls import path
from . import views
from .views import (
    SignupView,
    LoginView,
    AdminTokenObtainView,
    AdminDashboardView,
    UserProfileView,
    AdminUserProfileView,
    toggle_user_status,
    admin_create_user
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("", views.getRoutes),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("admin/token/", AdminTokenObtainView.as_view(), name="admin_token"),
    path("admin/dashboard/", AdminDashboardView.as_view(), name="admin_dashboard"),
    path("user-profile/", UserProfileView.as_view(), name="user_profile"),
    path("user-profile-admin/<int:user_id>/", AdminUserProfileView.as_view(), name="user_profile"),
    path(
        "admin/users/<int:user_id>/toggle-status/",
        toggle_user_status,
        name="toggle_user_status",
    ),
    path('admin/create-user/', admin_create_user, name='admin_create_user'),
]
