from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from accounts.permissions import (
    IsRecruiter,
    IsCompanyOwner,
)

from .models import Company
from .serializers import CompanySerializer


class CompanyViewSet(viewsets.ModelViewSet):

    queryset = Company.objects.all().order_by("-created_at")

    serializer_class = CompanySerializer

    def get_permissions(self):

        if self.action == "create":
            return [IsRecruiter()]

        if self.action in [
            "update",
            "partial_update",
            "destroy",
        ]:
            return [IsCompanyOwner()]

        return [AllowAny()]

    def get_queryset(self):

        user = self.request.user

        if (
            user.is_authenticated
            and user.role == "RECRUITER"
        ):
            return Company.objects.filter(
                recruiter=user
            )

        return Company.objects.all().order_by(
            "-created_at"
        )

    def perform_create(self, serializer):

        serializer.save(
            recruiter=self.request.user
        )