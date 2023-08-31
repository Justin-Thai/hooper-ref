FROM python:3.11.4-alpine3.18
WORKDIR /app/web_scraper
RUN python -m venv /project_env
COPY requirements.txt .
RUN pip install -r requirements.txt
ADD bf_web_scraper.py .
COPY . .
EXPOSE 8000