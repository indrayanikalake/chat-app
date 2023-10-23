import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, FormControl, IconButton, Text,  Input, Avatar, useToast, Spinner } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowRightIcon, ChatIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from './config/ChatLogics';
import ProfileModel from './miscellneous/ProfileModel';
import UpdateGroupChatModal from './miscellneous/UpdateGroupChatModal';
import Picker from 'emoji-picker-react';
import {BsEmojiSmileFill} from 'react-icons/bs';
import axios from 'axios';
import io from 'socket.io-client';
//import { ServerDescriptionChangedEvent } from 'mongodb';
const ENDPOINT = 'http://localhost:5000';
var  socket = io(ENDPOINT);

//var  selectedChatCompare;

const SIngleChat = ({fetchAgain, setFetchAgain}) => {
   const {user,selectedChat, setSelectedChat  } = ChatState();
   const [message, setMessage] = useState('');
   const [loading, setLoading ] = useState(false);
   const [socketConnected, setSocketConnected] = useState(false);
   const [messages, setMessages] = useState([]);
   const [lastMessageId, setLastMessageId] = useState(0);
   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
   const [pic, setPic] =useState();
   const [video, setVideo] = useState();
   const toast = useToast();

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

   // selectedChatCompare =selectedChat;
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
        pic : pic,
        video: video,
        message: message,
        groupId: groupId
      },config);
  setLoading(false);
  setMessage();
  setPic();
  setVideo();
 
  socket.emit('send message',{message, pic, video, userId}, groupId); 
 

    }catch(error){
      setLoading(false);
      console.log(error);
    }
   };

 useEffect(()=>{
  console.log(messages);
 },[messages])

   useEffect(()=>{
  
   },[]);


   const handleEmojiPickerHideShow = () =>{
      setShowEmojiPicker(!showEmojiPicker);
   };

   const handleEmojiClick = (event, emoji) =>{
    console.log(emoji);
   let mg =  message;
   mg+=emoji.native;
   setPic(mg);
   
   }
  

    const postDetails = (pic)=>{
         setLoading(true);
         if(pic === undefined){
            toast({
          title: 'Select an image.',
        
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
        return;
         }
      try{
         if( pic.type === 'image' || pic.type === 'image/jpeg' || pic.type === 'image/png' ){
            const data = new FormData();
            data.append("file",pic);
            data.append("upload_preset","chat-app");
            data.append("cloud_name","ds3ryg3iy");
            fetch("https://api.cloudinary.com/v1_1/ds3ryg3iy/image/upload",{
                method:"post",
                body:data
            }).then((res)=>res.json())
            .then(data=>{
                setPic(data.url.toString());
                console.log(data.url.toString());
                setLoading(false);
            })
         }else if(pic.type === 'video/mp4' || pic.type === 'video/quicktime' || pic.type === 'video/mpeg' ){
                  const data = new FormData();
            data.append("file",pic);
            data.append("upload_preset","chat-app");
            data.append("cloud_name","ds3ryg3iy");
            fetch("https://api.cloudinary.com/v1_1/ds3ryg3iy/video/upload",{
                method:"post",
                body:data
            }).then((res)=>res.json())
            .then(data=>{
              console.log(data.url.toString());
                setVideo(data.url.toString());
                console.log(data.url.toString());
                setLoading(false);
            })
          }else{
             toast({
          title: 'Please select an image',
      
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
         }}catch(error){
           toast({
          title: error,
      
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
         }
    }

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
          {loading? (<Spinner size='lg' position='absolute' left='5px' top='10px' />):(<></>)}
        {Array.isArray(messages) ? (
  <>

  {
    messages?.map((m)=>{
      {m.video && ( 
        <div key={m.userId}>
        {
          m.userId === userId.id ? (
            <Box
            bg='#E0E0E0'
            alignItems='flex-start'
            alignSelf="flex-start"
            w='400px'
            h='300px'
            borderWidth="1px"
            borderColor="black"
            borderRadius="md"
          >
           <video controls width="400" height="300">
           <source src={m.video} />
 
          </video>
          </Box>
          ):(
             <Box
            bg='green.100'
            alignSelf="flex-end"
            w='25%'
            h='50%'
            borderWidth="1px"
            borderColor="black"
            borderRadius="md"
            style={{alignItems:'flex-end'}}
          >
           <video controls width="400" height="300">
           <source src={m.video} type="video/mp4" />
  
          </video>
          </Box>
          )
        }
      </div>)}
     })
  }

  {
    messages?.map((m)=>{
      {m.pic && ( 
        <div key={m.userId}>
        {
          m.userId === userId.id ? (
            <Box
            bg='#E0E0E0'
            alignSelf="flex-start"
            w='25%'
            h='50%'
            borderWidth="1px"
            borderColor="black"
            borderRadius="md"
          >
            <img src={m.pic} alt="User's Picture" />
          </Box>
          ):(
             <Box
            bg='green.100'
            alignSelf="flex-end"
            w='25%'
            h='50%'
            borderWidth="1px"
            borderColor="black"
            borderRadius="md"
            style={{alignItems:'flex-end'}}
          >
            <img src={m.pic} alt="User's Picture" />
          </Box>
          )
        }
      </div>)}
     })
  }
  {
    messages?.map((m)=>{
      {m.message && ( 
        <div key={m.userId}>
        {
          m.userId === userId.id ? (
            <Box
            bg='#E0E0E0'
            alignSelf="flex-start"
            w='25%'
          
            borderWidth="1px"
            borderColor="black"
            borderRadius="md"
          >
            <video src={m.message} alt="User's Picture" />
          </Box>
          ):(
             <Box
            bg='green.100'
            alignSelf="flex-end"
            w='25%'
           
            borderWidth="1px"
            borderColor="black"
            borderRadius="md"
            style={{alignItems:'flex-end'}}
          >
            <video src={m.message} alt="User's Picture" />
          </Box>
          )
        }
      </div>)}
     })
  }
    
    {messages?.map((m) => (
      <div key={m.userID}>
        {m.userId === userId.id && m.message ? (
          <Box
            bg='#E0E0E0'
            color='blackAlpha.500'
            alignSelf="flex-start"
            p={3}
            w='25%'
            borderWidth="1px"
            borderColor="black"
            borderRadius="md"
            fontSize='22px'
          >
            {m.message}
          </Box>
        ) : null}
        {m.userId === userId.id && m.pic ? (
          <Box
            bg='#E0E0E0'
            alignSelf="flex-start"
            w='25%'
            h='50%'
            borderWidth="1px"
            borderColor="black"
            borderRadius="md"
          >
            <img src={m.pic} alt="User's Picture" />
          </Box>
        ) : null}
        {m.userId !== userId.id && m.message ? (
          <Box
           
            color='blackAlpha.500'
            alignSelf="flex-end"
            bg='green.100'
            w='25%'
            borderWidth="1px"
            borderColor="black"
            borderRadius="md"
            fontSize='22px'
             style={{alignItems:'flex-end'}}
          >
            {m.message}
          </Box>
        ) : null}
         {m.userId !== userId.id && m.pic ? (
          <Box
            bg='green.100'
            alignSelf="flex-end"
            w='25%'
            h='50%'
            borderWidth="1px"
            borderColor="black"
            borderRadius="md"
            style={{alignItems:'flex-end'}}
          >
            <img src={m.pic} alt="User's Picture" />
          </Box>
        ) : null}
      </div>
    ))}
  </>
) : (
  <></>
)}

           {showEmojiPicker && <Picker
                style={{position:'absolute', top:'-350px' , left:'10px'}}
               // position='absolute'
               //  top='-350'
                onEmojiClick={handleEmojiClick}
                />}
        </Box>
              <FormControl 
             isRequired mt={3}
              style={{ display: 'flex', flexDirection: 'row' }}
              >
                <BsEmojiSmileFill color='yellow' cursor='pointer' onClick={handleEmojiPickerHideShow} />
               
                <Input 
                variant='filled'
            bg='#E0E0E0'
            placeholder='Enter a Message'
           onChange={messageHandler}
            
            />
            <Input
            type='file'
            size='xs'
            w='1.5'
            h='2.5'
            accept='image/*,video/*'
            cursor='pointer'
            onChange={(e)=>postDetails(e.target.files[0])}
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
             
        </Box>
    )}
      
    </div>
  )
}

export default SIngleChat;

