import React from "react";

export default function VehicleTable({ vehicles }) {
    return (
        <div className="card">
            <h2>Registered Vehicles</h2>
            <table width="100%">
                <thead>
                    <tr>
                        <th>Plate</th>
                        <th>Owner</th>
                        <th>Wallet</th>
                        <th>QR Code</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.map((v, i) => (
                        <tr key={i}>
                            <td>{v.plate}</td>
                            <td>{v.owner}</td>
                            <td>{v.wallet}</td>
                            <td>{v.qr}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
