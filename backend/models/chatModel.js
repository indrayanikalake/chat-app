//const mongoose = require('mongoose');
const {DataTypes, Sequelize} = require('sequelize');
const User = require('./userModel');
const sequelize = require('../config/database');
const Message = require('./messageModel');

/*
const chatModel = mongoose.Schema({
    chatName:{
        type:String,
        trim:true
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    users:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",

        }
    ],
    latestMessage:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Message'
    },
    groupAdmin:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},
{
    timestamps:true
})

const Chat = mongoose.model("chat", chatModel );
*/


const Chat = sequelize.define('chat',{
     chatName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isGroupChat: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    groupAdminId: {
      type: DataTypes.BIGINT,
    },
})

module.exports = Chat;