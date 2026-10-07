from rest_framework.permissions import BasePermission


class IsRecruiter(BasePermission):

    message = "Only recruiters can perform this action."

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated
            and request.user.role == "RECRUITER"
        )


class IsCandidate(BasePermission):

    message = "Only candidates can perform this action."

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated
            and request.user.role == "CANDIDATE"
        )
    
class IsJobOwner(BasePermission):

    message = "You can only modify your own jobs."

    def has_object_permission(self, request, view, obj):

        return (
            request.user.is_authenticated
            and request.user.role == "RECRUITER"
            and obj.company.recruiter == request.user
        )


class IsApplicationCandidate(BasePermission):

    message = "You can only access your own applications."

    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_authenticated
            and request.user.role == "CANDIDATE"
            and obj.candidate == request.user
        )


class IsApplicationRecruiter(BasePermission):

    message = "You can only access applications for your own jobs."

    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_authenticated
            and request.user.role == "RECRUITER"
            and obj.job.company.recruiter == request.user
        )
        
class IsCompanyOwner(BasePermission):

    message = "You can only modify your own company."

    def has_object_permission(self, request, view, obj):

        return (
            request.user.is_authenticated
            and request.user.role == "RECRUITER"
            and obj.recruiter == request.user
        )