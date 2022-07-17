FROM node:14-alpine

ADD . /home/tlrtcfile

WORKDIR /home/tlrtcfile

RUN npm install

EXPOSE 9092 8444

CMD ["/bin/sh", "docker-entrypoint.sh"]
