const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

const registerUser = asyncHandler(async (req,res) =>{
    const transactionObj = await  sequelize.transaction();
    const { name , email, password, pic } = req.body;

    if(!name || !email || !password ){
        res.status(400);
        throw new Error('Please enter all the fields')

    }

    const userExists = await User.findOne({where: { email:email }});

    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }
   try{
    const user = await User.create({
        name,
        email,
        password,
        pic
  
    },
    {transaction: transactionObj}
    )
   console.log(user);
    if(user){
         const token = generateToken(user.id, user.name);
        await transactionObj.commit(); 
        res.status(201).json({
            id: user.id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token,
        })
    }else{
        await transactionObj.rollback();
        res.status(400);
        throw new Error('Failed to create user');
    }
}catch(error){
      await transactionObj.rollback();
        throw error;
}
})

const authUser = asyncHandler(async (req,res)=>{
    const {name, email, password} = req.body;
    const user = await User.findOne({where:{ email: email }});
    console.log(user);
    console.log(user.id);

    if(user && (await user.matchPassword(password))){
       res.json( {
            id: user.id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token: generateToken(user.id, user.name)
        })
    }else{
        res.status(400);
        throw new Error('Invalid Password');
    }
})

// /api/user?search=indrayani

const allUsers = asyncHandler(async (req,res)=>{
 /* const keyword = req.query.search?
 { $or:[
    {name:{$regex: req.query.search, $options:"i"}},
    {email:{$regex: req.query.search, $options:"i"}}
  ]}:{}

  const users = await User.find(keyword).find({_id: { $ne: req.user._id}});
  res.send(users);*/

  const keyword = req.query.search ;

  const whereCondition = {
    [Op.and]:[
        {
            [Op.or]:[
                {name:{[Op.like]: `%${keyword}%`}},
                {email:{[Op.like]: `%${keyword}%`}}
            ]
        },
        {
            id:{[Op.not]:req.user.id}
        }
    ]
  }

   try {
    const users = await User.findAll({ where: whereCondition });
    console.log(users)
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
})

module.exports = {registerUser, authUser, allUsers}