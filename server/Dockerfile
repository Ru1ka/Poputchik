FROM python:3.11

WORKDIR /app
COPY . /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

CMD ["python3", "."]
