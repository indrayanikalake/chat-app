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
            console.log(decoded);
            console.log(decoded.id);
            const user = await User.findByPk(decoded.id,{
              attributes:{ exclude : ['password']},
            });
            console.log(user);
             if (!user) {
            return res.status(401).json({ message: 'User not found' });
            }

            req.user = user;
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