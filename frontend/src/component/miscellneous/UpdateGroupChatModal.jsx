import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,  Spinner,  useDisclosure, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../User Avatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../User Avatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
      const { isOpen, onOpen, onClose } = useDisclosure();
     const [groupChatName, setGroupChatName ] =  useState();
     const [search , setSearch ] = useState();
     const [searchResult , setSearchResult] = useState();
     const [loading, setLoading] =useState(false);
     const [renameLoading, setRenameLoading] = useState(false);

     const toast = useToast();
   
      const { selectedChat ,setSelectedChat, user, groupMembers, setGroupMembers } = ChatState();

      console.log(selectedChat);
      console.log(groupMembers);
      let userInfo = JSON.parse(localStorage.getItem('userInfo'));
      console.log(userInfo.token);

      const fetchGroupMembers =async () =>{
        const groupId = selectedChat.id;
        console.log(groupId);
        try{ const response = await axios.get('/api/chat/allUsers',{
          params:{
            groupId:groupId
          }})
         console.log(response);
          setGroupMembers(response.data);

        }catch(error){
          console.log(error)
        }
      }
     

      const handleRemove =async (user1) =>{
        if(selectedChat.groupAdmin._id !== user._id  && user1._id !== user1._id){
         toast({
          title: 'Only Admins can remove someone!',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        });
        return;
        }

        try{
          setLoading(true);
          
          const config ={
          headers:{
            Autherization: `Bearer ${user.token}`
          }
        }

          const {data} = await axios.put('/api/chat/groupremove',{
            chatId: selectedChat._id,
            userId:user1._id
          },config);
          user1._id === user._id? setSelectedChat() :setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setLoading(false);
        }catch(error){
         toast({
          title: 'error occured',
          message:error,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        });
        setLoading(false);
        }
      };

      const handleRename=async()=>{

        if(!groupChatName) return;

        try{
          setRenameLoading(true);
          const config={
            headers:{
             Autherization : `Bearer ${user.token}`,
            },
          }

          const {data} =  await axios.patch('/api/chat/rename',{
            chatId:selectedChat.id,
            chatName: groupChatName
          },config);

          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setRenameLoading(false);
        }catch(error){
            toast({
          title: 'Error fetching the data',
          description:'Only Admin can update the group name',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        });
        setRenameLoading(false);
        }
        setGroupChatName("");
      };

      const handleSearch = async (query) =>{
         setSearch(query);
         if(!query) return;

         try{
           setLoading(true);
           const config = {
           headers:{
             Autherization: `Bearer ${user.token}`,
            },
           }

           const {data}= await axios.get(`/api/user?search=${search}`, config);
           console.log(data);
           setLoading(false);
           setSearchResult(data);
         }catch(error){
              toast({
          title: 'Error fetching the data',
          description:error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        });
        setLoading(false);
         }
      }

      const handleAddUser =async (user1) =>{
      
       if(user.id === user1.id){
        toast({
          title: 'UserAlready in group',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        });
        return;
       }
       /*if(selectedChat.group-user-info.userId !== user.id){
        toast({
          title: 'Only Admin can add someone!',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        });
        return;
       }*/

       try{
        setLoading(true);
        const config ={
          headers:{
            Autherization: `Bearer ${user.token}`
          }
        }

         await axios.post('/api/chat/groupadd',{
         
          userId:user1.id,
          groupId:selectedChat.id

        },config);

       // setSelectedChat(data);
     
        setFetchAgain(!fetchAgain);
        fetchGroupMembers();
        setLoading(false);
        toast({
          title: 'user added successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        });

       }catch(error){
          toast({
          title: 'Error Occured',
          message:error,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        });
        setLoading(false);
       }
      }

      const deleteUser = async(user) =>{
        const groupId = selectedChat.id;
        const userId = user.id;
        const config ={
          headers:{
            Autherization: `Bearer ${userInfo.token}`
          }
        }
        try{
          await axios.delete(`/api/chat/deleteUser/${groupId}/${userId}`,config);
          fetchGroupMembers();
          
        }catch(error){
          toast({
          title: 'Only admin can delete User',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        });
          console.log(error);
        }
      };
  return (
    <div >
      <IconButton d={{base:'flex'}} icon={<ViewIcon />} onClick={() => {
    onOpen();
    fetchGroupMembers();
  }} />

       <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize='35px'
          d='flex'
          justifyContent='center'
          >{selectedChat.groupName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
           {/* <Box w="100%"d="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map(u=>(
                  <UserBadgeItem key={user._id}  user={u} handleFunction={()=>handleRemove(u)} />
              ))}
              </Box> */}
            <FormControl d='flex' >
             <Input 
             placeholder='chat Name'
             mb={3}
             value={groupChatName}
             onChange={(e)=>setGroupChatName(e.target.value)}
             />
             <Button
             variant='solid'
             colorScheme='teal'
             ml={1}
             isLoading={renameLoading}
             onClick={handleRename}
             >Update</Button>
            </FormControl>
            <FormControl>
              <Input
              placeholder='Add user to group'
              mb={1}
              onChange={(e)=>handleSearch(e.target.value)}
              />
            </FormControl>
            {loading?(<Spinner size='lg' />):(
              searchResult?.map(user=>(
                <UserListItem
                key={user.id}
                user={user}
                handleFunction={()=>handleAddUser(user)}

                />
              ))
              )}
              {Array.isArray(groupMembers) && groupMembers.length > 0 ? (
               groupMembers.map((user) => (
             <UserBadgeItem
              key={user.id} user={user}
             
              handleFunction={() => deleteUser(user)} />
              ))
              ) : (
                    <p>No group members available.</p>
              )}

          </ModalBody>
          <ModalFooter>
            <Button onClick={()=>handleRemove(user)}  colorScheme='red'>Leave Group</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default UpdateGroupChatModal
