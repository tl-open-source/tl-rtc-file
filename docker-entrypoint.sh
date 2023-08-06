#!/bin/bash

pm2 start npm --name=tlsocket -- run lsocket

sleep 8

pm2 logs
