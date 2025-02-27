import { useEffect, useState } from 'react';
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
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast
} from '@chakra-ui/react';

const PopupModal = ({ isOpen, onClose }) => {
  const { DataHandler } = ContextAPI()
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [header, setHeader] = useState('')
  const toast = useToast()

  useEffect(() => {
    setSelectedFile(null)
    setTitle('')
    setDescription('')
    setHeader('')
  }, [isOpen])

  const handleFileChange = (event) => {
    console.log(event.target.files)
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

    if (!title || !description || !selectedFile || !header) {
      toast({
        title: 'Invalid',
        description: "Input are not Valid",
        status: 'info',
        duration: 5000,
        isClosable: true,
        position: 'top'
      })
      return
    }

    const formData = new FormData();
    formData.append('Body', description); /**Visual HTM Part */
    formData.append('Header', header);
    formData.append('BlogImage', selectedFile); // Use the same field name as defined in multer upload.single()

    toast({
      title: 'Wait',
      description: "We are creating",
      status: 'loading',
      duration: 2000,
      isClosable: true,
      position: 'top'
    })

    try {
      const response = await fetch('http://localhost:9090/admin/createNews', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log(data)

      toast({
        title: 'News created.',
        description: "We've created News",
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })

      setTimeout(() => {
        DataHandler()
        onClose()
      }, 3000)

    } catch (error) {
      toast({
        title: 'Error',
        description: "Internal Error",
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top'
      })
    }
  };
  return (
    <div style={{ padding: '' }}>
      <Modal isOpen={isOpen} onClose={onClose} size={'100'}>
        <ModalOverlay />
        <ModalContent style={{ padding: '20px' }}>
          <ModalHeader>Create New News</ModalHeader>
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
                  Drag & Drop file here or{' '}
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
            <FormControl mb={4}>
              <FormLabel>header</FormLabel>
              <Input placeholder='Please Enter Header, which will show in card' type="text" value={header} onChange={(e) => setHeader(e.target.value)} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Title</FormLabel>
              <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} height={'200px'} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>

  );
};

export default PopupModal;



