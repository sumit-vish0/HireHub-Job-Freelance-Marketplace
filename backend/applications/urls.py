from rest_framework.routers import DefaultRouter

from .views import (
    ApplicationViewSet,
    InterviewViewSet,
)


router = DefaultRouter()

router.register(
    "applications",
    ApplicationViewSet,
    basename="application"
)

router.register(
    "interviews",
    InterviewViewSet,
    basename="interview"
)


urlpatterns = router.urls