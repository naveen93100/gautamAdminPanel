// CardDetails.js

import React from "react";
import { Box, Image, Text } from "@chakra-ui/react";
import ParentComponent from "./ParentComponent";

const CardDetails = ({ header, title, date, imageURL, description }) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" width="100%">
      <Text fontWeight="bold">{header}</Text>
      <Text>{title}</Text>
      <Text fontSize="sm" color="gray.500">{date}</Text>
      <Image src={imageURL} alt={title} />
      <Text>{description}</Text>
    </Box>
  );
}; 

export default CardDetails;
