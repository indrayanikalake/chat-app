import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const SignUp = () => {
    const [show,setShow] = useState(false);
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [cnfmPassword,setCnfmPassword] = useState('');
    const [password,setPassword] = useState('');
    const [pic,setPic] = useState();

    const handleClick = () =>{
        setShow(!show);
    }

    const postDetails = ()=>{}
    const submitHandler = () =>{}
  return (
    <div>
    <VStack spacing='5px' color='white'>
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
     >Sign Up</Button>
    </VStack>
    </div>
  )
}

export default SignUp
