const express = require('express');
const check = require("./check");


module.exports = function () {  
     const router = express.Router();

     router.get("/check", check.checkContent);

     return router;
}