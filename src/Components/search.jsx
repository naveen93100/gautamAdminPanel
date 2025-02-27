import { useState } from 'react';
import { SearchIcon } from "@chakra-ui/icons";
import { Tooltip, Button, Input, InputGroup, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, useToast } from '@chakra-ui/react';
import { AnimatePresence, motion } from "framer-motion";
import { ContextAPI } from '../ContextAPI/Context.API';

const SearchPopup = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isSearchIconVisible, setSearchIconVisible] = useState(true);
    const [inputValue, SetinputValue] = useState('')
    const {data, DataHandler} = ContextAPI()
    const toast = useToast()

    const handleSearchIconClick = () => {
        
        setSearchIconVisible(false);
        onOpen();
        DataHandler()
    };

    const onSubmit = ()=>{
          toast({
            title: 'Wait',
            description: "We are fetching Data",
            status: 'loading',
            duration: 1000,
            isClosable: true,
            position:'top-left'
        })
        const filteredData =  data?.filter(item => item.Header.toLowerCase().includes(inputValue.toLowerCase()));
        // console.log(filteredData);
        DataHandler(filteredData)
      

        setTimeout(()=>{
            setSearchIconVisible(true);
                onClose()
        },1000)
    }

    const handleClose = () => {
        setSearchIconVisible(true);
        onClose();
    };

    return (
        <>
            <Tooltip label='Search News'>
                <Button marginLeft={'10px'} onClick={handleSearchIconClick}>

                    <SearchIcon />

                </Button>
            </Tooltip>
            <AnimatePresence>
                {!isSearchIconVisible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Modal isOpen={isOpen} onClose={handleClose} motionPreset='slideInTop' size={'xl'} >
                            <ModalOverlay />
                            <ModalContent>
                                {/* <ModalCloseButton /> */}
                                <ModalBody>
                                    <InputGroup>
                                        <Input onChange={(e)=>{SetinputValue(e.target.value)}} placeholder="Search News By Header" />
                                        <Tooltip label="Search">
                                            <Button _hover={{backgroundColor:'#9BCF53'}} marginLeft={'10px'} onClick={onSubmit}>
                                                <SearchIcon />
                                            </Button>
                                        </Tooltip>

                                    </InputGroup>
                                </ModalBody>
                            </ModalContent>
                        </Modal>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SearchPopup;
