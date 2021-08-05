const express = require('express');
const room = require("./room");


module.exports = function () {  
     const router = express.Router();
     
     router.get("/:name",room.getRoomByName);
     router.get("/o/:uid",room.getOwnerRoomByUid);
     router.get("/j/:name",room.getJoinRoomByName);

     router.get("/o/add",room.addOwnerRoom);
     router.get("/j/add",room.addJoinRoom);

     router.get("/j/set/:id",room.updateRoom);

     return router;
}