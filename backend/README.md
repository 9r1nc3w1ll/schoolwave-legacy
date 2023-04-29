# SchoolWave Backend

This project is built (mainly) using Django REST Framework

## Installation

1. Clone the repository to your local machine
2. Install dependencies using `pip install -r requirements.txt`
3. Set up the database by running `python manage.py migrate`
4. Start the server using `python manage.py runserver`

## Structure

The project is structured as follows:

- `backend/`: The main project folder
  - `config`: The project settings file
    - `urls.py`
    - `wsgi.py`
    - `asgi.py`
    - `settings.py`
  
  - `utils`: Contains necessary "tools" for the project
    - `errors.py`: Defines error formats (to ensure consistency.)
    
  - `accounts`:
    - `views.py`
    - `serializers.py`
    - `models.py`
    - `urls.py`

## Responses

Example response:

```
{
    "status": "success",
    "message": "Success",
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "johndoe@example.com"
    }
}
```

Example error response:

```
{
    "status": "error",
    "message": "The 'name' field is required."
    "data": null,
}
```