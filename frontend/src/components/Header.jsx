import React from "react";

export default function Header() {
    return (
        <header style={styles.header}>
            <h1>E-Parking Management System</h1>
        </header>
    );
}

const styles = {
    header: {
        background: "#0f172a",
        color: "white",
        padding: "15px",
        textAlign: "center",
    },
};
