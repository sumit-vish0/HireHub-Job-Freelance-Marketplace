"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

"""
URL configuration for config project.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

from accounts.views import LoginView

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),
    # Accounts
    path("api/accounts/", include("accounts.urls")),
    # Custom Login
    path(
        "api/auth/login/",
        LoginView.as_view(),
        name="login",
    ),
    # JWT Refresh
    path(
        "api/auth/token/refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh",
    ),
    # JWT Verify
    path(
        "api/auth/token/verify/",
        TokenVerifyView.as_view(),
        name="token-verify",
    ),
    # Jobs
    path("api/", include("job.urls")),
    # Applications
    path("api/", include("applications.urls")),
    # Notifications
    path("api/notifications/", include("notifications.urls")),
    # Companies
    path("api/", include("companies.urls")),
]


# Media files during development
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
