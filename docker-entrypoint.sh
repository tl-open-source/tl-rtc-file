#!/bin/bash

pm2 start npm --name=tlapi -- run lapi

pm2 start npm --name=tlsocket -- run lsocket

npm run build:pro

sleep 8

pm2 logs
