// src/components/ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation(); 

  const isAuthenticated = !!user; 

  if (!isAuthenticated) {
    console.log('ProtectedRoute: User not authenticated. Redirecting to login.');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;