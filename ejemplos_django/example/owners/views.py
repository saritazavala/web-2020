from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from permissions.services import APIPermissionClassFactory 
from guardian.shortcuts import assign_perm
from owners.models import Owner
from owners.serializers import OwnerSerializer



class OwnerViewSet(viewsets.ModelViewSet):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer
 