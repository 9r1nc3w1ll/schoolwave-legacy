from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from school.models import ClassMember

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['role'] = user.role

        if user.school:
            token["school"] = user.school.id
        
        c_member = ClassMember.objects.filter(user=user)

        if c_member.exists():
            token["class"] = c_member[0].class_id.id

        return token