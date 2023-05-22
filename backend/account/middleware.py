from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.urls import resolve

from .models import AuditLog

User = get_user_model()


def audit_log_middleware(get_response):
    # One-time configuration and initialization.

    def middleware(request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        response = get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        if request.method in ["POST", "PUT", "PATCH", "DELETE"] and not isinstance(
            request.user, AnonymousUser
        ):
            view = resolve(request.path_info).func

            # Exclude sensitive information from logging
            if hasattr(view, "exclude_logging_fields"):
                excluded_fields = view.exclude_logging_fields
                request_data = request.data.copy()
                for field in excluded_fields:
                    request_data.pop(field, None)
            else:
                request_data = None

            action = request.method
            user = request.user
            path = request.path

            # Check if the view has an object and object_id
            if hasattr(view, "kwargs"):
                object_type = view.__class__.__name__
                object_id = view.kwargs.get("pk")
            else:
                object_type = None
                object_id = None

            if object_type and object_id:
                AuditLog.objects.create(
                    action=action,
                    object_type=object_type,
                    object_id=object_id,
                    user=user,
                )
            else:
                AuditLog.objects.create(
                    action=action,
                    path=path,
                    user=user,
                )

        return response

    return middleware


class AuditLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if request.method in ["POST", "PUT", "PATCH", "DELETE"] and not isinstance(
            request.user, AnonymousUser
        ):
            view = resolve(request.path_info).func

            # Exclude sensitive information from logging
            if hasattr(view, "exclude_logging_fields"):
                excluded_fields = view.exclude_logging_fields
                request_data = request.data.copy()
                for field in excluded_fields:
                    request_data.pop(field, None)
            else:
                request_data = None

            action = request.method
            user = request.user
            path = request.path

            # Check if the view has an object and object_id
            if hasattr(view, "kwargs"):
                object_type = view.__class__.__name__
                object_id = view.kwargs.get("pk")
            else:
                object_type = None
                object_id = None

            if object_type and object_id:
                AuditLog.objects.create(
                    action=action,
                    object_type=object_type,
                    object_id=object_id,
                    user=user,
                )
            else:
                AuditLog.objects.create(
                    action=action,
                    path=path,
                    user=user,
                )

        return response
