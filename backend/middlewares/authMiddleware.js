const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req,res,next)=>{
  let token;
  console.log(req.headers)
  if(req.headers.autherization &&
    req.headers.autherization.startsWith('Bearer')){
        try{

            token = req.headers.autherization.split(" ")[1];
             console.log(token);
            //"Bearer nvbjhbjsghuguifsb"

            //decode token id
            let decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();

        }catch(error){
          res.status(401);
          throw new Error("Not authorized, token failed")
        }
    }
    

    if(!token){
       res.status(401);
       throw new Error("Not authorized, no token")
    }
})

module.exports ={ protect}