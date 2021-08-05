
async function add(req,res,next) {
     console.log("req : user");
     res.send("user")
}


module.exports = {
     add
}