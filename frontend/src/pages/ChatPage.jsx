import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react';
import { ChatBox, MyChat, SideDrawer } from '../component';


const ChatPage = () => {
   const  user  = ChatState();
  console.log(user);

  return (
    <div style={{width:"100%",background:"linear-gradient(to bottom, black, #300000)"}}>
    {user && <SideDrawer />}
   <Box
   style={{display:"flex",
   flexDirection:'row',
  justifyContent:'space-between',
 
     width:'100%',
      height:'91.5vh',
       padding:'10px'}}
   >
    
    {user && <MyChat />}
    {user && <ChatBox />} 
    
   </Box>
    </div>
  )
}

export default ChatPage
