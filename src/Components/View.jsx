import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Image,
  Heading,
  Text,
  Divider,
} from "@chakra-ui/react";


const ViewModal = ({ isOpen, onClose, imageURL, header, description, videoUrl }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent borderRadius="lg">
        <ModalHeader textAlign="center"  borderBottom='2px solid'>{header}</ModalHeader>
        <ModalCloseButton top={'5px'} />
        <ModalBody>
          <Box height="60vh"  overflowY="auto" padding='10px'>
            
              <Image src={imageURL} alt="Image" width="100%" style={{borderRadius:'15px'}} />
              <Divider my={4} />
              {videoUrl&&
              <Box display="flex" justifyContent="center" >
                <video width="100%" controls style={{borderRadius:'15px'}}>
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Box>
              }
            <Divider my={4} />
            <Box p={4}>
              <Heading as="h2" size="md" mb={2}>
                {header}
              </Heading>
              <Text>{description}</Text>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>

  );
};

export default ViewModal;
