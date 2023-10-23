import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { ChatState } from '../../context/ChatProvider';

const SignUp = () => {
    const [show,setShow] = useState(false);
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [cnfmPassword,setCnfmPassword] = useState('');
    const [password,setPassword] = useState('');
    const [pic,setPic] = useState();
    const [ loading, setLoading ] = useState(false);
      const toast = useToast();
      const history= useHistory();
      const {auth, setAuth} = ChatState();

    const handleClick = () =>{
        setShow(!show);
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

         if(pic.type === 'image/jpeg' || pic.type === 'image/png' ){
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
         }else{
             toast({
          title: 'Please select an image',
      
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
         }
    }
    
    const submitHandler = async () =>{
        setLoading(true);
        if(!name || !email || !password || !cnfmPassword){
             toast({
          title: 'Please fill all the fields',
      
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
        setLoading(false);
        return;
        }

        if(password !== cnfmPassword){
              toast({
          title: 'Password do not match',
      
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        return;
        }

        try{
            const config = {
                headers:{
                   "content-type" : "application/json"
                }
            }

            const { data } = await axios.post('http://localhost:5000/api/user', {name, email, password, pic}, config)
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
    <VStack 
   
    spacing='5px' color='white'>
     <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
            <Input
            placeholder='Enter your name'
            onChange={(e)=>setName(e.target.value)}
            />
        
     </FormControl>
      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
            <Input
            placeholder='Enter your email'
            onChange={(e)=>setEmail(e.target.value)}
            />
        
     </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
            <Input
            type={show?'text':'password'}
            placeholder='Enter your password'
            onChange={(e)=>setPassword(e.target.value)}
            />
            <InputRightElement width='4.5rem'>
            <Button h='1.78rem' size='sm' onClick={handleClick}>
                {show?"Hide":"Show"}
            </Button>
            </InputRightElement>
        </InputGroup>
        
     </FormControl>
      <FormControl id='password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
            <Input
            type={show?'text':'password'}
            placeholder='Enter your password'
            onChange={(e)=>setCnfmPassword(e.target.value)}
            />
            <InputRightElement width='4.5rem'>
            <Button h='1.78rem' size='sm' onClick={handleClick}>
                {show?"Hide":"Show"}
            </Button>
            </InputRightElement>
        </InputGroup>
        
     </FormControl>
     <FormControl id='pic' isRequired>
        <FormLabel>Upload Your Picture</FormLabel>
            <Input
            type='file'
            p={1.5}
            accept='image/*'
            onChange={(e)=>postDetails(e.target.files[0])}
            />
        
     </FormControl>
     <Button
     colorScheme='pink'
     width='100%'
     style={{marginTop:15 }}
     onClick={submitHandler}
     isLoading={loading}
     >Sign Up</Button>
    </VStack>
    </div>
  )
}

export default SignUp
