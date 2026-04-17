import React from "react";
import VehicleForm from "../components/VehicleForm";
import VehicleTable from "../components/VehicleTable";

export default function Home({ vehicles, onRegister }) {
    return (
        <div>
            <h2>Welcome to Smart Parking System</h2>
            <VehicleForm onRegister={onRegister} />
            <VehicleTable vehicles={vehicles} />
        </div>
    );
}
