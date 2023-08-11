#!/bin/bash

pm2 start npm --name=tlsocket -- run http-socket

sleep 8

pm2 logs
