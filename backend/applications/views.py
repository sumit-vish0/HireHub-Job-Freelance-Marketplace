from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError

from accounts.permissions import IsCandidate, IsRecruiter

from .models import Application, Interview
from .serializers import (
    ApplicationSerializer,
    InterviewSerializer,
)

from notifications.models import Notification


class ApplicationViewSet(viewsets.ModelViewSet):

    serializer_class = ApplicationSerializer

    def get_queryset(self):

        user = self.request.user

        if not user.is_authenticated:
            return Application.objects.none()

        # Candidate can see only their applications
        if user.role == "CANDIDATE":

            return Application.objects.filter(
                candidate=user
            ).order_by("-applied_at")

        # Recruiter can see applications for their company's jobs
        if user.role == "RECRUITER":

            return Application.objects.filter(
                job__company__recruiter=user
            ).order_by("-applied_at")

        return Application.objects.none()

    def get_permissions(self):

        # Only candidates can apply
        if self.action == "create":
            return [IsCandidate()]

        return [IsAuthenticated()]

    def perform_create(self, serializer):

        job = serializer.validated_data["job"]

        # Prevent duplicate application
        if Application.objects.filter(
            job=job,
            candidate=self.request.user
        ).exists():

            raise ValidationError(
                "You have already applied for this job."
            )

        # Automatically assign logged-in candidate
        serializer.save(
            candidate=self.request.user
        )

    def update_application_status(self, request, application):

        # Only recruiters can change status
        if request.user.role != "RECRUITER":

            return Response(
                {
                    "detail": "Only recruiters can change application status."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        new_status = request.data.get("status")

        if not new_status:

            return Response(
                {
                    "status": "This field is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        valid_statuses = [
            Application.Status.SHORTLISTED,
            Application.Status.INTERVIEW,
            Application.Status.REJECTED,
            Application.Status.HIRED,
        ]

        if new_status not in valid_statuses:

            return Response(
                {
                    "status": "Invalid application status."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        old_status = application.status

        if old_status == new_status:

            return Response(
                {
                    "detail": "Application already has this status."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        application.status = new_status
        application.save()

        messages = {

            Application.Status.SHORTLISTED:
                f"Your application for "
                f"{application.job.title} "
                f"has been shortlisted.",

            Application.Status.INTERVIEW:
                f"Your application for "
                f"{application.job.title} "
                f"has moved to the interview stage.",

            Application.Status.HIRED:
                f"Congratulations! You have been "
                f"hired for {application.job.title}.",

            Application.Status.REJECTED:
                f"Your application for "
                f"{application.job.title} "
                f"has been rejected.",
        }

        Notification.objects.create(
            user=application.candidate,
            message=messages[new_status],
            notification_type=new_status,
        )

        serializer = self.get_serializer(application)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def partial_update(self, request, *args, **kwargs):

        application = self.get_object()

        return self.update_application_status(
            request,
            application
        )

    def update(self, request, *args, **kwargs):

        application = self.get_object()

        return self.update_application_status(
            request,
            application
        )


class InterviewViewSet(viewsets.ModelViewSet):

    serializer_class = InterviewSerializer

    def get_queryset(self):

        user = self.request.user

        if user.role == "RECRUITER":

            return Interview.objects.filter(
                application__job__company__recruiter=user
            ).select_related(
                "application",
                "application__candidate",
                "application__job",
            )

        if user.role == "CANDIDATE":

            return Interview.objects.filter(
                application__candidate=user
            ).select_related(
                "application",
                "application__job",
            )

        return Interview.objects.none()

    def get_permissions(self):

        if self.action == "create":

            return [IsRecruiter()]

        if self.action in [
            "update",
            "partial_update",
            "destroy",
        ]:

            return [IsRecruiter()]

        return [IsAuthenticated()]

    def perform_create(self, serializer):

        application = serializer.validated_data["application"]

        # Recruiter must own the job's company
        if application.job.company.recruiter != self.request.user:

            raise PermissionDenied(
                "You cannot schedule an interview for this application."
            )

        # Interview can only be scheduled after shortlist
        if application.status != "SHORTLISTED":

            raise ValidationError(
                "Interview can only be scheduled for shortlisted applications."
            )

        interview = serializer.save()

        # Change application status
        application.status = "INTERVIEW"
        application.save()

        # Notify candidate
        Notification.objects.create(
            user=application.candidate,
            message=(
                f"Your interview for "
                f"{application.job.title} "
                f"has been scheduled."
            ),
            notification_type="INTERVIEW",
        )

    def perform_update(self, serializer):

        interview = serializer.save()

        application = interview.application

        Notification.objects.create(
            user=application.candidate,
            message=(
                f"Your interview for "
                f"{application.job.title} "
                f"has been updated."
            ),
            notification_type="INTERVIEW",
        )

    def perform_destroy(self, instance):

        application = instance.application

        instance.delete()

        # Return application to shortlisted
        application.status = "SHORTLISTED"
        application.save()

        Notification.objects.create(
            user=application.candidate,
            message=(
                f"Your interview for "
                f"{application.job.title} "
                f"has been cancelled."
            ),
            notification_type="INTERVIEW",
        )