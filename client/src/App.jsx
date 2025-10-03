import { useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import FlightScheduler from "./pages/FlightScheduler";
("./pages/FlightScheduler");
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import PlannerPage from "./pages/PlannerPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="planner" element={<PlannerPage />} />
          <Route path="scheduler" element={<FlightScheduler />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
