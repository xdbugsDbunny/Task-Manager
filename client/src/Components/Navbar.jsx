import React from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Image,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";

const Links = ["Create New Task"];

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const shouldRenderLinks = location.pathname !== "/auth";
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const logout = async () => {
    try {
      const response = await axios.post(
        `https://task-manager-iyykoxpat-xdbugsdbunnys-projects.vercel.app/api/v1/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("User Logged Out");
        navigate("/auth");
      } else {
        toast.error("Logout Failed");
      }
    } catch (error) {
      toast.error(error.response);
      console.log(error);
    }
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Image
              onClick={() => navigate("/home")}
              src={logo}
              alt="Task Manager Logo"
              w="45px"
              h="45px"
              cursor="pointer"
            />
            {shouldRenderLinks && (
              <HStack
                as={"nav"}
                spacing={4}
                display={{ base: "none", md: "flex" }}
              >
                <Flex
                  px={2}
                  py={1}
                  rounded={"md"}
                  _hover={{
                    textDecoration: "none",
                    bg: useColorModeValue("gray.200", "gray.700"),
                  }}
                  alignItems="center"
                  justifyContent="center"
                  gap="2"
                  border="1px solid wheat"
                >
                  <AddIcon />
                  <NavLink to="/create-task">Create New Task</NavLink>
                </Flex>
              </HStack>
            )}
          </HStack>
          <Flex alignItems={"center"} gap={"5"}>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
            {shouldRenderLinks && (
              <>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      src={
                        user?.avatar ||
                        "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                      }
                    />
                  </MenuButton>
                  <MenuList>
                    <MenuItem>Link 1</MenuItem>
                    <MenuItem>Link 2</MenuItem>
                    <MenuDivider />
                    <MenuItem>Link 3</MenuItem>
                  </MenuList>
                </Menu>
                <Button bg={"#d32f2f"} onClick={logout}>
                  Logout
                </Button>
              </>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <NavLink to="/create-task">Create New Task</NavLink>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default Navbar;
