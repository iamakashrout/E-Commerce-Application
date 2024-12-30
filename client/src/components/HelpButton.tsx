'use client'

export default function HelpButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            style={{
                position: "fixed",
                bottom: 20,
                right: 20,
                padding: "10px 20px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
            }}
            onClick={onClick}
        > Helpline</button>
    )
}