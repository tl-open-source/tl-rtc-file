docker-compose --profile=local build

docker tag tl-rtc-file-git-api-local:latest iamtsm/tl-rtc-file-api-local
docker tag tl-rtc-file-git-socket-local:latest iamtsm/tl-rtc-file-socket-local

docker push iamtsm/tl-rtc-file-api-local
docker push iamtsm/tl-rtc-file-socket-local

docker rmi tl-rtc-file-git-api-local
docker rmi tl-rtc-file-git-socket-local
docker rmi iamtsm/tl-rtc-file-api-local
docker rmi iamtsm/tl-rtc-file-socket-local