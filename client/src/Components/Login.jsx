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
import { hideLoading, showLoading } from "../Redux/alertReducer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(loginData);
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/v1/user/login", loginData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      dispatch(hideLoading());

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/home");
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.response.data.message);
    }
  };

  return (
    <VStack spacing="5px" color={"gray.light"}>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          placeholder="Enter Your Email"
          value={loginData.email}
          onChange={handleLoginInputChange}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            name="password"
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            value={loginData.password}
            onChange={handleLoginInputChange}
          />
          <InputRightElement width="4.5rem">
            <Button h="2.5rem" ml="3px" size="lg" onClick={handleShow}>
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button colorScheme="blue" width="100%" mt={"15px"} onClick={handleLogin}>
        Login
      </Button>
    </VStack>
  );
};

export default Login;
