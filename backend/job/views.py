from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import AllowAny

from accounts.permissions import IsRecruiter, IsJobOwner

from .models import Job, Skill
from .serializers import JobSerializer, SkillSerializer


class JobViewSet(viewsets.ModelViewSet):

    serializer_class = JobSerializer

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = [
        "location",
        "job_type",
        "is_active",
    ]

    search_fields = [
        "title",
        "description",
        "location",
    ]

    ordering_fields = [
        "created_at",
        "salary_min",
        "salary_max",
        "experience_required",
    ]

    ordering = ["-created_at"]

    def get_queryset(self):
    
        queryset = Job.objects.all().order_by("-created_at")
    
        experience = self.request.query_params.get(
            "experience_required"
        )
    
        if experience:
        
            try:
            
                experience = int(experience)
    
                queryset = queryset.filter(
                    experience_required__gte=experience
                )
    
            except ValueError:
            
                pass
            
        return queryset

    def get_permissions(self):

        if self.action == "create":
            return [IsRecruiter()]

        if self.action in [
            "update",
            "partial_update",
            "destroy",
        ]:
            return [IsJobOwner()]

        return [AllowAny()]

    def perform_create(self, serializer):

        company = self.request.user.company

        serializer.save(company=company)


class SkillViewSet(viewsets.ModelViewSet):

    queryset = Skill.objects.all().order_by("name")

    serializer_class = SkillSerializer