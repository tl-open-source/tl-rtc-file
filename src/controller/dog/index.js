const express = require('express');


module.exports = function () {  
     const router = express.Router();

     router.get("/dog", (req, res) => {
          res.json({
               dog : "request dog api ok!"
          })
     });

     return router;
}