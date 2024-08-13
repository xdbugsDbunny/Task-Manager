import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./Components/Navbar";
import Authentication from "./Pages/Authentication";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import ProtectedRoute from "./Components/ProtectedRoutes";
import PublicRoutes from "./Components/PublicRoutes";
import Home from "./Pages/Home";
import CreateTask from "./Pages/CreateTask";
import UpdateTask from "./Pages/UpdateTask";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  
  axios.defaults.baseURL = "https://task-manager-swart-pi.vercel.app";
  axios.defaults.withCredentials = true;

  return (
    <BrowserRouter>
      {loading && (
        <div className="spinner-parent">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route
          path="/auth"
          element={
            <PublicRoutes>
              <Authentication />
            </PublicRoutes>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-task"
          element={
            <ProtectedRoute>
              <CreateTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-task/:taskId"
          element={
            <ProtectedRoute>
              <UpdateTask />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
