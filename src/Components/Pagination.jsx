import React, { useState } from 'react';
import { HStack, Button } from '@chakra-ui/react';
import { ContextAPI } from '../ContextAPI/Context.API';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';

const Pagination = ({ }) => {
  const {data, setData } = ContextAPI()
  const [disable, setDisable] = useState(false)

  const toast = useToast();
  const handlePrevious = async () => {
    if (+JSON.parse(localStorage.getItem('Page')) > 1) {
      let { data } = await axios.get(`https://gautamsolar.us/admin/news?NoOfNews=5&Page=${Number(JSON.parse(localStorage.getItem('Page'))) - 1}`);
      // let { data } = await axios.get(`http://localhost:1008/admin/news?NoOfNews=5&Page=${Number(JSON.parse(localStorage.getItem('Page'))) - 1}`);
      setData(data.data);
      let tempPage = Number(JSON.parse(localStorage.getItem('Page'))) - 1;
      localStorage.setItem('Page', `${tempPage}`);
      setDisable(false)
    }
  };

  const handleNext = async () => {
    try {
      let { data } = await axios.get(`https://gautamsolar.us/admin/news?NoOfNews=5&Page=${Number(JSON.parse(localStorage.getItem('Page'))) + 1}`);
      // let { data } = await axios.get(`http://localhost:1008/admin/news?NoOfNews=5&Page=${Number(JSON.parse(localStorage.getItem('Page'))) + 1}`);
      setData(data.data);
      let tempPage = Number(JSON.parse(localStorage.getItem('Page'))) + 1;
      localStorage.setItem('Page', `${tempPage}`);


    } catch (err) {
      toast({
        title: 'OOps !',
        description: "We Had That Much data",
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      setDisable(true)
    }

  };


  return (
    <HStack spacing={4} justifyContent="center" mt={4} marginBottom={'10px'}>
      <Button
        onClick={handlePrevious}
        isDisabled={Number(JSON.parse(localStorage.getItem('Page'))) === 1 && !disable}
        bg="blue.500"
        color="white"
        _hover={{ bg: 'blue.400' }}
        _disabled={{ bg: 'gray.400', cursor: 'not-allowed' }}
      >
        Previous
      </Button>
      <Button
        isDisabled={disable}
        onClick={handleNext}
        bg="blue.500"
        color="white"
        _hover={{ bg: 'blue.400' }}
      >
        Next
      </Button>
    </HStack>
  );
};

export default Pagination;
