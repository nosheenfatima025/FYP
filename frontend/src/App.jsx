import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import RegisterVehicle from "./pages/RegisterVehicle";
import EntryExitLogs from "./pages/EntryExitLogs";
import WalletBilling from "./pages/WalletBilling";
import FraudAlerts from "./pages/FraudAlerts";
import Reports from "./pages/Reports";
import ParkingRates from "./pages/ParkingRates";

// Layout
import Sidebar from "./components/Sidebar";

function WithSidebar({ children }) {
  return (
    <div style={{
      display: "flex",
      width: "100vw",
      minHeight: "100vh"
    }}>
      <div style={{
        width: "220px",
        flexShrink: 0
      }}>
        <Sidebar />
      </div>
      <main style={{
        flexGrow: 1,
        padding: "24px",
        background: "#f0f4f8",
        minHeight: "100vh",
        overflow: "auto"
      }}>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<WithSidebar><Dashboard /></WithSidebar>} />
        <Route path="/vehicles" element={<WithSidebar><Vehicles /></WithSidebar>} />
        <Route path="/register-vehicle" element={<WithSidebar><RegisterVehicle /></WithSidebar>} />
        <Route path="/logs" element={<WithSidebar><EntryExitLogs /></WithSidebar>} />
        <Route path="/billing" element={<WithSidebar><WalletBilling /></WithSidebar>} />
        <Route path="/fraud-alerts" element={<WithSidebar><FraudAlerts /></WithSidebar>} />
        <Route path="/reports" element={<WithSidebar><Reports /></WithSidebar>} />
        <Route path="/parking-rates" element={<WithSidebar><ParkingRates /></WithSidebar>} />
      </Routes>
    </Router>
  );
}

export default App;