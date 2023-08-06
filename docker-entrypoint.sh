#!/bin/bash

pm2 start npm --name=tlapi -- run lapi

npm run build:pro

sleep 8

pm2 logs
