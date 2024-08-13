import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  VStack,
  Heading,
  Box,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, CheckIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../Redux/alertReducer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: "dueDate",
    direction: "asc",
  });

  useEffect(() => {
    const getAllTasks = async () => {
      dispatch(showLoading());
      try {
        const response = await axios.get("/api/v1/task/");

        setTasks(response.data.data);
        dispatch(hideLoading());
        if (response.data.data.length === 0) {
          toast.success("No tasks found.");
        }

        toast.success("Task Fetched Successfully");
      } catch (error) {
        dispatch(hideLoading());
        toast.error("Error fetching tasks.");
        console.error("Error fetching tasks:", error);
      }
    };

    getAllTasks();
  }, [dispatch]);

  const handleEdit = (taskId) => {
    navigate(`/update-task/${taskId}`);
  };

  const handleDelete = async (taskId) => {
    dispatch(showLoading());
    try {
      await axios.delete(`/api/v1/task/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      dispatch(hideLoading());
      toast.success("Task deleted successfully.");
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error deleting task.");
      console.error("Error deleting task:", error);
    }
  };

  const handleChangeStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "PENDING" ? "COMPLETED" : "PENDING";
    const checkStatuses = ["PENDING", "COMPLETED"];

    if (!checkStatuses.includes(newStatus)) {
      toast.error("Invalid status change attempted.");
      return;
    }

    dispatch(showLoading());
    try {
      const response = await axios.patch(`/api/v1/task/${taskId}/status`, {
        status: newStatus,
      });

      if (response.data.success) {
        setTasks(
          tasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
        toast.success(response.data.message);
      } else {
        toast.error("Failed to change task status.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedTasks = tasks.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  return tasks.length === 0 ? (
    <VStack>
      <Heading as="h1" size="lg" mt={4}>
        No tasks found.
      </Heading>
    </VStack>
  ) : (
    <Table variant="simple">
      <Thead cursor="pointer">
        <Tr>
          <Th onClick={() => handleSort("title")}>
            Title{" "}
            {sortConfig.key === "title" &&
              (sortConfig.direction === "asc" ? "▲" : "▼")}
          </Th>
          <Th onClick={() => handleSort("description")}>
            Description{" "}
            {sortConfig.key === "description" &&
              (sortConfig.direction === "asc" ? "▲" : "▼")}
          </Th>
          <Th onClick={() => handleSort("dueDate")}>
            Due Date{" "}
            {sortConfig.key === "dueDate" &&
              (sortConfig.direction === "asc" ? "▲" : "▼")}
          </Th>
          <Th onClick={() => handleSort("status")}>
            Status{" "}
            {sortConfig.key === "status" &&
              (sortConfig.direction === "asc" ? "▲" : "▼")}
          </Th>
          <Th onClick={() => handleSort("priority")}>
            Priority{" "}
            {sortConfig.key === "priority" &&
              (sortConfig.direction === "asc" ? "▲" : "▼")}
          </Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {sortedTasks.map((task) => (
          <Tr key={task._id}>
            <Td>{task.title}</Td>
            <Td>{task.description}</Td>
            <Td>{new Date(task.dueDate).toLocaleDateString()}</Td>
            <Td>
              <Box
                bg={
                  task.status === "PENDING"
                    ? "yellow.400"
                    : task.status === "COMPLETED"
                    ? "green.400"
                    : "gray.400"
                }
                p={2}
                borderRadius={10}
                textAlign="center"
                color={"gray.dark"}
              >
                {task.status}
              </Box>
            </Td>
            <Td>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap="2"
              >
                <Box
                  as="span"
                  display="inline-block"
                  w="8px"
                  h="8px"
                  borderRadius="50%"
                  bg={
                    task.priority === "low"
                      ? "green.400"
                      : task.priority === "medium"
                      ? "yellow.400"
                      : "red.400"
                  }
                />
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Box>
            </Td>
            <Td>
              <IconButton
                icon={<EditIcon />}
                onClick={() => handleEdit(task._id)}
                mr={2}
                aria-label="Edit task"
                bg={"yellow.400"}
                color={'gray.dark'}
              />
              <IconButton
                icon={<DeleteIcon />}
                onClick={() => handleDelete(task._id)}
                mr={2}
                aria-label="Delete task"
                bg={"red.400"}
                color={'gray.dark'}
              />
              <Button
                leftIcon={<CheckIcon />}
                onClick={() => handleChangeStatus(task._id, task.status)}
                colorScheme={task.status === "COMPLETED" ? "green" : "blue"}
                size="sm"
              >
                {task.status === "COMPLETED"
                  ? "Mark as PENDING"
                  : "Mark as COMPLETED"}
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default Home;
