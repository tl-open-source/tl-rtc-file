const express = require('express');
const login = require("./login");

module.exports = function () {
    const router = express.Router();

    router.post("/wechat", login.loginWechat);

    router.get("/qrcode", login.getLoginWechatQrCode);

    router.post("/scanState", login.scanState);

    router.get("/scanState", login.scanState);

    router.get("/getScanState", login.getScanState);

    router.get("/state", login.getTokenState);

    router.get("/logout", login.logout);

    router.post("/info", login.getLoginInfo);

    return router;
}