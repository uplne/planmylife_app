import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from '../Header';

import './App.css';

export const PrivateRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // navigate("/login");
  }, []);

  return (
    <>
    My Week
    </>
  );
};