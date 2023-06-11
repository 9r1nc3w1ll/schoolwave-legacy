#!/usr/bin/env bash
python3 -m venv .venv
. ./.venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
which gunicorn
