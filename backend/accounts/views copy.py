from rest_framework import viewsets
from rest_framework.response import Response
from accounts.serializers import UserSerializer
from .models import User
from django.contrib.auth.models import Group

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    # endpoint to assign a role to a user
    def assign_role(self, request, pk=None):
        user = self.get_object()
        requested_role = request.data.get('requested_role')
        if requested_role in [r[0] for r in user.REQUESTED_ACCOUNT_TYPE_CHOICES]:
            user.groups.clear()
            user.role = requested_role
            
            # Assign groups based on the requested role
            if requested_role == 'staff':
                staff_group = Group.objects.get(name='Staff')
                user.groups.add(staff_group)
            elif requested_role == 'parent':
                parent_group = Group.objects.get(name='Parent')
                user.groups.add(parent_group)
            elif requested_role == 'student':
                student_group = Group.objects.get(name='Student')
                user.groups.add(student_group)
            elif requested_role == 'teacher':
                teacher_group = Group.objects.get(name='Teacher')
                user.groups.add(teacher_group)
            elif requested_role == 'admin':
                admin_group = Group.objects.get(name='Admin')
                user.groups.add(admin_group)
            elif requested_role == 'super_admin':
                super_admin_group = Group.objects.get(name='Super_Admin')
                user.groups.add(super_admin_group)
            
            user.save()
            return Response({'success': f"User is assigned as {requested_role}"})
        else:
            return Response({'error': f"Invalid role: {requested_role}"})

        return Response({'success': False, 'message': 'Invalid role'})
    
    # endpoint to get the roles assigned to a user
    def get_roles(self, request, pk=None):
        user = self.get_object()
        roles = list(user.groups.values_list('name', flat=True))
        return Response({'roles': roles})
