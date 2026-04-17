import React, { useState } from "react";
import "./ParkingManagementSystem.css";

export default function ParkingManagementSystem() {
    const [vehicles, setVehicles] = useState([]);
    const [form, setForm] = useState({
        plate: "",
        owner: "",
        contact: "",
        wallet: "",
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const registerVehicle = () => {
        if (!form.plate || !form.owner) return alert("Required fields missing");
        setVehicles([
            ...vehicles,
            { ...form, qr: "QR-" + Math.floor(Math.random() * 100000), status: "Outside" },
        ]);
        setForm({ plate: "", owner: "", contact: "", wallet: "" });
    };

    return (
        <div className="pms-container">
            <h1 className="pms-title">Smart Parking Management System</h1>

            {/* Vehicle Registration */}
            <div className="pms-section">
                <h2>Vehicle Registration</h2>
                <div className="pms-form">
                    <input placeholder="Number Plate" name="plate" value={form.plate} onChange={handleChange} />
                    <input placeholder="Owner Name" name="owner" value={form.owner} onChange={handleChange} />
                    <input placeholder="Contact Number" name="contact" value={form.contact} onChange={handleChange} />
                    <input placeholder="Wallet Balance" name="wallet" value={form.wallet} onChange={handleChange} />
                </div>
                <button onClick={registerVehicle}>Register Vehicle</button>
            </div>

            {/* Registered Vehicles */}
            <div className="pms-section">
                <h2>Registered Vehicles</h2>
                <table className="pms-table">
                    <thead>
                        <tr>
                            <th>Plate</th>
                            <th>Owner</th>
                            <th>Wallet</th>
                            <th>QR Code</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((v, i) => (
                            <tr key={i}>
                                <td>{v.plate}</td>
                                <td>{v.owner}</td>
                                <td>{v.wallet}</td>
                                <td>{v.qr}</td>
                                <td>{v.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Admin Dashboard */}
            <div className="pms-section">
                <h2>Admin Dashboard</h2>
                <ul className="pms-admin-list">
                    <li>View Entry / Exit Logs</li>
                    <li>Monitor Wallet Balances</li>
                    <li>Fraud Detection Alerts</li>
                    <li>Generate Reports (Daily / Monthly)</li>
                    <li>Manage Parking Rates</li>
                </ul>
            </div>
        </div>
    );
}
