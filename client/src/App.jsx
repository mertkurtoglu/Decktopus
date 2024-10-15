import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./index.css";

import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Container fluid style={{ height: "100vh" }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Container>
  );
}

export default App;
