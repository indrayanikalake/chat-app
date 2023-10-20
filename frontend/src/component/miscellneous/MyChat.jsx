import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/layout';
import { useToast, Button, Stack, Text } from '@chakra-ui/react';
import axios from 'axios';
import { ChatState } from '../../context/ChatProvider';
import { AddIcon } from '@chakra-ui/icons';

import { getSender } from '../config/ChatLogics';
import ChatLoading from './ChatLoading';
import GroupChatModal from './GroupChatModal';

const MyChat = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
   const {  selectedChat, setSelectedChat, chats, setChats, group } = ChatState();
  
 let user = localStorage.getItem('userInfo');
 user=JSON.parse(user);
   const toast = useToast();
   
   

   const fetchChats = async () =>{
    console.log(user.token);
    try{

      const config = {
        headers:{
          Autherization : `Bearer ${user.token}`,
        },
      }

      const {data} =await axios.get('/api/chat',config);
      console.log(data.data);
    
      setChats(data.data);
    }catch(error){
      toast({
          title: 'Error occured',
          description:'failed to load ',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom-left"
        })
    }
   }

 
    useEffect(()=>{
    fetchChats();
   },[]);

     useEffect(()=>{
     fetchChats()
   },[group])
  

   useEffect(()=>{
       setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
       fetchChats();
   },[fetchAgain]);

   console.log(group);

  return (
    <Box
    d={{base: selectedChat? "none" : "flex", md:'flex'}}
    flexDir='column'
    alignItems='center'
    p={3}
    bg='linear-gradient(to right, black, #300000)'
    w={{base: "100%",md:'31%'}}
    borderRadius='lg'
    
  
   >
   <Box
   pb={3}
   px={3}
   fontSize={{base:'28px', md:'35px'}}
   d='flex'
   flexDir='row'
   w='100%'
   justifyContent='space-between'
   alignItems='center'
   >
  My Chats
  <GroupChatModal>
  <Button
  d='flex'

  fontSize={{base:'17px', md:'10px',lg:'17px'}}
  rightIcon={<AddIcon />}
  >
   New Group Chat
  </Button>
  </GroupChatModal>
   </Box>
   <Box
   d='flex'
   flexDir='column'
   p={5}
   marginBottom={5}
   w='100%'
   h='100%'
   borderRadius='lg'
   overflowY='hidden'
   
   >
 
   
  {chats?.map(chat=>(
    <Text bg='#000000' borderRadius='lg' borderBottomWidth='1px' p={3} marginBottom={3} onClick={()=>setSelectedChat(chat)}>
      {chat.groupName}
    </Text>
  )
  )
  }
   </Box>
    </Box>
  )
}

export default MyChat
