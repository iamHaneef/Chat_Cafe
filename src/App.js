import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import './style.scss';
import { AuthContext } from "./context/AuthContext";

function Apps() {
  const { currentUser } = useContext(AuthContext);
  
  const ProtectedRoute = ({ element }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return element;
  };
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Apps;
