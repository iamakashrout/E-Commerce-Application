import { useChat } from "@ai-sdk/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef } from "react";

export default function HelpChat({ onClose }: { onClose: () => void }) {

    const {messages, input, handleInputChange, handleSubmit, isLoading, stop, reload, error} =useChat({api: "/api/gemini"});
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    // Automatically scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: "350px",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            color: "black",
            boxShadow: "0 6px 10px rgba(0, 0, 0, 0.15)",
            borderRadius: "10px",
            zIndex: 1000,
            fontFamily: "Arial, sans-serif",
            border: "1px solid #ddd"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h2 style={{ margin: 0, fontSize: "18px" }}>Helpline</h2>
                <button onClick={onClose} style={{
                    cursor: "pointer",
                    background: "transparent",
                    border: "none",
                    fontSize: "16px",
                    color: "#999"
                }}>✕</button>
            </div>
            <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "10px", paddingRight: "5px" }}>
                {messages?.length === 0 && (
                    <p style={{ color: "#666" }}>Please ask your queries here!</p>
                )}
                {messages?.map((message, index)=> (
                    <div key={index} style={{
                        display: "flex",
                        justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: "10px"
                    }}>
                        <div style={{
                            backgroundColor: message.role === 'user' ? "#007BFF" : "#f4f4f4",
                            color: message.role === 'user' ? "white" : "black",
                            padding: "10px",
                            borderRadius: "10px",
                            maxWidth: "75%"
                        }}>
                            <Markdown 
                            children={message.content}
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({node, inLine, className, children, ...props}){
                                    return inLine ? (
                                        <code {...props} style={{ background: "#f4f4f4", padding: "2px 4px", borderRadius: "4px" }}>{children}</code>
                                    ) : (
                                        <pre {...props} style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}><code>{children}</code></pre>
                                    )
                                },
                                ul: ({children}) => (
                                    <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>{children}</ul>
                                ),
                                ol: ({children}) => (
                                    <ol style={{ paddingLeft: "20px", listStyleType: "decimal" }}>{children}</ol>
                                )
                            }}
                            />
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <p>Loading...</p>
                        <button type="button" onClick={()=>stop()} style={{ cursor: "pointer", backgroundColor: "#dc3545", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px" }}>Stop</button>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <textarea
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type your message here..."
                        style={{
                            width: "100%",
                            height: "80px",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            resize: "none"
                        }}
                    />
                    <button type="submit" style={{
                        padding: "10px 20px",
                        backgroundColor: "#007BFF",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }} disabled={isLoading}>
                        {isLoading ? "Loading..." : "Ask"}
                    </button>
                </form>
                {error && (
                    <div style={{ textAlign: "center", color: "red", marginTop: "10px" }}>
                        <p>Error</p>
                        <button type="button" onClick={()=>reload()} style={{
                            cursor: "pointer",
                            backgroundColor: "#ffc107",
                            color: "black",
                            padding: "5px 10px",
                            border: "none",
                            borderRadius: "5px"
                        }}>Retry</button>
                    </div>
                )}
            </div>
        </div>
    );
}
