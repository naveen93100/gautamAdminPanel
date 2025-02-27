import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, Image, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
const ZoomImageModal = ({ isOpen, onClose, imageURL }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent bg="transparent" boxShadow="none">
        <ModalBody display="flex" justifyContent="center" alignItems="center">
          <IconButton
            icon={<CloseIcon />}
            position="absolute"
            top="17px"
            right="100px"
            onClick={onClose}
            bg="white"
            borderRadius="50%"
          />
          <Image src={imageURL} maxH="90vh" maxW="90vw" />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ZoomImageModal;
