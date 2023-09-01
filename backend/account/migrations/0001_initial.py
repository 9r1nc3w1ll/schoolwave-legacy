# Generated by Django 4.2 on 2023-09-01 10:36

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(null=True)),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, null=True)),
                ('role', models.CharField(choices=[('staff', 'Staff'), ('parent', 'Parent'), ('student', 'Student'), ('guest', 'Guest'), ('teacher', 'Teacher'), ('admin', 'Admin'), ('super_admin', 'Super_Admin')], default='student', max_length=50)),
                ('date_of_birth', models.DateField(blank=True, null=True)),
                ('gender', models.CharField(blank=True, choices=[('male', 'Male'), ('female', 'Female')], max_length=100, null=True)),
                ('blood_group', models.CharField(blank=True, max_length=20, null=True)),
                ('religion', models.CharField(blank=True, max_length=20, null=True)),
                ('phone_number', models.CharField(blank=True, max_length=20, null=True)),
                ('city', models.CharField(blank=True, max_length=200, null=True)),
                ('state', models.CharField(blank=True, max_length=200, null=True)),
                ('address', models.TextField(blank=True, null=True)),
                ('guardian_name', models.CharField(blank=True, max_length=200, null=True)),
                ('relation', models.CharField(blank=True, max_length=200, null=True)),
                ('guardian_occupation', models.CharField(blank=True, max_length=200, null=True)),
                ('guardian_phone_number', models.CharField(blank=True, max_length=200, null=True)),
                ('guardian_address', models.TextField(blank=True, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
            ],
            options={
                'db_table': 'users',
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='ProfilePhoto',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(null=True)),
                ('file', models.ImageField(blank=True, null=True, upload_to='profile_pics')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='profile_photos', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['created_at'],
                'get_latest_by': '-created_at',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PasswordResetRequest',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(null=True)),
                ('otp', models.CharField(max_length=32)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'password_reset_requests',
            },
        ),
        migrations.CreateModel(
            name='AuditLog',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(null=True)),
                ('action', models.CharField(max_length=10)),
                ('object_type', models.CharField(max_length=100, null=True)),
                ('object_id', models.IntegerField(null=True)),
                ('path', models.CharField(max_length=255, null=True)),
                ('status', models.CharField(max_length=50, null=True)),
                ('status_code', models.SmallIntegerField(null=True)),
                ('actor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'audit_logs',
            },
        ),
        migrations.AddField(
            model_name='user',
            name='profile_photo',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_profile', to='account.profilephoto'),
        ),
    ]
