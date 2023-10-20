const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const GroupUserInfo = require('./groupUserInfo');
const User = require('./userModel');


const Group = sequelize.define('group',{
     id:{
        type:DataTypes.STRING,
        allowNull:false,
        autoIncrement:false,
        primaryKey:true
    },
    groupName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    admin:{
        type:DataTypes.BIGINT,
       
    },
});

module.exports = Group;
