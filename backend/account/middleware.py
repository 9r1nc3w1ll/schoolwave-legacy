from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.core.handlers.wsgi import WSGIRequest
from django.urls import resolve
from rest_framework.response import Response

from .models import AuditLog


def audit_log_middleware(get_response):
    def middleware(request: WSGIRequest):
        record = None
        shouldRun = request.method in [
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
        ] and not isinstance(request.user, AnonymousUser)

        if shouldRun:
            record = AuditLog.objects.create(
                actor=request.user, action=request.method, path=request.path
            )

        response: Response = get_response(request)

        return response

    return middleware
