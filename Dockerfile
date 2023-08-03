FROM node:lts-alpine
COPY svr /app/svr
WORKDIR /app/svr
RUN npm install --registry=https://registry.npmmirror.com && npm run build:pro


ENTRYPOINT ["node"]
