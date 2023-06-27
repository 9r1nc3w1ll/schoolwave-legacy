from django.contrib import admin

from .models import AdmissionRequest, StudentInformation

# Register your models here.
admin.site.register(AdmissionRequest)
admin.site.register(StudentInformation)