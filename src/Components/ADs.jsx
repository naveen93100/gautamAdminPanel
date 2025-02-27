import React, { useEffect, useState } from 'react';
import { ContextAPI } from '../ContextAPI/Context.API';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast
} from '@chakra-ui/react';

const ImagePopupModal = ({ isOpen, onClose }) => {
  const { DataHandler } = ContextAPI();
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [header, setHeader] = useState('');
  const toast = useToast();

  useEffect(() => {
    setSelectedFile(null);
    setDescription('');
    setHeader('');
  }, [isOpen]);

  const handleFileChange = (event) => {
    console.log(event.target.files);
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!description || !selectedFile || !header) {
      toast({
        description: "Input is not valid",
        status: 'info',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
      return;
    }

    const formData = new FormData();
    formData.append('Description', description);
    formData.append('header', header);
    formData.append('productimage', selectedFile);

    toast({
      title: 'Wait',
      description: "We are creating",
      status: 'loading',
      duration: 2000,
      isClosable: true,
      position: 'top'
    });

    try {
      const response = await fetch('https://lovely-pear-kilt.cyclic.app/admin/Upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log(data);

      toast({
        title: 'Image uploaded successfully.',
        description: "We've uploaded the image",
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });

      setTimeout(() => {
        DataHandler();
        onClose();
      }, 3000);
    } catch (error) {
      toast({
        title: 'Error',
        description: "Internal Error",
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
    }
  };


  return (
    <div style={{ padding: '' }}>
      <Modal isOpen={isOpen} onClose={onClose} size={'100'}>
        <ModalOverlay />
        <ModalContent style={{ padding: '20px' }}>
          <ModalHeader>Upload AD's</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: '2px dashed #cccccc',
                borderRadius: '5px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '20px',
              }}
            >
              {selectedFile ? (
                <p style={{ fontWeight: 'bold', fontSize: 'large' }}>{selectedFile.name}</p>
              ) : (
                <>
                  Drag & Drop{' '}

                  <label htmlFor="fileInput">
                    <u style={{}}>click to select</u>
                  </label>

                  <input
                    type="file"
                    id="fileInput"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </>
              )}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Upload
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ImagePopupModal;
