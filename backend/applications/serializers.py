from rest_framework import serializers

from .models import Application, Interview


class ApplicationSerializer(serializers.ModelSerializer):

    candidate_name = serializers.CharField(
        source="candidate.username",
        read_only=True
    )

    job_title = serializers.CharField(
        source="job.title",
        read_only=True
    )

    class Meta:
        model = Application

        fields = [
            "id",
            "job",
            "job_title",
            "candidate",
            "candidate_name",
            "resume",
            "cover_letter",
            "status",
            "applied_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "candidate",
            "job_title",
            "candidate_name",
            "applied_at",
            "updated_at",
        ]

    def validate_status(self, value):

        request = self.context.get("request")

        if request and request.user.is_authenticated:

            if request.user.role != "RECRUITER":

                raise serializers.ValidationError(
                    "Only recruiters can change application status."
                )

        return value


class InterviewSerializer(serializers.ModelSerializer):

    application_id = serializers.IntegerField(
        source="application.id",
        read_only=True
    )

    candidate_name = serializers.CharField(
        source="application.candidate.username",
        read_only=True
    )

    job_title = serializers.CharField(
        source="application.job.title",
        read_only=True
    )

    class Meta:
        model = Interview
        fields = [
            "id",
            "application",
            "application_id",
            "candidate_name",
            "job_title",
            "scheduled_at",
            "meeting_link",
            "notes",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "application_id",
            "candidate_name",
            "job_title",
            "created_at",
        ]