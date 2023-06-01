#!/bin/bash

cd /home/tlrtcfile/svr

pm2 start npm --name=tlapi -- run sapi

pm2 start npm --name=tlsocket -- run ssocket

cd build/webpack

pm2 start npm --name=tlbuild -- run pro

pm2 logs



