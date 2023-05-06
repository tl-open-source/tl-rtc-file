FROM node:14-alpine

ADD . /home/tlrtcfile

WORKDIR /home/tlrtcfile/client

RUN npm install; \
    npm run build;

COPY dist /home/tlrtcfile/dist

WORKDIR /home/tlrtcfile/svr

RUN npm install;

EXPOSE 9092 8444

CMD ["/bin/sh", "docker-entrypoint.sh"]
