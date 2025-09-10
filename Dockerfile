FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install system deps needed for some Python packages, install Python deps
COPY server/requirements.txt /app/requirements.txt
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libpq-dev \
    && pip install --upgrade pip \
    && pip install --no-cache-dir -r /app/requirements.txt \
    && pip install --no-cache-dir gunicorn \
    && apt-get purge -y --auto-remove build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy app source
COPY server/ /app/

EXPOSE 5000

# Use gunicorn in production; run.py should expose the Flask `app` object
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]
