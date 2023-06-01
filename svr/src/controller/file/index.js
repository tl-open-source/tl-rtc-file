const express = require('express');
const file = require("../../dao/file/file")

module.exports = function () {  
     const router = express.Router();

     router.get("/file", (req, res) => {
          res.json({
               dog : "request file api ok!"
          })
     });

     return router;
}