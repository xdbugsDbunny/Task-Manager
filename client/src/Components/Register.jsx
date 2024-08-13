import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { hideLoading, showLoading } from "../Redux/alertReducer";
import { toast } from "react-hot-toast";

const Register = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null,
  });

  const handleUploadChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRegisterData({
        ...registerData,
        avatar: file,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const handleShow = () => {
    setShow(!show);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());

      const response = await axios.post("/api/v1/user/register", registerData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(hideLoading());

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <VStack spacing="5px" color={"gray.light"}>
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          name="name"
          placeholder="Enter Your Name"
          value={registerData.name}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          placeholder="Enter Your Email"
          value={registerData.email}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            name="password"
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            value={registerData.password}
            onChange={handleInputChange}
          />
          <InputRightElement width="4.5rem">
            <Button h="2.5rem" ml="3px" size="lg" onClick={handleShow}>
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="avatar" isRequired>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          name="avatar"
          type="file"
          placeholder="Upload Your Picture"
          p={"5px"}
          onChange={handleUploadChange}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        mt={"15px"}
        onClick={handleRegister}
        type="submit"
      >
        Register
      </Button>
    </VStack>
  );
};

export default Register;
