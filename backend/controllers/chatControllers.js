const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');


const accessChat = asyncHandler( async (req, res)=>{
    const { userId } = req.body;

    if(!userId){
        console.log("user id param not sent with request");
        res.sendStatus(400);
    }

    const isChat = await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch: {$eq: req.user._id}}},
            {users:{$elemMatch: {$eq: userId}}}
        ]
    }).populate("users","-password").populate("latestMessage")
    
    isChat = await User.populate(isChat,{
        path:'latestMessage.sender',
        select: "name pic email"
    })
    
    if(isChat.length>0){
        res.send(isChat[0]);
    }else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users:[req.user._id,userId]
        }
        try{
               const createdChat = await Chat.create(chatData);

               const FullChat = await Chat.findOne({_id: createdChat._id}).populate("users","-password");
               res.status(200).send(FullChat);
        }catch(error){
            res.status(400);
            throw new Error(error.message)

        }
    }
})

const fetchChats = asyncHandler( async (req,res)=>{
    try{
        Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt: -1});

    }catch(error){

    }
})

module.exports = {accessChat, fetchChats};