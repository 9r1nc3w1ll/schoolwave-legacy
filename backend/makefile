env:
	python3 -m venv .venv
activate-env:
	. ./.venv/bin/activate
install-dependencies:
	pip install -r requirements.txt
migrate:
	manage.py migrate
test:
	manage.py test
check:
	manage.py check --deploy
install-web-server:
	pip install gunicorn
start-server:
	gunicorn config.wsgi
