const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');

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

const receiveMsg = asyncHandler(async (req,res)=>{

try{
    const response = await Message.findAll({
        where:{groupId: req.query.groupId}
    });
    console.log(response);
    res.status(200).json(response);

}catch(error){
    console.log(error);
    res.status(500);
    throw new Error("sorry message can't be fetched")

}
})

module.exports = {sendMsg, receiveMsg}