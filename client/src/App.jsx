import { useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import FlightScheduler from "./pages/FlightScheduler";
("./pages/FlightScheduler");
import TestScheduler from "./pages/TestScheduler";
import CasePage from "./pages/CasePage";
import CasePageCopy from "./pages/CasePage copy";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import PlannerPage from "./pages/PlannerPage";
import Map from "./pages/Map";

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
          <Route path="test-scheduler" element={<TestScheduler />} />
          <Route path="case" element={<CasePage />} />
          <Route path="case-copy" element={<CasePageCopy />} />
          <Route path="map" element={<Map />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
