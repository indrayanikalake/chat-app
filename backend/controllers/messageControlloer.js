const asyncHandler = require('express-async-handler');

const sendMsg = asyncHandler(async (req,res)=>{
    const {message, groupId} = req.body;
try{
    await req.user.createMessage({
        name:req.user.name,
        message:message,
        groupId:groupId
    })
    res.status(200).json({message:"message sent successfully"})
}catch(error){
    
 res.status(500);
 throw new Error("sorry your message can not be sent'")      
}
});

module.exports = {sendMsg}