from rest_framework import permissions


class IsSchoolOwner(permissions.BasePermission):
    message = "Invalid school for logged in owner"

    def has_object_permission(self, request, view, obj):
        return obj.school.owner == request.user
