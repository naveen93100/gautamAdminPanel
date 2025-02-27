import React, { useState } from "react";
import { Modal, ModalOverlay, ModalContent, useToast, ModalHeader, Slide, ModalFooter, ModalBody, ModalCloseButton, Button, Input, Textarea, Image, Box } from "@chakra-ui/react";
import axios from "axios";
import Notification from "./Notification";
import { ContextAPI } from '../ContextAPI/Context.API';

const EditModal = ({ isOpen, onClose, _id, header, title, description, imageURL, uuid }) => {
  // State for edited data
  const [editedHeader, setEditedHeader] = useState(header);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedImage, setEditedImage] = useState(null); // State for edited image
  const [showNotification, setShowNotification] = useState(false);
  const [NotificationTitle, SetNotificationTitle] = useState('undefined')
  const [NotificationDiscription, SetNotificationDiscription] = useState('undefined')
  const [NotificationStats, SetNotificationStats] = useState("undefined")
  const toast = useToast();
  const { DataHandler } = ContextAPI()
  /** Notification Component function */
  const NotificaitionCall = (title, description, status) => {
    setShowNotification(true)
    SetNotificationTitle(title)
    SetNotificationDiscription(description)
    SetNotificationStats(status)
  }

  /**Function to handle image change */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditedImage(file);
  }

  /*Function to handle header change*/
  const handleHeaderChange = (e) => {
    setEditedHeader(e.target.value);
  }
  /*Function to handle title change*/
  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  }
  /*Function to handle description change*/

  const handleDescriptionChange = (e) => {
    setEditedDescription(e.target.value);
  }

  /*Function to handle update*/
  const handleUpdate = async () => {
    console.log(editedImage)
    try {
      const formData = new FormData();
      formData.append("header", editedHeader);
      formData.append("title", editedTitle);
      formData.append("description", editedDescription);
      if (editedImage) {
        formData.append('UpdateNewsImage', editedImage);
      }

      const { data } = await axios.patch(`https://localhost:9090/admin/updateNews?_id=${_id}&uuid=${uuid}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      });
      console.log(data)
      setTimeout(() => {
        setShowNotification(false)
      }, 2000)
      setTimeout(() => {
        onClose();  /**Close the modal after successful edit */

      }, 3000)

      setTimeout(() => {

        DataHandler()
        toast({
          title: 'Refresh',
          description: 'Just Once time refresh the Page to get Update Image',
          status: 'info',
          duration: 5000,
          position: 'top'
        })
      }, 3300)
      NotificaitionCall('Updated', 'News Updated Succesfully!', 'success')

    } catch (error) {
      console.error("Error editing document:", error);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'500'}>
      <ModalOverlay />
      <ModalContent>
        <Slide direction="top" in={showNotification}>
          <Box display={"flex"} width={"100%"} justifyContent={"center"} paddingTop={"30px"}>
            <Notification showAlert={showNotification} status={NotificationStats} title={NotificationTitle} description={NotificationDiscription} />
          </Box>
        </Slide>
        <ModalHeader>Edit News</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Form inputs for editing data */}
          <Box mb={3}>
            <Image src={imageURL} alt="Current Image" />
            <Input type="file" onChange={handleImageChange} />
          </Box>
          <Input mb={3} placeholder="Header" value={editedHeader} onChange={handleHeaderChange} />
          <Input mb={3} placeholder="Title" value={editedTitle} onChange={handleTitleChange} />
          <Textarea mb={3} placeholder="Description" value={editedDescription} onChange={handleDescriptionChange} />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
            Update
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditModal;
