//const mongoose = require("mongoose");
const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
const User = require("./userModel");
//onst Chat = require("./chatModel");
/*
const messageModel = mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    content:{type:String, trim:true},
    chat:{
        type:mongoose.Schema.Types.ObjectId, ref:"Chat"
    }
    
},
{
        timestamps:true
}
)

const Message = mongoose.model("Message", messageModel);
*/


const Message = sequelize.define('message',{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
    },
    message:{
        type:DataTypes.STRING,
    },
    pic:{
         type:DataTypes.STRING,
    },
    video:{
          type:DataTypes.STRING,
    },
    groupId:{
        type:DataTypes.STRING,
        allowNull:false,
    }
});




module.exports = Message;