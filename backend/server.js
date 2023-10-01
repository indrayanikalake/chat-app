const express = require('express');
const { chats } = require("./data/data");
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddlewares');
const cors = require("cors");

dotenv.config();
connectDb();

const app = express();
app.use(cors());

app.use(express.json()) // to accept JSON data

//app.use(notFound);
//app.use(errorHandler);

app.get('/',(req,res)=>{
    res.send('API is running');
})

app.get('/api/chat',(req,res)=>{
   res.send(chats);
})

app.use( userRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/chat/:id',(req,res)=>{
    console.log(req.params.id);
  
  const singleChat = chats.find((c) => c._id === req.params.id);

res.send(singleChat);

})

const PORT = process.env.PORT || 5000

app.listen(5000, console.log(`Server Started on Port ${PORT}`))