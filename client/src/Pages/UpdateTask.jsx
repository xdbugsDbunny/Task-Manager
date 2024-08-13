import React, { useState, useEffect } from "react";
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
  Spinner,
  Flex,
  Heading,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdateTask = () => {
  const { taskId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const { data } = await axios.get(`/api/v1/task/${taskId}`);
        setTitle(data.data.title);
        setDescription(data.data.description);
        setSelectedDate(new Date(data.data.dueDate));
        setPriority(data.data.priority);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching task details:", error);
        toast({
          title: "Error fetching task details.",
          description: error.response?.data?.message || "Something went wrong.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId, toast]);

  const handleNavigate = () => {
    navigate("/home");
  };

  const handleUpdate = async () => {
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
      const updatedTask = {
        title,
        description,
        dueDate: selectedDate,
        priority,
        status: "PENDING",
      };

      await axios.put(`/api/v1/task/${taskId}`, updatedTask);

      toast({
        title: "Task updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error updating task.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
      </Container>
    );
  }

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
          Update Task
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
            onClick={handleUpdate}
          >
            Update
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

export default UpdateTask;
