import { ViewIcon } from '@chakra-ui/icons'
import { Button, Text, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModel = ({user, children}) => {
     const { isOpen, onOpen, onClose } = useDisclosure();
     console.log(user.name);
  return (
    <>
      {children?<span onClick={onOpen}>{children}</span>:(
       <IconButton
       d={{base:"flex"}}
       icon={<ViewIcon />}
       onClick={onOpen}
       />
      )}
       <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered >
        <ModalOverlay />
        <ModalContent
       
        fontSize="40px"
        d="flex"
        justifyContent="center"
        >
          <ModalHeader>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          d='flex'
          flexDir='column'
          alignItems='center'
          justifyContent='space-between'
          >
           <Image
           borderRadius="full"
           boxSize="150px"
           src={user.pic}
           alt={user.name}
           />
           <Text fontSize={{base:'28px', md:"30px"}}>
            Email:{user.email}
            </Text  >
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModel
