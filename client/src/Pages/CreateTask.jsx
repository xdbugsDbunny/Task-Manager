import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  Container,
  Box,
  Text,
  Select,
  useToast,
  Heading,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [priority, setPriority] = useState("medium");
  const toast = useToast();
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      if (!title || !description || !selectedDate || !priority) {
        toast({
          title: "All fields are required.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const newTask = {
        title,
        description,
        dueDate: selectedDate,
        priority,
        status: "PENDING",
      };

      const response = await axios.post(`/api/v1/task/`, newTask);

      toast({
        title: "Task created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTitle("");
      setDescription("");
      setSelectedDate(null);
      setPriority("");
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error creating task.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleNavigate = () => {
    navigate("/home");
  };

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        bg={"gray.dark"}
        color={"gray.light"}
      >
        <Text fontSize="4xl" textAlign="center" color={"gray.light"}>
          Create A New Task
        </Text>
      </Box>
      <Box
        bg={"gray.dark"}
        w="100%"
        p={4}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <VStack spacing="5px" color={"gray.light"}>
          <FormControl id="title" isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              placeholder="Enter Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <FormControl id="description" isRequired>
            <FormLabel>Description</FormLabel>
            <Input
              name="description"
              placeholder="Provide a description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl id="dueDate" isRequired>
            <FormLabel>Due Date</FormLabel>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              customInput={<Input />}
            />
          </FormControl>
          <FormControl id="priority" isRequired>
            <FormLabel>Priority</FormLabel>
            <Select
              variant="outline"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              placeholder="Select Priority"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </FormControl>
          <Button
            colorScheme="blue"
            width="100%"
            mt={"15px"}
            type="submit"
            onClick={handleCreate}
          >
            Create
          </Button>
          <Heading
            as="h4"
            fontSize="xl"
            textAlign="center"
            color={"gray.light"}
          >
            OR
          </Heading>
          <Button
            colorScheme="blue"
            width="100%"
            mt={"15px"}
            type="submit"
            onClick={handleNavigate}
          >
            Home
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default CreateTask;
