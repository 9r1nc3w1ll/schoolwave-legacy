from rest_framework import viewsets
from rest_framework.response import Response
from accounts.serializers import UserSerializer
from .models import User
from django.contrib.auth.models import Group
from rest_framework import status
from rest_framework.decorators import api_view



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    # endpoint to assign a role to a user
    def assign_role(self, request, pk=None):
        user = self.get_object()
        requested_role = request.data.get('requested_role')
        if requested_role in [r[0] for r in user.REQUESTED_ACCOUNT_TYPE_CHOICES]:
            user.role = requested_role
            user.groups.clear()
            
            # Assign groups based on the requested role
            
            if requested_role == 'staff':
                # Check if the group already exists
                staff_group, created = Group.objects.get_or_create(name='Staff')
                # Assign the group to the user
                user.groups.add(staff_group)
            elif requested_role == 'parent':
                # Check if the group already exists
                parent_group, created = Group.objects.get_or_create(name='Parent')
                # Assign the group to the user
                user.groups.add(parent_group)
            elif requested_role == 'student':
            # Check if the group already exists
                student_group, created = Group.objects.get_or_create(name='Student')
                # Assign the group to the user
                user.groups.add(student_group)
            elif requested_role == 'teacher':
            # Check if the group already exists
                teacher_group, created = Group.objects.get_or_create(name='Teacher')
                # Assign the group to the user
                user.groups.add(teacher_group)
            elif requested_role == 'admin':
            # Check if the group already exists
                admin_group, created = Group.objects.get_or_create(name='Admin')
                # Assign the group to the user
                user.groups.add(admin_group)
            elif requested_role == 'super_admin':
            # Check if the group already exists
                super_admin_group, created = Group.objects.get_or_create(name='Super_Admin')
                # Assign the group to the user
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


@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
def update_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
