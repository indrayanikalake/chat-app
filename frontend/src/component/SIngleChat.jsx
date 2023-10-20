import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, FormControl, IconButton, Text,  Input } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from './config/ChatLogics';
import ProfileModel from './miscellneous/ProfileModel';
import UpdateGroupChatModal from './miscellneous/UpdateGroupChatModal';
import axios from 'axios';


const SIngleChat = ({fetchAgain, setFetchAgain}) => {
   const {user,selectedChat, setSelectedChat  } = ChatState();
   const [message, setMessage] = useState();
   const [loading, setLoading ] = useState(false);
    
   console.log(selectedChat);
   console.log(user);

   const messageHandler = (e)=>{
    setMessage(e.target.value);
   }

   const sendMessage = async () =>{
    let groupId = selectedChat.id;
    const config={
      headers:{
        Autherization: `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    }
    setLoading(true);
    try{
      await axios.post('/sendMessage',{
      
        message: message,
        groupId: groupId
      },config);
  setLoading(false);
    }catch(error){
      setLoading(false);
      console.log(error);
    }
   };

  return (
    <div>
    {selectedChat?(
        <div>
        
        <Text
        fontSize={{base:"28px",md:"30px"}}
        pb={3}
        px={2}
        w="100%"
       


        >
            <div style={{ display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <IconButton
            d={{base:"flex", md:"none"}}
            icon={<ArrowBackIcon />}
            onClick={()=>setSelectedChat("")}
            />
          
            <>
            {selectedChat.groupName.toUpperCase()}
             <UpdateGroupChatModal
               fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}
            />
            </>
          </div>
            
         

              {/* message here */}

              <Box
          borderWidth="1px"
          borderColor="black"
          borderRadius="md"
          p="4"
          height="500px"
          overflowY="auto"
        ></Box>
              <FormControl 
             isRequired mt={3}
              style={{ display: 'flex', flexDirection: 'row' }}
              >
                <Input 
                variant='filled'
            bg='#E0E0E0'
            placeholder='Enter a Message'
           onChange={messageHandler}
            />
            <IconButton
            bg='blackAlpha.100'
            rightIcon={<ArrowRightIcon color='blue.200' />}
              onClick={sendMessage}
            />
              </FormControl>
         
        </Text>
        </div>
    ):(
        <Box d="flex"  alignItems="center" justifyContent="center" h="100%" >
            <Text fontSize="3xl" pb={3}  
            >
                Click on a user to start chatting
            </Text>
             <Box
          borderWidth="1px"
          borderColor="black"
          borderRadius="md"
          p="4"
          height="500px"
          overflowY="auto"
        ></Box>
               <FormControl onKeyDown={sendMessage} 
             isRequired mt={3}
              style={{ display: 'flex', flexDirection: 'row' }}
              >
                <Input 
                variant='filled'
            bg='#E0E0E0'
            placeholder='Enter a Message'
          
            />
            <IconButton
            bg='blackAlpha.100'
            rightIcon={<ArrowRightIcon color='blue.200' />}
              onClick={sendMessage}
            />
              </FormControl>
        </Box>
    )}
      
    </div>
  )
}

export default SIngleChat
