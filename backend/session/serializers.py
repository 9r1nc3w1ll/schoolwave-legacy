from rest_framework import serializers
from .models import Session, Term


class SessionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Session
        fields = "__all__"


class TermSerializer(serializers.ModelSerializer):
    session = serializers.StringRelatedField()
    
    class Meta:
        model = Term
        fields = "__all__"