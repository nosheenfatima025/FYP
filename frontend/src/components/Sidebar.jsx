import React from "react";
import { NavLink } from "react-router-dom";

const links = [
    { path: "/dashboard", icon: "🏠", label: "Dashboard" },
    { path: "/register-vehicle", icon: "➕", label: "Register Vehicle" },
    { path: "/vehicles", icon: "🚗", label: "Vehicles" },
    { path: "/logs", icon: "📊", label: "Entry / Exit Logs" },
    { path: "/billing", icon: "💳", label: "Wallet & Billing" },
    { path: "/fraud-alerts", icon: "⚠️", label: "Fraud Alerts" },
    { path: "/reports", icon: "📁", label: "Reports" },
    { path: "/parking-rates", icon: "⚙️", label: "Parking Rates" },
];

export default function Sidebar() {
    return (
        <div style={{
            width: "220px", background: "white", minHeight: "100vh",
            padding: "16px 8px", boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
            position: "fixed", top: 0, left: 0
        }}>
            <div style={{
                fontSize: "22px", fontWeight: "700",
                color: "#00897b", padding: "12px 16px", marginBottom: "8px"
            }}>
                Parkify
            </div>
            {links.map(link => (
                <NavLink key={link.path} to={link.path} style={({ isActive }) => ({
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "11px 16px", borderRadius: "8px", margin: "2px 0",
                    textDecoration: "none", fontSize: "14px", fontWeight: "500",
                    background: isActive ? "#00897b" : "transparent",
                    color: isActive ? "white" : "#444",
                })}>
                    <span>{link.icon}</span>{link.label}
                </NavLink>
            ))}
        </div>
    );
}