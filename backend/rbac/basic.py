"""
Handling permissions for users who are assigned 
for basic level actions in the project. (view few data, modify some of their data etc).
UserTypes: Student, Parent, Staff
"""
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse


@login_required
def permission_error(request):
    return HttpResponse("You don't have right or permission to access this page.")


def user_is_verified(user):
    return user.is_active if user.is_authenticated else False


def user_is_staff(user):
    return (
        user_is_verified(user) and user.requested_role == "staff"
        if user.is_authenticated
        else False
    )


def user_is_parent(user):
    return (
        user_is_verified(user) and user.requested_role == "parent"
        if user.is_authenticated
        else False
    )


def user_is_student(user):
    return (
        user_is_verified(user) and user.requested_role == "student"
        if user.is_authenticated
        else False
    )
