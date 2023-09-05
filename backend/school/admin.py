from django.contrib import admin
from .models import School, Class, ClassMember

admin.site.register(School)
admin.site.register(Class)
admin.site.register(ClassMember)