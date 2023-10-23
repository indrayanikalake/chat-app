import { CloseIcon, StarIcon } from '@chakra-ui/icons'
import { Avatar, Box, IconButton, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'


const UserBadgeItem = ({user, handleFunction}) => {
  const {selectedChat, chats} = ChatState();
  const [isAdmin, setIsAdmin] = useState(false);
  
 const toast = useToast();

  console.log(selectedChat);
  console.log(chats);

  const groupUserInformation = selectedChat['group-user-info'];
    console.log(groupUserInformation);
  

  const makeAdmin = async () =>{
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const userId= user.id;
    const groupId = selectedChat.id;
    console.log(userId);
    
    

   const config = {
    headers:{
      Autherization : `Bearer ${userInfo.token}`
    }
   }

   try{
   const response =  await axios.post('/api/chat/makeAdmin',{userId,groupId},config);
   console.log(response.data);
  

   }catch(error){
      toast({
          title: 'Only admin can make User Admin',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        });
    console.log(error);
   }
  }

   

  return (
    <Box
    px={2}
    py={1}
    borderRadius='lg'
    m={1}
    mb={2}
    variant='solid'
    fontSize={12}
    backgroundColor='#D8BFD8'
    color='black'
    cursor='pointer'
   
    >
        <Avatar 
      mr={2}
      size="sm"
      cursor="pointer"
      name={user.name}
      src={user.pic}
      />
        <b>{user.name}</b>
        <CloseIcon
         
        pl={1} onClick={handleFunction} />
       
       
        <StarIcon
         position="absolute"
         right="8"
        color={groupUserInformation.isAdmin? 'goldenrod' : 'gray.100'}  onClick={makeAdmin}/>
        
      
    </Box>
  )
}

export default UserBadgeItem
