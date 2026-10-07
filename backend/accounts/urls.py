from django.urls import path

from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    MeView,
    CandidateProfileView,
    RecruiterDashboardView,
    CandidateDashboardView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
    path("profile/", CandidateProfileView.as_view(), name="candidate-profile"),
    path(
        "recruiter-dashboard/",
        RecruiterDashboardView.as_view(),
        name="recruiter-dashboard",
    ),
    path(
        "candidate-dashboard/",
        CandidateDashboardView.as_view(),
        name="candidate-dashboard",
    ),
]
