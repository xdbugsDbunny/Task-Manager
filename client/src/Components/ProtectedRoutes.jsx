import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import "../App.css";
import { setUser } from "../Redux/userReducer";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const response = await axios.post(
        `https://task-manager-iyykoxpat-xdbugsdbunnys-projects.vercel.app/api/v1/user/get-user`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(setUser(response.data.data));
      } else {
        navigate("/auth");
      }
    } catch (error) {
      navigate("/auth");
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          `https://task-manager-iyykoxpat-xdbugsdbunnys-projects.vercel.app/api/v1/user/check-auth`,
          {},
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="spinner-parent">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
