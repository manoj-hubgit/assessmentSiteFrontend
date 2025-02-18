import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => !!localStorage.getItem("Token")); // Initialize user state

  useEffect(() => {
    const token = localStorage.getItem("Token");
    setUser(!!token); 
  }, []);

  const login = (token) => {
    localStorage.setItem("Token", token);
    setUser(true);
  };

  const logout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("isAdmin");
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);

