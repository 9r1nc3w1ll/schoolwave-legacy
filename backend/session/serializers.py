from rest_framework import serializers

from .models import Session, Term


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = "__all__"
        extra_kwargs = {'name': {'read_only': True}}
    
    def update(self, instance, validated_data):

        active = validated_data.get("active", False)

        if active:
            sessions = Session.objects.filter(active=True).update(active=False)
        return super().update(instance, validated_data)


class TermSerializer(serializers.ModelSerializer):
    session = serializers.PrimaryKeyRelatedField(queryset=Session.objects.all())
    session_name = serializers.StringRelatedField(source='session')

    class Meta:
        model = Term
        fields = "__all__"
