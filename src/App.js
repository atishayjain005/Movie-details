import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<main className="container py-4"><h1>Page not found</h1><Link to="/">Browse movies</Link></main>} />
      </Routes>
    </div>
  );
}

export default App;
