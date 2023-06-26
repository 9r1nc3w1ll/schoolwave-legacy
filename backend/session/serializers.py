from rest_framework import serializers

from .models import Session, Term


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = "__all__"
        extra_kwargs = {'name': {'read_only': True}}


class TermSerializer(serializers.ModelSerializer):
    session = serializers.PrimaryKeyRelatedField(queryset=Session.objects.all())
    session_name = serializers.StringRelatedField(source='session')

    class Meta:
        model = Term
        fields = "__all__"
