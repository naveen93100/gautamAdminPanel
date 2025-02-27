import React from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

const Notification = ({ showAlert, status, title, description }) => {
  return (
    showAlert ? (
      <Alert status={status} variant="solid" width={{ base: "90%", md: "40%", lg: "40%" }} borderRadius={"5px"} marginTop={"10px"}>
        <AlertIcon />
        <AlertTitle mr={2}>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    ) : ""

  );
};

export default Notification; 