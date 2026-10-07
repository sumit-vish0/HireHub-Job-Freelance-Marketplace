from rest_framework import serializers
from .models import Job, Skill


class SkillSerializer(serializers.ModelSerializer):

    class Meta:
        model = Skill
        fields = "__all__"


class JobSerializer(serializers.ModelSerializer):

    skills = serializers.PrimaryKeyRelatedField(many=True, queryset=Skill.objects.all())

    class Meta:

        model = Job

        fields = [
            "id",
            "company",
            "title",
            "description",
            "location",
            "job_type",
            "experience_required",
            "salary_min",
            "salary_max",
            "skills",
            "created_at",
            "updated_at",
            "is_active",
        ]

        read_only_fields = [
            "id",
            "company",
            "created_at",
            "updated_at",
        ]
