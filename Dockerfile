FROM node:lts-alpine

COPY . /tlrtcfile

WORKDIR /tlrtcfile/svr

RUN npm config set registry https://registry.npmmirror.com; \
npm install -g pm2; \
npm install;

EXPOSE 9092

CMD ["/bin/sh", "/tlrtcfile/docker-entrypoint.sh"]
