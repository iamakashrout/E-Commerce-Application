'use client'

export default function HelpButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            style={{
                position: "fixed",
                bottom: 20,
                right: 20,
                width: 84,
                height: 40, // Added height to ensure proper centering
                padding: "10px 20px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                display: "flex", // Flexbox for centering
                justifyContent: "center", // Center horizontally
                alignItems: "center", // Center vertically
                textAlign: "center", // Text alignment
            }}
            onClick={onClick}
        >
            Helpline
        </button>
    )
}
