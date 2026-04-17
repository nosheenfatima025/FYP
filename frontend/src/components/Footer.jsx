import React from "react";

export default function Footer() {
    return (
        <footer style={styles.footer}>
            <p>© 2025 Smart Parking System | FYP Project</p>
        </footer>
    );
}

const styles = {
    footer: {
        background: "#0f172a",
        color: "white",
        padding: "10px",
        textAlign: "center",
        marginTop: "40px",
    },
};
