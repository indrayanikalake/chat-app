const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const { v4: uuidv4 } = require("uuid");
const GroupUserInfo = require('../models/groupUserInfo');
const Group = require('../models/groupModel');


const accessChat = asyncHandler( async (req, res)=>{
 /*   const { userId } = req.body;

    if(!userId){
        console.log("user id param not sent with request");
        res.sendStatus(400);
    }

    var isChat = await Chat.find({
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
    */
       const { userId } = req.body;

  if (!userId) {
    console.log("User ID parameter not sent with the request");
    return res.sendStatus(400);
  }

  // Check if a chat already exists between the two users
  const existingChat = await Chat.findOne({
    where: {
      isGroupChat: false,
    },
    include: [
      {
        model: User,
        attributes: { exclude: ['password'] },
        where: {
          id: {
            [Op.in]: [req.user.id, userId],
          },
        },
      },
      {
        model: Message,
        as: 'latestMessage',
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['name', 'pic', 'email'],
          },
        ],
      },
    ],
  });

  if (existingChat) {
    return res.send(existingChat);
  }

  // Create a new chat if it doesn't exist
  const chatData = {
    chatName: 'sender',
    isGroupChat: false,
  };

  try {
    const createdChat = await Chat.create(chatData);

    const FullChat = await Chat.findOne({
      where: { id: createdChat.id },
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
        },
      ],
    });

    res.status(200).send(FullChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }

})

const fetchGroup = asyncHandler( async (req,res)=>{
    try{
      console.log(req.user);
      const response = await req.user.getGroups();
      console.log(response);
      res.status(200).json({data:response})

    }catch(error){
        res.status(400);
        throw new Error(error.message);
    }
})

const createGroupChat = asyncHandler( async (req,res)=>{
  if(!req.body.name){
    return res.status(400).send({message: "Please fill all the fields"})
  }

  console.log(req.user.id);

 /* if(users.length<2){
    return res
    .status(400)
    .send("more than 2 users are  required to form a group ")
  }*/
  const userId = req.user.id;
 
  try{
    const response = await req.user.createGroup({
      id:uuidv4(),
      groupName:req.body.name,
      admin:userId
    })

    const groupInfo = await GroupUserInfo.findOne({
        where: {
          userId: userId,
          groupId: response.id,
        },
    })

    groupInfo.isAdmin= true;
    groupInfo.save();

     res
        .status(200)
        .json({ message: "group created successfully", response: response });
  }catch(error){
     res.status(400);
     throw new Error(error.message);
  }
})

const renameGroup = asyncHandler( async (req,res)=>{
   const { chatId, chatName } = req.body;
   try{
  
    const groupInfo = await GroupUserInfo.findOne({
      where:{
        groupId:chatId,
        userId:req.user.id
      }
    })

    console.log(groupInfo);

    if(groupInfo.isAdmin === true){
    const group = await Group.findByPk(chatId);

    if(!group)throw new Error('group not found');

    group.groupName = chatName;
    await group.save();

     res.status(200).json(group);
    }else{
      throw new Error("Only Admin can change the group name")
    }
   }catch(error){
    res.status(400);
    throw new Error(error);
   }
   
})

const addToGroup = asyncHandler( async (req,res)=>{
   const userId = Number(req.body.userId);
   const groupId = req.body.groupId;

   try{
    const user = await User.findByPk(userId);

    if(!user) throw new Error('user not found')

    const group = await Group.findByPk(groupId);
    if(!group)throw new Error('group not found');

    const groupInfo = await GroupUserInfo.findOne({
      where:{
        userId:req.user.id,
        groupId:groupId
      }
    });

    if(groupInfo.isAdmin ===true){

    await user.addGroup(group);


    res.status(200).json("User added successfully");
    }else{
      console.log('only admin can add users');
      res.status(400).send('only anly admin can add user')}
   }catch(error){
    console.log(error);
      res
        .status(500)
        .json({ message: "sorry user cannot be added in this group" });
   }
})

const getAllUsers = asyncHandler( async (req,res)=>{
  const groupId = req.query.groupId;
  console.log(req.query);
      try{
          const group = await Group.findByPk(groupId);
    if(!group)throw new Error('group not found');


    const groupMembers = await group.getUsers();
    console.log(groupMembers);
    res.status(200).json(groupMembers);
      }catch(error){
         res.status(400);
         throw new Error(error);
      }
})


const removeFromGroup = asyncHandler( async (req,res)=>{
   const {chatId, userId} = req.body;

   const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
        $pull: {users: userId}
    },
    {
        new:true
    }).populate("users","-password")
    .populate("goupAdmin","-password");

    if(!removed){
        res.status(400);
        throw new Error("Chat not found");
    }else{
        res.json(removed);
    }
    
  

})

const deleteUser = asyncHandler(async (req, res)=>{
  const {groupId, userId} = req.params;
  console.log(req.params);
  try{
    const group = await Group.findByPk(groupId);
    const user = await User.findByPk(userId);

    if(!group || !user) throw new Error('Group or User does not exist');
    console.log(req.user.id);
    const groupInfo = await GroupUserInfo.findOne({
      where:{
       userId:req.user.id,
        groupId:groupId
      }
    })
    console.log(groupInfo);

    if(groupInfo.isAdmin === true){
         await group.removeUser(user);
         res.status(200).send('removed successfully');
      }else{
        res.status(400);
        throw new Error('only admin can remove user');
      }
      

  }catch(error){
    res.status(400);
    throw new Error(error);
  }

})

const makeUserAdmin = asyncHandler(async (req,res)=>{
const {userId, groupId} =req.body;
try{
  const groupInfo1 = await GroupUserInfo.findOne({
    where:{
      userId : req.user.id,
      groupId:groupId,
    }
  })
  const groupInfo2 = await GroupUserInfo.findOne({
    where:{
      userId:userId,
      groupId:groupId
    }
  })

  if(groupInfo1.isAdmin === true){
    groupInfo2.isAdmin = true;
    groupInfo2.save();
     res.status(200).json({isAdmin:groupInfo2.isAdmin});
  }

}catch(error){
   res.status(500).json({ message: 'Error making user an admin.' });
}
})

module.exports = {accessChat, makeUserAdmin, fetchGroup, createGroupChat, renameGroup, addToGroup, removeFromGroup, getAllUsers, deleteUser};