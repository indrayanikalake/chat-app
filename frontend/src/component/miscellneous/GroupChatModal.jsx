import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from '../User Avatar/UserListItem';
import UserBadgeItem from '../User Avatar/UserBadgeItem';

import { createGroup } from '../../redux/groupSlice';

const GroupChatModal = ({children}) => {
  
     
      const { isOpen, onOpen, onClose } = useDisclosure();
      const [groupChatName, setGroupChatName] = useState();
        const [selectedUsers, setSelectedUsers] = useState([]);
          const [search, setSearch] = useState("");
          const [searchResult, setSearchResult] = useState([]);
          const [loading, setLoading] = useState(false);
         const toast = useToast();     

         const {user,chats,setChats, setGroup,group} = ChatState();
        console.log(searchResult);
         const handleSearch = async (query) =>{
          setSearch(query);
          if(!query){
            return;
          }
          try{
            setLoading(true);
            const config ={ 
                headers:{
                    Autherization:`Bearer ${user.token}`
                }
            }

            const {data } =  await axios.get(`/api/user?search=${search}`,config);
            console.log(data);
            setLoading(false);
            setSearchResult(data)
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

         const handleSubmit = async () =>{
            if(!groupChatName || !selectedUsers){
                
             toast({
          title: 'Please fill all the fields',
          
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "top"
        })
        return ;
            }
            try{
              
               
        const config ={ 
                headers:{
                    Autherization:`Bearer ${user.token}`
                }
            }

              await axios.post('http://localhost:5000/api/chat/group',{
                name:groupChatName,
                
            },config);
            setGroup(!group);
            onClose();
               toast({
          title: 'new group chat created ',
          
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: "top"
        })
            }catch(error){
               toast({
          title: 'something went wrong',
          description:error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "top"
        })
            }
         }

         const handleGroup = (userToadd)=>{
            if(selectedUsers.includes(userToadd)){
                 toast({
          title: 'User already added',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: "top"
        })
        return;
            }
           setSelectedUsers([...selectedUsers, userToadd]);
         }

         const handleDelete =(deleteUser)=>{
          setSelectedUsers(
            selectedUsers.filter(sel=>sel._id != deleteUser._id)
          )
         }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize='35px'
          d='flex'
          justifyContent='center'
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          d='flex'
          flexDir='column'
          alignItems='center'
          >
          <FormControl>

            <Input placeholder="Chat Name" mb={3} onChange={(e)=>setGroupChatName(e.target.value)} />
          </FormControl>
           <FormControl>

            <Input placeholder="Search Users" mb={1} onChange={(e)=>handleSearch(e.target.value)} />
          </FormControl>
          {/*selected users*/}
          <Box w="100%" d="flex" flexWrap='wrap' >
          {selectedUsers?.map(u=>(
            <UserBadgeItem key={user._id}  user={u} handleFunction={()=>handleDelete(u)} />
          ))}
          </Box>

          {/* render search users*/}
          {loading?<Spinner /> :(
            <div>
              {  searchResult?.slice(0,4).map(user=>(<UserListItem key={user._id} user={user} 
                handleFunction={()=>handleGroup(user)}
                />))}
            </div>
          )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue'  onClick={handleSubmit}>
              Create Chat
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
