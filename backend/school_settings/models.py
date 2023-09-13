from django.db import models
from config.models import BaseModel
from school.models import School

class SchoolSettings(BaseModel):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    settings = models.JSONField()
    staff_code_prefix = models.CharField(max_length=10, default="STAFF")
    student_code_prefix = models.CharField(max_length=10, default="STUDENT")
    school_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    school_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    school_radius = models.DecimalField(max_digits=7, decimal_places=2, default=250, null=True, blank=True)

class SchoolLogo(BaseModel):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    file = models.ImageField(upload_to="logo", blank=True, null=True)

class SchoolBrand(BaseModel):
    class Meta:
        db_table = "school_brand"
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    primary_color = models.CharField(max_length=50, default='#FFFFFF', blank=True, null=True)
    secondary_color = models.CharField(max_length=50, default='#000000', blank=True, null=True)

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)