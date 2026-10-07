from django.contrib.auth.models import AbstractUser
from django.db import models
from job.models import Skill

class User(AbstractUser):
    
    class Role(models.TextChoices):
        CANDIDATE ="CANDIDATE","Candidate"
        RECRUITER="RECRUITER","Recruiter"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CANDIDATE
    )

    def __str__(self):
        return self.username
    
class CandidateProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="candidate_profile"
    )

    phone = models.CharField(
        max_length=15,
        blank=True
    )

    bio = models.TextField(
        blank=True
    )

    location = models.CharField(
        max_length=150,
        blank=True
    )

    resume = models.FileField(
        upload_to="candidate_resumes/",
        blank=True,
        null=True
    )

    github = models.URLField(
        blank=True
    )

    linkedin = models.URLField(
        blank=True
    )

    skills = models.ManyToManyField(
        Skill,
        blank=True,
        related_name="candidate_profiles"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.user.username}'s Profile"