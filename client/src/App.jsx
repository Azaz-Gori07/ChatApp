import React from "react";
import "./App.css";
import RoutesList from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <RoutesList />
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;