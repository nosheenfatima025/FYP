import React, { useState } from "react";

export default function ParkingManagementSystem() {
    const [vehicles, setVehicles] = useState([]);
    const [form, setForm] = useState({
        plate: "",
        owner: "",
        contact: "",
        wallet: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const registerVehicle = () => {
        if (!form.plate || !form.owner) return alert("Required fields missing");

        setVehicles([
            ...vehicles,
            {
                ...form,
                qr: "QR-" + Math.floor(Math.random() * 100000),
                status: "Outside",
            },
        ]);

        setForm({ plate: "", owner: "", contact: "", wallet: "" });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center mb-6">
                Smart Parking Management System
            </h1>

            {/* Vehicle Registration */}
            <div className="bg-white p-6 rounded-2xl shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">Vehicle Registration</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        className="border p-2 rounded"
                        placeholder="Number Plate"
                        name="plate"
                        value={form.plate}
                        onChange={handleChange}
                    />
                    <input
                        className="border p-2 rounded"
                        placeholder="Owner Name"
                        name="owner"
                        value={form.owner}
                        onChange={handleChange}
                    />
                    <input
                        className="border p-2 rounded"
                        placeholder="Contact Number"
                        name="contact"
                        value={form.contact}
                        onChange={handleChange}
                    />
                    <input
                        className="border p-2 rounded"
                        placeholder="Wallet Balance"
                        name="wallet"
                        value={form.wallet}
                        onChange={handleChange}
                    />
                </div>
                <button
                    onClick={registerVehicle}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Register Vehicle
                </button>
            </div>

            {/* Registered Vehicles */}
            <div className="bg-white p-6 rounded-2xl shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">Registered Vehicles</h2>
                <table className="w-full border">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border p-2">Plate</th>
                            <th className="border p-2">Owner</th>
                            <th className="border p-2">Wallet</th>
                            <th className="border p-2">QR Code</th>
                            <th className="border p-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((v, i) => (
                            <tr key={i}>
                                <td className="border p-2">{v.plate}</td>
                                <td className="border p-2">{v.owner}</td>
                                <td className="border p-2">{v.wallet}</td>
                                <td className="border p-2">{v.qr}</td>
                                <td className="border p-2">{v.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Admin Dashboard */}
            <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
                <ul className="list-disc ml-6 text-gray-700">
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
