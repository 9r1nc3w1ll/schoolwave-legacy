"""
Handling permissions for editors who are assigned to perform few important actions.
e.g. create article, moderate user profiles, department and other academic moderations.
UserTypes: Teacher, (AcademicOfficer, Hod, Editors) - These might be added later
"""
from .basic import user_is_verified


def user_is_teacher(user):
    return user_is_verified(user) and user.requested_role == 'teacher' \
        if user.is_authenticated else False
