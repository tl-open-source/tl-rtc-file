const express = require('express');


module.exports = function () {  
     const router = express.Router();

     router.get("/room", (req, res) => {
          res.json({
               room : "request room api ok!"
          })
     });

     return router;
}