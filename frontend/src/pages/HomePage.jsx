import React from 'react'

import ThreeDHands from './ThreeDHands'
import { Box, Container, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { LogIn, SignUp } from '../component'

const HomePage = () => {
  return (
    <div style={{overflow:'hidden'}}>
      <div style={{overflow:'hidden'}}>
     <ThreeDHands />
     </div>
     <Container maxW='md'  >
      <Box style={{position:'absolute', top:'20%', right:'10%', color:"white"}}>
        <img style={{marginLeft:'2rem',height:'40%', width:'60%', borderRadius:'50%'}} alt='logo'
        src='data:image/jpeg;base64,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' />
        <Text fontSize='8xl' fontWeight='bold' className='pink-text-gradient' >TALKIE</Text>
        <Text color='pink' fontSize='2xl'>Chat-App! </Text>
      </Box>
      <Box w='30%' p={4} className='bg'
       style={{position:'absolute', top:40, left:10, color:"white", backdropFilter:'blur(20px)'}}>
        <Tabs variant='soft-rounded' color='white' colorScheme='pink'>
  <TabList mb='1em' >
    <Tab width='50%' color='white' >Log In</Tab>
    <Tab width='50%' color='white'>Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <LogIn />
    </TabPanel>
    <TabPanel>
      <SignUp />
    </TabPanel>
  </TabPanels>
</Tabs>
      </Box>
     </Container>
    </div>
  )
}

export default HomePage
