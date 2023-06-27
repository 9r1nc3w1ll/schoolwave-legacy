# Do not use this in production

FROM python:3.10-slim as builder

WORKDIR /app
COPY . .
RUN \
  python -m venv .venv && \
  . ./.venv/bin/activate && \
  pip install -r requirements.txt

FROM python:3.10-slim
WORKDIR /app
COPY --from=builder /app/.venv /app/.venv
COPY . .

EXPOSE 8000

CMD ["./start.sh"]
