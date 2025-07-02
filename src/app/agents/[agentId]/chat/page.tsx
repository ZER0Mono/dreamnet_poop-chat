"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const AgentChatPage = () => {
    const params = useParams();
    const agentId = params?.agentId as string | undefined;
    const [messages, setMessages] = useState<{ text: string; user: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { data: agent, isLoading: agentLoading, error } = useQuery({
        queryKey: ['agent', agentId],
        queryFn: async () => {
            if (!agentId) throw new Error('No agent ID provided');
            const res = await fetch(`https://agents-api.doodles.app/agents/${agentId}`);
            if (!res.ok) throw new Error('Failed to fetch agent');
            const data = await res.json();
            return { name: data.name, avatar: data.avatar };
        },
        enabled: !!agentId,
    });

    const sendMessage = async () => {
        if (!input.trim() || !agentId) return;
        setLoading(true);
        const userMessage = { text: input, user: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        try {
            const res = await fetch(`https://agents-api.doodles.app/${agentId}/user/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-mini-app-id": "your-app-id", // Replace with your actual app ID
                    "x-mini-app-secret": "your-app-secret", // Replace with your actual app secret
                },
                body: JSON.stringify({ text: userMessage.text, user: userMessage.user }),
            });
            const data = await res.json();
            // Handle array response - extract the first message
            const agentMessage = Array.isArray(data) ? data[0] : data;
            setMessages((prev) => [...prev, { text: agentMessage.text, user: "agent" }]);
        } catch {
            setMessages((prev) => [...prev, { text: "Error sending message.", user: "system" }]);
        } finally {
            setLoading(false);
        }
    };

    if (agentLoading) {
        return <div className="flex flex-col items-center p-8">Loading agent...</div>;
    }

    if (error || !agent) {
        return <div className="flex flex-col items-center p-8 text-red-600">Agent not found.</div>;
    }

    return (
        <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
            {/* Fly background image */}
            <img 
                src="/fly.png" 
                alt="fly" 
                className="pointer-events-none select-none opacity-60 absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 z-0"
                aria-hidden="true"
            />
            <button
                className="mb-4 ml-4 flex items-center gap-1 text-[var(--primary-foreground)] hover:underline text-sm font-bold px-2 py-1 rounded transition-colors bg-[var(--primary)] shadow"
                onClick={() => router.push("/")}
                type="button"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 inline-block"><path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L4.414 8H17a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                Back
            </button>
            <div className="flex flex-col max-w-2xl mx-auto p-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl relative z-10" style={{ fontFamily: 'Tahoma, Geneva, Verdana, sans-serif' }}>
                <div className="flex items-center mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-xl mr-3 border-2 border-[var(--accent)] bg-[var(--background)]" />
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-[var(--foreground)] leading-tight">{agent.name}</h2>
                            <span className="inline-block w-3 h-3 rounded-full bg-green-400 border-2 border-white shadow" title="Online"></span>
                        </div>
                        <div className="text-xs text-[var(--muted-foreground)]">Instant Message</div>
                    </div>
                </div>
                <div className="flex-1 mb-3 rounded-2xl bg-[var(--background)] p-3 min-h-[32rem] max-h-[40rem] overflow-y-auto flex flex-col gap-2" style={{ fontSize: '15px' }}>
                    {messages.length === 0 && (
                        <div className="text-center text-[var(--muted-foreground)] text-sm mt-8">Start chatting with {agent.name}!</div>
                    )}
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.user === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`rounded-2xl px-4 py-2 max-w-[75%] shadow 
                                    ${msg.user === "user"
                                        ? "bg-[var(--accent)] text-[var(--accent-foreground)] rounded-br-sm"
                                        : msg.user === "agent"
                                            ? "bg-[var(--secondary)] text-[var(--secondary-foreground)] rounded-bl-sm"
                                            : "bg-[var(--muted)] text-[var(--muted-foreground)]"}
                                `}
                                style={{ wordBreak: 'break-word' }}
                            >
                                <span className="block text-xs font-bold mb-1">
                                    {msg.user === "user" ? "You" : msg.user === "agent" ? agent.name : "System"}
                                </span>
                                <span>{msg.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-end gap-2 border-t border-[var(--border)] pt-2 bg-[var(--card)] rounded-b-2xl">
                    <input
                        className="flex-1 border border-[var(--border)] rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--primary)] bg-[var(--background)] placeholder:text-[var(--muted-foreground)] text-[var(--foreground)]"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type your message..."
                        disabled={loading}
                        style={{ fontFamily: 'Tahoma, Geneva, Verdana, sans-serif' }}
                    />
                    <button
                        className="bg-[var(--primary)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] text-[var(--primary-foreground)] px-4 py-2 rounded-2xl border border-[var(--border)] font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow"
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        style={{ fontFamily: 'Tahoma, Geneva, Verdana, sans-serif', letterSpacing: '1px' }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentChatPage; 