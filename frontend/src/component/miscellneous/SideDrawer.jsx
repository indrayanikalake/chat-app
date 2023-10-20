import { Box, Drawer, Button, Tooltip, Text, Menu, MenuButton, Avatar, MenuItem, MenuList, MenuDivider, DrawerContent, DrawerHeader, DrawerBody, Input, useToast, Spinner } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, {useEffect, useState} from 'react'
import { ChatState } from '../../context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useHistory } from 'react-router-dom';
import { useDisclosure, DrawerOverlay } from '@chakra-ui/react';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../User Avatar/UserListItem';


const SideDrawer = () => {
  const [search, setSearch ] = useState();
  const [searchResult, setSearchResult ] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
   const { isOpen, onOpen, onClose } = useDisclosure()
   const toast = useToast();
   
  const { user, setSelectedChat, chats, setChats, setUser } = ChatState();

  
  const history = useHistory();

console.log(user);

 console.log(user?.name);
  const logoutHandler = () =>{
    localStorage.removeItem("userInfo");
    history.push('/') 
  }

  const handleSearch = async () =>{
    if(!search){
      toast({
          title: 'Please enter something',
        
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "top-left"
        })
        return;
    }
    try{
      setLoading(true);
      const config = {
        headers:{
          Autherization : `Bearer ${user.token}`,
        },
      }

      const {data} = await axios.get(`http://localhost:5000/api/user?search=${search}`,{
         headers:{
          Autherization : `Bearer ${user.token}`,
        },
      });
      setLoading(false);
      setSearchResult(data);
      console.log(searchResult);

    }catch(error){
      toast({
          title: 'Error occured',
          description:'failed to load serach',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom-left"
        })
    }
  }



  const accessChat = async (userId)=>{
    try{
     setLoadingChat(true);
     const config ={
      headers:{
      "Content-type":"application/json",
       Autherization : `Bearer ${user.token}`,
      }
     }

     const {data} = await axios.post('/api/chat', {userId}, config );
     console.log(data);
     console.log(setChats([data]));
     //if(!chats?.find((c)=>c._id===data._id)) setChats([data, ...chats]);

     setSelectedChat(data);
     setLoadingChat(false);
     onClose();
    }catch(error){
         toast({
          title: 'Error fetching the data',
          description:error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom-left"
        })
    }
  }
  return (
    <>
      <Box
      
   style={{display:"flex",
   flexDirection:'row',
  justifyContent:'space-between',
  alignItems:'center',
     width:'100%',
    borderWidth:'5px',
       padding:'5px 10px 5px 10px'}}
      >
        <Tooltip label='Search users to chat' hasArrow placement='bottom-end'>
         <Button variant='ghost' onClick={onOpen}>
          <i class="fas fa-search"></i>
          <Text d={{base:'none', md:'flex'}} px="4" style={{color:'gray'}}>Search User</Text>
         </Button>
        </Tooltip>
        <Text fontSize='2xl' style={{background:'linear-gradient(to top,#ec008c,#fc6767)'}}>Talkie</Text>
        <div>
        <Menu>
          <MenuButton p={1}>
            <BellIcon fontSize='2xl' m={1} />
          </MenuButton>
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
          </MenuButton>
          <MenuList>
            <ProfileModel user={user}>
          <MenuItem style={{color:'black'}}>My Profile</MenuItem> 
          </ProfileModel>
          <MenuDivider />
          <MenuItem style={{color:'black'}}
          onClick={logoutHandler}
          >Logout</MenuItem>
        </MenuList>
        </Menu>
        
        </div>
    </Box>
    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
     <DrawerOverlay />
     <DrawerContent>
      <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
      <DrawerBody >
      <Box d='flex' justifyContent='space-between' pb={2}>
        <Input
        placeholder='Search by name or email'
        mr={2}
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}
        >Go</Button>
      </Box>
     
      {loading ? (<ChatLoading />):(
        searchResult?.map(user=>(
          <UserListItem
          key={user.id}
          user={user}
          handleFunction={()=>accessChat(user.id)}/>
        ))
      )}
     </DrawerBody>
     </DrawerContent>
     
    </Drawer>
    </>
  )
}

export default SideDrawer
