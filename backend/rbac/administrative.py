"""
Handling permissions for administrators who are assigned to handle everything.
Admins have direct role after superuser.
UserTypes: Admin, SuperAdmin
"""
from .basic import user_is_parent, user_is_staff, user_is_student, user_is_verified
from .editor import user_is_teacher


def user_is_admin(user):
    return (
        user_is_verified(user) and user.requested_role == "admin"
        if user.is_authenticated
        else False
    )


def user_is_superuser(user):
    return user_is_admin(user) and user.is_superuser if user.is_authenticated else False


def user_is_admin_or_su(user):
    return user_is_admin(user) or user_is_superuser(user)


def user_is_staff_or_administrative(user):
    """administrative user refers to: superuser,
    admin.
    """
    return (
        user_is_admin_or_su(user) or user_is_staff(user)
        if user.is_authenticated
        else False
    )


def user_is_parent_or_administrative(user):
    """administrative user refers to: superuser,
    admin.
    """
    return (
        user_is_admin_or_su(user) or user_is_parent(user)
        if user.is_authenticated
        else False
    )


def user_is_student_or_administrative(user):
    """administrative user refers to: superuser,
    admin.
    """
    return (
        user_is_admin_or_su(user) or user_is_student(user)
        if user.is_authenticated
        else False
    )


def user_is_teacher_or_administrative(user):
    """administrative user refers to: superuser,
    admin.
    """
    return (
        user_is_admin_or_su(user) or user_is_teacher(user)
        if user.is_authenticated
        else False
    )
