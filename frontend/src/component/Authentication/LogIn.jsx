import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { ChatState } from '../../context/ChatProvider';

const LogIn = () => {
     const [show,setShow] = useState(false);
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
   
    const [password,setPassword] = useState('');
    const [ loading, setLoading ] = useState(false);
    const toast = useToast();
    const history = useHistory();
    const {auth, setAuth} = ChatState();

    const handleClick = () =>{
        setShow(!show);
    }

    const postDetails = ()=>{}
    const submitHandler = async () =>{
         setLoading(true);
        if(!name || !email || !password ){
             toast({
          title: 'Please fill all the fields',
      
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
        setLoading(false);
        return;
        }

        try{
            const config = {
                headers:{
                   "content-type" : "application/json"
                }
            }

            const { data } = await axios.post('http://localhost:5000/api/user/login', {name, email, password}, config)
              toast({
          title: 'Registration successful',
      
          status: 'success',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        })
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        setAuth(!auth);
        history.push('/chats')
        }catch(error){

              toast({
          title: error.response.data.message,
      
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        setLoading(false);
        }
    }
  return (
    <div>
        <VStack spacing='5px' color='white'>
     <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
            <Input
            placeholder='Enter your name'
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />
        
     </FormControl>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
            <Input
            placeholder='Enter your email'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
        
     </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
            <Input
            type={show?'text':'password'}
            placeholder='Enter your password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
            <InputRightElement width='4.5rem'>
            <Button h='1.78rem' size='sm' onClick={handleClick}>
                {show?"Hide":"Show"}
            </Button>
            </InputRightElement>
        </InputGroup>
        
     </FormControl>
     
     <Button
     colorScheme='pink'
     width='100%'
     style={{marginTop:15 }}
     onClick={submitHandler}
     isLoading={loading}
     >Log In</Button>
      <Button
      variant='solid'
     colorScheme='red'
     width='100%'
     style={{marginTop:15 }}
     onClick={()=>{
        setName("guest")
        setEmail("guest@example.com")
        setPassword('123456')
     }}
     >Get User Credentials</Button>
    </VStack>
    </div>
  )
}

export default LogIn
