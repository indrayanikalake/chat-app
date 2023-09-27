import React, { useEffect, useState } from 'react'
import axios from 'axios'


const ChatPage = () => {
    const [chats, setChats] = useState([]);

  
    const fetchData =  async () =>{
        const {data}= await axios.get('/api/chat');
       console.log(data);
       setChats(data);
        
    }

        useEffect(()=>{
      fetchData();
    
    },[])
  
  return (
    <div>
     <p>{chats.map((chat)=>(
        <div key={chat._id}>{chat.chatName}</div>
     ))}</p>
    </div>
  )
}

export default ChatPage
