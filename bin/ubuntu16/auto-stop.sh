#!/bin/bash

pm2 del tl-rtc-file-api

pm2 del tl-rtc-file-socket

echo "stop and [tl-rtc-file-api] / [tl-rtc-file-socket] pm2 processes ok"