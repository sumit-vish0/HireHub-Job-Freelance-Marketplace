from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):

    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user
        ).order_by("-created_at")


class NotificationMarkReadView(generics.UpdateAPIView):

    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user
        )

    def patch(self, request, *args, **kwargs):

        notification = get_object_or_404(
            self.get_queryset(),
            pk=kwargs["pk"]
        )

        notification.is_read = True
        notification.save()

        return Response(
            NotificationSerializer(notification).data,
            status=status.HTTP_200_OK
        )