import os
from datetime import timedelta
from pathlib import Path

from decouple import config
from dotenv import load_dotenv

from corsheaders.defaults import default_headers

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config("SECRET_KEY", "secret")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config("DEBUG")

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "*").split(",")

APPEND_SLASH = False


# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_filters",
    "drf_spectacular",
    "drf_standardized_errors",
    "rest_framework.authtoken",
    "ckeditor",
    "account",
    "school",
    "session",
    "admission",
    "attendance",
    "subject",
    "staff",
    "exam",
    "parent",
    "fees",
    "lessonnotes",
    "grading",
]

AUTH_USER_MODEL = "account.User"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    # "EXCEPTION_HANDLER": "drf_standardized_errors.handler.exception_handler",
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}


SPECTACULAR_SETTINGS = {"TITLE": "Schoolwave API Docs"}

REST_USE_JWT = True

SIMPLE_JWT = {
    "TOKEN_OBTAIN_SERIALIZER": "utils.jwt.CustomTokenObtainPairSerializer",
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=2),
    "AUTH_HEADER_TYPES": ("Bearer", "Token"),
}

DRF_STANDARDIZED_ERRORS = {
    "ENABLE_IN_DEBUG_FOR_UNHANDLED_EXCEPTIONS": True,
    "EXCEPTION_FORMATTER_CLASS": "utils.errors.MyExceptionFormatter",
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "account.middleware.audit_log_middleware",
]

CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = "config.urls"

# AWS_ACCESS_KEY_ID = 'your-access-key-id'
# AWS_SECRET_ACCESS_KEY = 'your-secret-access-key'
# AWS_STORAGE_BUCKET_NAME = 'your-bucket-name'
# AWS_S3_REGION_NAME = 'your-s3-region'
# AWS_S3_ENDPOINT_URL = 'your-s3-endpoint-url'

# AWS_S3_CUSTOM_DOMAIN = 'your-custom-domain'


# AWS_S3_OBJECT_PARAMETERS = {
#     'CacheControl': 'max-age=86400',
# }

# DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        'DIRS': [BASE_DIR / 'templates', ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": config("DATABASE_NAME"),
        "USER": config("DATABASE_USER"),
        "HOST": config("DATABASE_HOST", "localhost"),
        "PORT": config("DATABASE_PORT", "5432"),
        "PASSWORD": config("DATABASE_PASSWORD"),
    }
}

FLUTTERWAVE_SECRET_KEY = config("FLUTTERWAVE_SECRET_KEY", default="Test")

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "static"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Logging config
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}

FRONTEND_URL = config("FRONTEND_URL", "localhost:3000")

FRONTEND_PASSWORD_RESET_URL = config('FRONTEND_PASSWORD_RESET_URL', 'http://localhost:3000/accounts/password-reset')


SITE_ID = 1


EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = config('EMAIL_HOST', 'smtp.mailgun.org')
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
EMAIL_HOST_USER = config('EMAIL_HOST_USER', "postmaster@sandbox13312edbb9e3459aaba832c27e545d87.mailgun.org")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", "24ad73879aecc46dde5e935fd5383e8a-8c9e82ec-8f565488")

CORS_ALLOW_HEADERS = (
    *default_headers,
    "x-client-id",
)
