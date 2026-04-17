import React from "react";

export default function AdminDashboard({ vehicles }) {
    return (
        <div className="card">
            <h2>Admin Dashboard</h2>
            <p>Total Registered Vehicles: <b>{vehicles.length}</b></p>
            <p>Fraud Alerts: 0</p>
            <p>Active Vehicles: {vehicles.length}</p>
        </div>
    );
}
