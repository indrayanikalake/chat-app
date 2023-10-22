import { CloseIcon, StarIcon } from '@chakra-ui/icons'
import { Box, IconButton, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'


const UserBadgeItem = ({user, handleFunction}) => {
  const {selectedChat} = ChatState();
  const [isAdmin, setIsAdmin] = useState(false)
  

  console.log(selectedChat);
  

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
   const user =  await axios.post('/api/chat/makeAdmin',{userId,groupId},config);
   console.log(user.data);
    setIsAdmin(user.data.isAdmin);

   }catch(error){
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
    backgroundColor='purple'
    color='white'
    cursor='pointer'
   
    >
        {user.name}
        <CloseIcon
         
        pl={1} onClick={handleFunction} />
       
       
        <StarIcon
         position="absolute"
         right="8"
        color={isAdmin? 'goldenrod' : 'gray.100'}  onClick={makeAdmin}/>
        
      
    </Box>
  )
}

export default UserBadgeItem
