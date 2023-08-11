#!/bin/bash

pm2 start npm --name=tlapi -- run http-api

npm run build:pro

sleep 8

pm2 logs
