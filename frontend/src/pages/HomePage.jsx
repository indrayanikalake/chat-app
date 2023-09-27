import React from 'react'

import ThreeDHands from './ThreeDHands'
import { Box, Container, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { LogIn, SignUp } from '../component'

const HomePage = () => {
  return (
    <div style={{overflow:'hidden'}}>
     <ThreeDHands />
     <Container maxW='md'  >
      <Box style={{position:'absolute', top:'40%', right:'10%', color:"white"}}>
        <Text fontSize='8xl' fontWeight='bold' className='pink-text-gradient' >TALKIE</Text>
        <Text color='pink' fontSize='2xl'>Chat-App! </Text>
      </Box>
      <Box w='30%' p={4} borderRadius='lg' borderWidth='1px'
       style={{position:'absolute', top:40, left:10, color:"white", background:'transparent', backdropFilter:'blur(20px)'}}>
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
