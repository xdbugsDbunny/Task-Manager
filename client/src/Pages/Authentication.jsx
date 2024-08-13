import {
  Box,
  Card,
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import Login from "../Components/Login";
import Register from "../Components/Register";

const Authentication = () => {
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
          Welcome To Task Manager
        </Text>
      </Box>
      <Box
        bg={"gray.dark"}
        w="100%"
        p={4}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab color={"gray.100"} w="50%">
              Login
            </Tab>
            <Tab color={"gray.100"} w="50%">
              Register
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Authentication;
