FROM ubuntu:latest
RUN apt-get update -y
RUN apt-get install -y python-pip python-dev build-essential
ADD . /ai-toolkit
WORKDIR /ai-toolkit
RUN pip install -r requirements.txt
ENTRYPOINT ["python"]
CMD ["run.py"]