from rest_framework import serializers
from .models import client


class clientSerialize(serializers.ModelSerializer):
    class Meta:
        model=client
        fields='__all__'

