#!/bin/bash

cd /home/tlrtcfile/svr

pm2 start npm --name=tlapi -- run lapi

pm2 start npm --name=tlsocket -- run lsocket

pm2 start npm --name=tlbuild -- run build:pro

pm2 logs



