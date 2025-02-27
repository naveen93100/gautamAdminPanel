import React, { useState } from "react";
import { Box, Image, Text, VStack, HStack, useToast, Slide, Button, useBreakpointValue } from "@chakra-ui/react";
import { ContextAPI } from '../ContextAPI/Context.API';
import Notification from "./Notification";
import ViewModal from "./View";
import axios from "axios";
import ZoomImageModal from "./ZoomImageModal";
import TextEditor from "./BlogSection/Editor/TextEditor";
import { useLocation, useNavigate } from "react-router-dom";

const Card = ({ _id, imageURL, title, description, date, header, uuid, videoUrl }) => {
  const { DataHandler } = ContextAPI();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationDescription, setNotificationDescription] = useState('');
  const [notificationStatus, setNotificationStatus] = useState('');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const onClose = () => {
    setIsOpen(!isOpen);
  };

  const showNotificationMessage = (title, description, status) => {
    setNotificationTitle(title);
    setNotificationDescription(description);
    setNotificationStatus(status);
    setShowNotification(true);
  };

  const onDelete = async () => {
    try {
      showNotificationMessage('Deleting Blog', '', 'loading');
      await axios.delete(`https://gautamsolar.us/admin/delete?_id=${_id}&uuid=${uuid}`);
      // await axios.delete(`http://localhost:1008/admin/delete?_id=${_id}&uuid=${uuid}`);

      showNotificationMessage('Deleted Blog Successfully', '', 'success');

      setTimeout(() => {
        DataHandler();
        setShowNotification(false);
      }, 3000);

    } catch (err) {
      toast({
        title: 'Error',
        description: "Something Went Wrong, try again",
        status: 'error',
        duration: 1000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDate();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return [day.toString(), month, year];
  };

  const onImageClick = () => {
    setIsZoomOpen(true);
  };

  const onZoomClose = () => {
    setIsZoomOpen(false);
  };
  // const onEdit = () => {
  //   setIsEditOpen(true); // Set edit mode open
  // };
  const handleEditClick = (id) => {
    navigate("/blog", { state: { id } });
  };
  return (

    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="md"
      width="100%"
    // bg="white"
    >
      {/* Notification */}
      <Slide direction="top" in={showNotification}>
        <Box display="flex" width="100%" justifyContent="center" pt={5}>
          <Notification
            showAlert={showNotification}
            status={notificationStatus}
            title={notificationTitle}
            description={notificationDescription}
          />
        </Box>
      </Slide>

      {/* Main Content */}
      <HStack spacing={4} alignItems="start" flexWrap="wrap">
        {/* Responsive Image */}
        <Image
         width='80px'
          src={imageURL}
          alt={title}
          boxSize={useBreakpointValue({ base: "100%", md: "30%" })}
          objectFit="cover"
          onClick={onImageClick}
          borderRadius="md"
          _hover={{ cursor: "pointer", opacity: 0.8 }}
        />


        <VStack align="start" spacing={3} flex="1">
          <Text fontWeight="bold" fontSize="xl" textTransform="capitalize">
            {header}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {`${formatDate(date)[0]} | ${formatDate(date)[1]} | ${formatDate(date)[2]}`}
          </Text>

          <HStack spacing={3}>
            <Button
              size="sm"
              colorScheme="teal"
              borderRadius="md"
              onClick={onClose}
            >
              See More
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              borderRadius="md"
              onClick={onDelete}
            >
              Delete
            </Button>
            <Button
              size="sm"
              colorScheme="yellow"
              borderRadius="md"
              onClick={() => handleEditClick(uuid)}
            >
              Edit
            </Button>
          </HStack>

          {/* View Modal */}
          <ViewModal
            onClose={onClose}
            isOpen={isOpen}
            imageURL={imageURL}
            header={header}
            description={description}
            videoUrl={videoUrl}
          />
        </VStack>
      </HStack>
      <ZoomImageModal isOpen={isZoomOpen} onClose={onZoomClose} imageURL={imageURL} />

    </Box>
  );
};

export default Card;
