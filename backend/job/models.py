from django.db import models
from django.conf import settings


class Skill(models.Model):
    
    name =  models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
class Job(models.Model):
    
    class JobType(models.TextChoices):
        FULL_TIME = "FULL_TIME","Full Time"
        PART_TIME = "PART_TIME" , "Part Time"
        CONTRACT = "CONTRACT", "Contract"
        INTERNSHIP = "INTERNSHIP", "Internship"
        
    company = models.ForeignKey(
        "companies.Company",
        on_delete=models.CASCADE,
        related_name="jobs"
    )
    
    title = models.CharField(max_length=200)

    description = models.TextField()

    location = models.CharField(max_length=150)

    job_type = models.CharField(
        max_length=20,
        choices=JobType.choices,
        default=JobType.FULL_TIME
    )
    
    experience_required = models.PositiveIntegerField(
        default=0
    )
    
    salary_min = models.PositiveIntegerField(
        null=True, 
        blank=True
    )
    
    salary_max = models.PositiveIntegerField(
        null=True, 
        blank=True
    )
    
    skills =models.ManyToManyField(
        Skill, related_name="jobs"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    is_active =models.BooleanField(default=True)

    def __str__(self):
        return self.title