import React, { useState } from "react";

export default function VehicleForm({ onRegister }) {
    const [form, setForm] = useState({
        plate: "",
        owner: "",
        contact: "",
        wallet: "",
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = () => {
        if (!form.plate || !form.owner) {
            alert("Plate & Owner required");
            return;
        }

        const vehicle = {
            ...form,
            qr: "QR" + Math.floor(Math.random() * 100000),
            entryTime: null,
        };

        onRegister(vehicle);
        setForm({ plate: "", owner: "", contact: "", wallet: "" });
    };

    return (
        <div className="card">
            <h2>Vehicle Registration</h2>
            <input name="plate" placeholder="Number Plate" value={form.plate} onChange={handleChange} />
            <input name="owner" placeholder="Owner Name" value={form.owner} onChange={handleChange} />
            <input name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} />
            <input name="wallet" placeholder="Wallet Balance" value={form.wallet} onChange={handleChange} />
            <button onClick={handleSubmit}>Register</button>
        </div>
    );
}
