import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, FormControl, IconButton, Text,  Input } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from './config/ChatLogics';
import ProfileModel from './miscellneous/ProfileModel';
import UpdateGroupChatModal from './miscellneous/UpdateGroupChatModal';
import axios from 'axios';
import io from 'socket.io-client';
const ENDPOINT = 'http://localhost:5000';
var  socket = io(ENDPOINT);

var  selectedChatCompare;

const SIngleChat = ({fetchAgain, setFetchAgain}) => {
   const {user,selectedChat, setSelectedChat  } = ChatState();
   const [message, setMessage] = useState([]);
   const [loading, setLoading ] = useState(false);
   const [socketConnected, setSocketConnected] = useState(false);
   const [messages, setMessages] = useState([]);
   const [lastMessageId, setLastMessageId] = useState(0);

   console.log(selectedChat);
   console.log(user);
   const groupIdentity = selectedChat?.id;
   const userId = JSON.parse(localStorage.getItem('userInfo'));


   const fetchMessage =async () =>{
    const groupId = selectedChat?.id;
    const config={
      headers:{
        Autherization:`Bearer ${user.token}`,
        'Content-Type':'application/json'
      },
      params:{
        groupId:groupId,
      }
    }
    try{
      const response = await axios.get(`/msg/receivemsg/${lastMessageId}`, config);
      const msgs = response.data.map(user=>user)
      console.log(msgs);
      setMessages(msgs);
      console.log(response.data);
     if(response.data.length>5){ 
      setLastMessageId(response.data[response.data.length-1].id)
    }
      localStorage.setItem('message',msgs);
      const messages = localStorage.getItem('message');
      console.log( messages.split(','));

      socket.emit('join chat', selectedChat.id)

    }catch(error){
      console.log(error);
    }

   }

   useEffect(()=>{
    fetchMessage();

    selectedChatCompare =selectedChat;
     // Set up the socket.io listener when the component mounts
    socket.on('receive message', handleMessageReceived);

    // Clean up the listener when the component unmounts
    return () => {
      socket.off('receive message', handleMessageReceived);
    };
   },[groupIdentity]);

   const handleMessageReceived = (messageObj, receivedGroupId) =>{
      console.log('Received a message: ', messageObj, receivedGroupId);
    if(messageObj){
      setMessages((prevMsg)=>[...prevMsg, messageObj]);
    }

   }

   const messageHandler = (e)=>{
    setMessage(e.target.value);
   }

   const sendMessage = async () =>{
    let groupId = selectedChat.id;
    const userId = user.id;
    const config={
      headers:{
        Autherization: `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    }
    setLoading(true);
    
    try{
      await axios.post('/msg/sendMessage',{
      
        message: message,
        groupId: groupId
      },config);
  setLoading(false);
 
  socket.emit('send message',{message, userId}, groupId); 
 

    }catch(error){
      setLoading(false);
      console.log(error);
    }
   };

 useEffect(()=>{
  console.log(messages);
 },[messages])

   useEffect(()=>{
  
   },[])
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
           display="flex"
          flexDirection="column"

           sx={{
    '&::-webkit-scrollbar': {
      width: '8px', // Adjust the width as needed
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'black.200', // Adjust the color as needed
      borderRadius: 'full',
    },
  }}
           
        >
          {Array.isArray(messages)?(<>{messages?.map(m=>{
            if(m.userId === userId.id){
            return <Box bg='#E0E0E0' color='blackAlpha.500'  alignSelf="flex-start" w='10%'  borderWidth="1px"
          borderColor="black"
          borderRadius="md"
            fontSize='22px'
            >{m.message}</Box>
          }else{
            return <Box bg='#E0E0E0' color='blackAlpha.500'  alignSelf="flex-end" bg='green.100' w='10%'  borderWidth="1px"
          borderColor="black"
          borderRadius="md"
            fontSize='22px'
            >{m.message}</Box>
          }
          })}</>):(<></>) }
        </Box>
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

export default SIngleChat;

