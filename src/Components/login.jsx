import React, { useState, useEffect } from "react";
import Notification from "./Notification";
import { ContextAPI } from '../ContextAPI/Context.API';

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  Box,
  useToast,
  Slide,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

const LoginPopup = () => {
  const { login, setLogin } = ContextAPI();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [NotificationTitle, SetNotificationTitle] = useState('undefined')
  const [NotificationDiscription, SetNotificationDiscription] = useState('undefined')
  const [NotificationStats, SetNotificationStats] = useState("undefined")
  const toast = useToast();

  useEffect(() => {
    console.log('kdkd', localStorage.getItem('Login'))
    if (!login) {
      setLoginOpen(true);

    }

  }, []);

  /** Notification Component function */
  const NotificaitionCall = (title, description, status) => {
    setShowNotification(true)
    SetNotificationTitle(title)
    SetNotificationDiscription(description)
    SetNotificationStats(status)
  }

  const onClose = () => {
    setLoginOpen(false);
    setEmail("");
    setPassword("");
    setError("");
  };

  const adminLogin = async () => {
    if (!validateInput()) return;
    if (email == 'krishu@123' && password == 'admin') {
      NotificaitionCall('', 'Login Success🎉', 'success')
      setLogin(true)
      localStorage.setItem('Login', 'True');

    } else {
      NotificaitionCall('Wrong Input', 'Entered Wrong Password Or Email', 'warning')
    }

    setTimeout(() => {
      setShowNotification(false)
      setLoginOpen(false)


    }, 2000)
  };

  const validateInput = () => {
    if (!email || !password) {
      toast({
        title: 'Wrong Input',
        description: 'Please Enter Email and Password',
        status: 'info',
        duration: 2000,
        position: 'top'

      })
      return false;
    }
    return true;
  };

  const onOverlayClick = (e) => {
    e.stopPropagation(); // Prevents closing the modal
  };


  return (
    <>
      <Modal isOpen={!login} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay onClick={onOverlayClick} style={{ backgroundColor: "rgba(255, 255, 255, 0.5)", backdropFilter: "blur(5px)" }} />
        <ModalContent style={{ backgroundColor: '#F0EBE3' }} >
          <Slide direction="top" in={showNotification}>
            <Box display={"flex"} width={"100%"} justifyContent={"center"} paddingTop={"20px"}>
              <Notification showAlert={showNotification} status={NotificationStats} title={NotificationTitle} description={NotificationDiscription} />
            </Box>
          </Slide>
          <ModalHeader>Login</ModalHeader>

          <ModalBody>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ border: '1px solid' }}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ border: '1px solid' }}
              />
            </FormControl>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </ModalBody>
          <ModalFooter >
            <Button colorScheme="blue" mr={3} onClick={adminLogin} >
              Login
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginPopup;
