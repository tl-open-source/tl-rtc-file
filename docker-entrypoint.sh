#!/bin/bash

cd /home/tlrtcfile/svr

pm2 start npm --name=tlapi -- run lapi

pm2 start npm --name=tlsocket -- run lsocket

cd build/webpack

pm2 start npm --name=tlbuild -- run pro

pm2 logs



