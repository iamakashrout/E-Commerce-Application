"use client";
import { useChat } from "@ai-sdk/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef } from "react";

export default function HelpChat({ onClose }: { onClose: () => void }) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
    error,
  } = useChat({ api: "/api/gemini" });
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Automatically scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-5 right-5 w-[350px] p-5 bg-custom-lighter-teal text-black shadow-lg rounded-lg z-50 font-sans border border-gray-300">
      <div className="flex justify-between items-center mb-3">
        <h2 className="m-0 text-lg font-bold">Helpline</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          ✕
        </button>
      </div>
      <div className="max-h-[300px] overflow-y-auto mb-3 pr-1">
        {messages?.length === 0 && (
          <p className="text-black">Please ask your queries here!</p>
        )}
        {messages?.map((message, index) => (
          <div
            key={index}
            className={`flex mb-2 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-[75%] ${
                message.role === "user"
                  ? "bg-custom-yellow text-black"
                  : "bg-custom-background text-black"
              }`}
            >
              <Markdown
                children={message.content}
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inLine, className, children, ...props }) {
                    return inLine ? (
                      <code
                        {...props}
                        className="bg-gray-200 px-1 py-0.5 rounded-md"
                      >
                        {children}
                      </code>
                    ) : (
                      <pre
                        {...props}
                        className="bg-gray-200 p-2 rounded-md"
                      >
                        <code>{children}</code>
                      </pre>
                    );
                  },
                  ul: ({ children }) => (
                    <ul className="pl-5 list-disc">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="pl-5 list-decimal">{children}</ol>
                  ),
                }}
              />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-center mt-2">
            <p>Loading...</p>
            <button
              type="button"
              onClick={() => stop()}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 font-bold"
            >
              Stop
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex flex-col gap-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="w-full h-20 p-2 rounded-md border border-gray-300 resize-none focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-custom-pink text-white rounded-md hover:bg-custom-lavender disabled:bg-gray-400 font-bold"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Ask"}
          </button>
        </form>
        {error && (
          <div className="text-center text-red-500 mt-2">
            <p>Error</p>
            <button
              type="button"
              onClick={() => reload()}
              className="mt-2 bg-yellow-400 text-black px-3 py-1 rounded-md hover:bg-yellow-500"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
