from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from django.db.models import Count, Q

from .models import CandidateProfile
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    CandidateProfileSerializer,
)

from job.models import Job
from applications.models import Application


class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
            {
                "message": "Registration successful.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "role": user.role,
                },
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {
                    "detail": "Refresh token is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            token = RefreshToken(refresh_token)
            token.blacklist()

        except Exception:

            return Response(
                {
                    "detail": "Invalid or expired refresh token."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "message": "Logout successful."
            },
            status=status.HTTP_200_OK,
        )
class MeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response(
            {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
                "role": request.user.role,
            }
        )


class CandidateProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "CANDIDATE":

            return Response(
                {
                    "detail": "Only candidates have profiles."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        profile = CandidateProfile.objects.get(
            user=request.user
        )

        serializer = CandidateProfileSerializer(
            profile,
            context={"request": request},
        )

        return Response(serializer.data)

    def put(self, request):

        if request.user.role != "CANDIDATE":

            return Response(
                {
                    "detail": "Only candidates can update profiles."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        profile = CandidateProfile.objects.get(
            user=request.user
        )

        serializer = CandidateProfileSerializer(
            profile,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(serializer.data)


class RecruiterDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "RECRUITER":

            return Response(
                {
                    "detail": "Only recruiters can access this dashboard."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        jobs = Job.objects.filter(
            company__recruiter=request.user
        )

        applications = Application.objects.filter(
            job__company__recruiter=request.user
        )

        recent_applications = (
            applications
            .select_related("candidate", "job")
            .order_by("-applied_at")[:5]
        )

        recent_data = []

        for application in recent_applications:

            recent_data.append(
                {
                    "id": application.id,
                    "candidate": application.candidate.username,
                    "job": application.job.title,
                    "status": application.status,
                    "applied_at": application.applied_at,
                }
            )

        data = {
            "total_jobs": jobs.count(),

            "active_jobs": jobs.filter(
                is_active=True
            ).count(),

            "total_applications": applications.count(),

            "shortlisted": applications.filter(
                status="SHORTLISTED"
            ).count(),

            "interviews": applications.filter(
                status="INTERVIEW"
            ).count(),

            "hired": applications.filter(
                status="HIRED"
            ).count(),

            "rejected": applications.filter(
                status="REJECTED"
            ).count(),

            "recent_applications": recent_data,
        }

        return Response(data)


class CandidateDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "CANDIDATE":

            return Response(
                {
                    "detail": "Only candidates can access this dashboard."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        applications = Application.objects.filter(
            candidate=request.user
        )

        stats = applications.aggregate(

            total=Count("id"),

            applied=Count(
                "id",
                filter=Q(status="APPLIED"),
            ),

            shortlisted=Count(
                "id",
                filter=Q(status="SHORTLISTED"),
            ),

            interviews=Count(
                "id",
                filter=Q(status="INTERVIEW"),
            ),

            hired=Count(
                "id",
                filter=Q(status="HIRED"),
            ),

            rejected=Count(
                "id",
                filter=Q(status="REJECTED"),
            ),
        )

        recent_applications = (
            applications
            .select_related("job")
            .order_by("-applied_at")[:5]
        )

        recent_data = []

        for application in recent_applications:

            recent_data.append(
                {
                    "id": application.id,
                    "job": application.job.title,
                    "status": application.status,
                    "applied_at": application.applied_at,
                }
            )

        return Response(
            {
                "total_applications": stats["total"],
                "applied": stats["applied"],
                "shortlisted": stats["shortlisted"],
                "interviews": stats["interviews"],
                "hired": stats["hired"],
                "rejected": stats["rejected"],
                "recent_applications": recent_data,
            }
        )


