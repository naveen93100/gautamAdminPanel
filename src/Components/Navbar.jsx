import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Link,
  IconButton,
  Button,
  useColorMode,
  useDisclosure,
  Stack,
  Image,
  Text,
  background,
} from "@chakra-ui/react";
import SearchPopup from "./search";
import { ContextAPI } from "../ContextAPI/Context.API";

function Navbar() {
  const { login, setLogin } = ContextAPI();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("Login"));
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("Login");
    setLogin(false);
  };

  // Define red theme colors. For both light and dark modes, we use shades of red.
  const bgColor = colorMode === "dark" ? "red.700" : "red.700";
  const textColor = "white";

  return (
    <Box
      as="nav"
      bg={bgColor}
      px={4}
      py={3}
      boxShadow="md"
      position="relative"
      top={0}
      w="100%"
      // zIndex={100}
      transition="background-color 0.3s ease"
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Logo Section */}
        <Flex alignItems="center">
          <Link href="/" fontSize="1.5rem" fontWeight="bold" _hover={{ textDecoration: "none" }}>
            <img src="./gautamSolarLogo.png" alt="News Name" width="100" />
          </Link>
        </Flex>

        {/* Desktop Navigation */}
        <Flex alignItems="center">
          <Flex display={{ base: "none", md: "flex" }} ml={10} alignItems="center">
            <NavLink href="/" textColor={textColor} >
              All Blog
            </NavLink>
            <NavLink href="/blog" textColor={textColor}>
              Blog
            </NavLink>
            <SearchPopup />
          </Flex>

          {login && (
            <Button
              variant="ghost"
              colorScheme="whiteAlpha"
              ml={4}
              onClick={handleLogOut}
              color={textColor}
              _hover={{ bg: "red.600" }}
            >
              Logout
            </Button>
          )}

          {/* Color Mode Toggle */}
          <IconButton
            ml={4}
            aria-label="Toggle Color Mode"
            onClick={toggleColorMode}
            icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
            color={textColor}
            bg="transparent"
            _hover={{ bg: "red.600" }}
            transition="all 0.3s ease"
          />

          {/* Mobile Menu Toggle */}
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: "none" }}
            ml={2}
            onClick={isOpen ? onClose : onOpen}
            color={textColor}
            bg="transparent"
            _hover={{ bg: "red.600" }}
            transition="all 0.3s ease"
          />
        </Flex>
      </Flex>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <Box pb={4} display={{ md: "none" }} >
          <Stack as="nav" spacing={4}>
            <NavLink href="/" textColor={textColor}>
              All Blog
            </NavLink>
            <NavLink href="/blog" textColor={textColor}>
              Blog
            </NavLink>
            <SearchPopup />
            {login && (
              <Button
                variant="ghost"
                colorScheme="whiteAlpha"
                onClick={handleLogOut}
                color={textColor}
                _hover={{ bg: "red.600" }}
              >
                Logout
              </Button>
            )}
          </Stack>
        </Box>
      )}
       {/* {isOpen && (
        <Box
          position="fixed"
          top={0}
          right={0}
          height="100vh"
          width="250px"
          background="rgba(0, 0, 0, 0.5)" 
          backdropFilter="blur(10px)" 
        
          p={4}
          zIndex={1000}
          display={{ base: "block", md: "none" }}
        >
          <Flex justifyContent="space-between" alignItems="center" mb={6}>
            <Text fontSize="lg" fontWeight="bold" color="white">
              Menu
            </Text>
            <IconButton
              icon={<CloseIcon />}
              aria-label="Close sidebar"
              onClick={onClose}
              variant="ghost"
              color="black"
              size="sm"
            />
          </Flex>
          <Stack as="nav" spacing={4}>
            <NavLink href="/" textColor="white" >
              All Blog
            </NavLink>
            <NavLink href="/blog" textColor="white">
              Blog
            </NavLink>
            <SearchPopup />
            {login && (
              <Button
                variant="ghost"
                colorScheme="whiteAlpha"
                onClick={handleLogOut}
                color="white"
                _hover={{ bg: "red.600" }}
              >
                Logout
              </Button>
            )}
          </Stack>
        </Box>
      )} */}

    </Box>
  );
}

// Custom NavLink component for consistent styling
function NavLink({ href, children, textColor }) {
  return (
    <Link
      px={3}
      py={2}
      rounded="md"
      href={href}
      fontWeight="semibold"
      color={textColor}
      transition="background-color 0.3s ease"
      _hover={{
        textDecoration: "none",
        bg: "red.600",
      }}
    >
      {children}
    </Link>
  );
}

export default Navbar;
