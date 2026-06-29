import { useState, useRef, useEffect } from "react";
import { IoChatbubbleEllipsesOutline, IoClose, IoSend } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import api from "../../api/api.js";

const Chat = () => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", text: "👋 Hi! I'm your shop support assistant. How can I help you today?" },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const allowedPaths = ["/products", "/profile/orders"];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    if (!user || !user.id || !allowedPaths.includes(location.pathname)) return null;

    const sendMessage = async () => {
        const text = input.trim();
        if (!text) return;

        const userMsg = { role: "user", text };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const { data } = await api.post("/chat", { message: text });
            setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "bot", text: "Sorry, something went wrong. Please try again." },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-slate-800 hover:bg-slate-900 text-white rounded-full shadow-xl shadow-slate-800/30 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                    <IoChatbubbleEllipsesOutline size={26} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 py-4 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-white font-semibold text-[15px]">
                                Shop Assistant
                            </span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-300 hover:text-white transition-colors duration-200"
                        >
                            <IoClose size={22} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed rounded-2xl ${
                                    msg.role === "user"
                                        ? "bg-slate-800 text-white self-end ml-auto rounded-br-md"
                                        : "bg-white text-slate-700 border border-gray-200 self-start mr-auto rounded-bl-md"
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="max-w-[80%] px-4 py-2.5 text-sm text-slate-400 italic bg-white border border-gray-200 rounded-2xl rounded-bl-md mr-auto">
                                Typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="px-4 py-3 border-t border-gray-200 bg-white flex items-center gap-2 shrink-0">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-full outline-none focus:border-slate-400 transition-colors duration-200 bg-gray-50"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || isTyping}
                            className="w-10 h-10 bg-slate-800 hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        >
                            <IoSend size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chat;
