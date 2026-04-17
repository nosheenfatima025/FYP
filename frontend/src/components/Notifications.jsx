import React from "react";

export default function Notifications({ notifications }) {
    return (
        <div className="card">
            <h2>Notifications</h2>
            <ul>
                {notifications.map((n, i) => (
                    <li key={i}>{n}</li>
                ))}
            </ul>
        </div>
    );
};
