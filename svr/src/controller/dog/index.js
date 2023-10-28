const express = require('express');
const dog = require('./dog');


module.exports = function () {  
     const router = express.Router();

     router.get("/question/list", dog.getQuestionList);

     return router;
}