docker-compose --profile=server build

docker tag tl-rtc-file-git-api-server:latest iamtsm/tl-rtc-file-api-server
docker tag tl-rtc-file-git-socket-server:latest iamtsm/tl-rtc-file-socket-server

docker push iamtsm/tl-rtc-file-api-server
docker push iamtsm/tl-rtc-file-socket-server

docker rmi tl-rtc-file-git-api-server
docker rmi tl-rtc-file-git-socket-server
docker rmi iamtsm/tl-rtc-file-api-server
docker rmi iamtsm/tl-rtc-file-socket-server