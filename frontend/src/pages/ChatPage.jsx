import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react';
import { ChatBox, MyChat, SideDrawer } from '../component';


const ChatPage = () => {
   const  user  = ChatState();
  
  const [fetchAgain, setFetchAgain] = useState(false);

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
       sx={{
    '&::-webkit-scrollbar': {
      width: '2px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'black.200',
      borderRadius: 'full',
    },
   
  }}
  overflowY='hidden'
   >
    
    {user && 
    <MyChat fetchAgain={fetchAgain}  />}
    {user && 
    <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}  />} 
    
   </Box>
    </div>
  )
}

export default ChatPage
