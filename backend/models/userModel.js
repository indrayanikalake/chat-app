//const mongoose= require('mongoose');
const bcrypt = require('bcryptjs');
const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const Group = require('./groupModel');
const GroupUserInfo = require('./groupUserInfo');

/*
const userSchema = mongoose.Schema({
    name:{type:String, required:true },
    email:{type:String, required:true, unique:true },
    password:{type:String, required:true },
    pic:{type:String,  default: "https://www.freepik.com/free-photo/blue-user-icon-symbol-website-admin-social-login-element-concept-white-background-3d-rendering_23524384.htm#query=default%20user&position=16&from_view=keyword&track=ais" }
    
},{
    timestamps:true
})

userSchema.methods.matchPassword = async function (enteredPassword){
   return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre('save', async function(next){
   
    if(!this.isModified) next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

})

const User = mongoose.model("User", userSchema);*/


const User = sequelize.define('user',{
    id:{
        type: DataTypes.BIGINT,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,

    },
    pic:{
        type:DataTypes.STRING,
        defaultValue:'',

    }

});



User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.prototype.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};


module.exports = User;