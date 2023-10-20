const express = require('express');
const { chats } = require("./data/data");
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRouter = require('./routes/messageRouter');
const cors = require("cors");
const sequelize = require('./config/database');
const User = require('./models/userModel');
const GroupUserInfo = require('./models/groupUserInfo');
const Group = require('./models/groupModel');
const Message = require('./models/messageModel');

dotenv.config();
//connectDb();

const app = express();
app.use(cors());

app.use(express.json()) // to accept JSON data



app.get('/',(req,res)=>{
    res.send('API is running');
})



app.use( userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/sendMessage', messageRouter);

app.get('/api/chat/:id',(req,res)=>{
    console.log(req.params.id);
  
  const singleChat = chats.find((c) => c._id === req.params.id);

res.send(singleChat);

})

User.belongsToMany(Group, {
  through: GroupUserInfo, // Specify the custom join table
  foreignKey: 'userId', // Foreign key in the join table that links to User
});

Group.belongsToMany(User, {
  through: GroupUserInfo, // Specify the custom join table
  foreignKey: 'groupId', // Foreign key in the join table that links to Group
});

User.hasMany(Message);
Group.hasMany(Message);

Message.belongsTo(Group);

const PORT = process.env.PORT || 5000;


sequelize.sync({force:false})
.then(res=>
  {
app.listen(5000, console.log(`Server Started on Port ${PORT}`));
  })
  .catch(error=>console.log(error));

