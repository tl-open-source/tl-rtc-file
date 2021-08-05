const express = require('express');
const user = require("./user");

module.exports = function(){  
     const router = express.Router();

     router.get("/add",user.add);

     return router;
}