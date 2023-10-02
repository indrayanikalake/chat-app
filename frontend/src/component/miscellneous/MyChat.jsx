import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/layout';
import { useToast, Button } from '@chakra-ui/react';
import axios from 'axios';
import { ChatState } from '../../context/ChatProvider';
import { AddIcon } from '@chakra-ui/icons';
import {ChatLoading} from './ChatLoading';
import { getSender } from '../config/ChatLogics';

const MyChat = () => {
  const [loggedUser, setLoggedUser] = useState();
   const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

   const toast = useToast();

   const fetchChats = async () =>{
    try{

      const config = {
        headers:{
          Autherization : `Bearer ${user.token}`,
        },
      }

      const {data} = axios.get('/api/chat',config);
      console.log(data);
      setChats(data);
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
       setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
       fetchChats();
   },[]);

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
  <Button
  d='flex'

  fontSize={{base:'17px', md:'10px',lg:'17px'}}
  rightIcon={<AddIcon />}
  >
   New Group Chat
  </Button>
   </Box>
   <Box
   d='flex'
   flexDir='column'
   p={3}

   w='100%'
   h='100%'
   borderRadius='lg'
   overflowY='hidden'

   >
  {chats?(
    <Stack
    overflowY='scroll'
    >
    {chats.map(chat=>(
      <Box
      onClick={()=>setSelectedChat(chat)}
      cursor='pointer'
      bg={selectedChat === chat? "#38B2AC" : "E8E8E8" }
      color={selectedChat === chat? "white" : "blue.900"}
      px={3}
      py={2}
      borderRadius='lg'
      key={chat._id}
      >
      <Text>
        {!chat.isGroupChat?getSender(loggedUser, chat.users):chat.chatName}
      </Text>
      </Box>
    ))}
    </Stack>
  ):(
    <ChatLoading />
  )}
   </Box>
    </Box>
  )
}

export default MyChat
