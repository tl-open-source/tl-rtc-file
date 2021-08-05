const express = require('express');
const webModule = require("./webModule");


module.exports = function () {  
     const router = express.Router();

     router.get("/add",webModule.add);
     router.get("/set",webModule.set);
     router.get("/get",webModule.get);
     router.get("/del",webModule.del);

     return router;
}