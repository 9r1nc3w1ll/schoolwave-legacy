from django.db import models
from datetime import datetime

from config.models import BaseModel
from school.models import School

from dateutil.relativedelta import relativedelta


class Session(BaseModel):
    class Meta:
        db_table = "sessions"
        unique_together = ("school", "name", "active")

    name = models.CharField(max_length=50)
    active = models.BooleanField(null=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    resumption_date = models.DateField()

    def save(self, *args, **kwargs):
        start_date_obj = datetime.strptime(str(self.start_date), '%Y-%m-%d')
        end_date_obj = datetime.strptime(str(self.end_date), '%Y-%m-%d')

        start_year = start_date_obj.year
        end_year = end_date_obj.year
        self.name = f"{start_year}/{end_year}"

        return super().save(*args, **kwargs)
        
class Term(BaseModel):
    class Meta:
        db_table = "terms"
        unique_together = ("session", "name", "active")

    name = models.CharField(max_length=50)
    active = models.BooleanField(null=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    code = models.CharField(max_length=150, unique=True)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)
    
    def list_weeks(self):
        weeks = []
        current_date = self.start_date

        while current_date <= self.end_date:
            week_number = (current_date - self.start_date).days // 7 + 1
            week_duration = f"Week {week_number}"
            # weeks.append({"name": week_duration, "duration": ""})
            weeks.append(week_duration)
            current_date += relativedelta(weeks=1)
        return weeks
    

    def fetch_current_week(self):
        current_date = datetime.now().date()
        if current_date < self.start_date:
            return "Week 1"
        elif current_date > self.end_date:
            return "Term Ended"
        else:
            week_number = (current_date - self.start_date).days // 7 + 1
            return f"Week {week_number}"