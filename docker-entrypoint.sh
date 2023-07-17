#!/bin/bash

cd /home/tlrtcfile/svr

pm2 start npm --name=tlapi -- run lapi

pm2 start npm --name=tlsocket -- run lsocket

npm run build:pro

sleep 2

pm2 logs



