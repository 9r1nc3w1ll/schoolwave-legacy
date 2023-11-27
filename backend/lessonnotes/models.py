from django.db import models
from account.models import User
from school.models import School, Class
from subject.models import Subject
from config.models import BaseModel
from session.models import Term


class LessonNote(BaseModel):
    class Meta:
        db_table = "lesson_notes"

    term = models.ForeignKey(Term, on_delete=models.CASCADE, blank=True, null=True)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, blank=True, null=True)
    files = models.ManyToManyField('LessonNoteFile', related_name='lesson_notes', blank=True)
    week = models.IntegerField(default=1)
    topic = models.CharField(max_length=150)
    description = models.TextField()
    tag = models.CharField(max_length=150, blank=True, null=True)
    content = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_lesson_notes')
    last_updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='updated_lesson_notes')
    school = models.ForeignKey(School, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)



class LessonNoteFile(BaseModel):

    class Meta:
        db_table = "lesson_note_files"

    file_path = models.FileField(upload_to="lesson_notes", blank=True, null=True)
    # file_path = models.URLField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_files')

    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)