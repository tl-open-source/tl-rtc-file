const express = require('express');
const comm = require("./comm");


module.exports = function () {  
     const router = express.Router();

     router.get("/initData",comm.initData);

     return router;
}