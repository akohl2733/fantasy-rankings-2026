FROM python:3.14-slim-bookworm

ENV POETRY_VERSION=2.4.1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache \
    OTEL_SERVICE_NAME=fantasy_26 \
    OTEL_RESOURCE_ATTRIBUTES="service.namespace=fantasy"

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl libc-dev python3-dev gcc && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN pip3 install --upgrade pip
RUN pip3 install "poetry==$POETRY_VERSION"

WORKDIR /app

COPY pyproject.toml poetry.lock ./

RUN poetry install --without dev --no-root && rm -rf $POETRY_CACHE_DIR

COPY . .

EXPOSE 8080
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
