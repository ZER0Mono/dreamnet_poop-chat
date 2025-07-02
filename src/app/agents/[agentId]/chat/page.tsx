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
            {/* Back button above chat window */}
            <button
                className="mb-4 ml-4 mt-5 flex items-center gap-1 text-[var(--primary-foreground)] hover:underline text-sm font-bold px-2 py-1 rounded transition-colors bg-[var(--primary)] shadow"
                onClick={() => router.push("/")}
                type="button"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 inline-block"><path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L4.414 8H17a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                Back
            </button>
            <div className="flex flex-col max-w-2xl mx-auto p-4 pt-8 bg-[var(--card)] border-4 border-[var(--border)] rounded-2xl shadow-2xl relative z-10">
                {/* Left fly (already present) */}
                <img
                    src="/images/fly.png"
                    alt="fly"
                    className="pointer-events-none select-none opacity-80 absolute -left-30 top-[5rem] w-16 h-16 z-20"
                    aria-hidden="true"
                />

                {/* Right fly (mirrored) */}
                <img
                    src="/images/fly.png"
                    alt="fly"
                    className="pointer-events-none select-none opacity-80 absolute -right-25 top-120 w-16 h-16 z-20 -scale-x-100"
                    aria-hidden="true"
                />
                <div className="flex items-center gap-3 mb-4">
                    {/* Avatar with poopie hat */}
                    <div className="relative w-24 h-24 mr-3">
                        {/* Poopie hat */}
                        <img
                            src="/images/poopie.png"
                            alt="poopie hat"
                            className="absolute left-1/2 -translate-x-1/2 -top-8 w-14 h-12 z-30 pointer-events-none select-none"
                            aria-hidden="true"
                        />
                        {/* Avatar */}
                        <img src={agent.avatar} alt={agent.name} className="w-24 h-24 rounded-full border-4 border-[var(--border)] bg-[var(--background)] relative z-20" />
                    </div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-[var(--foreground)] leading-tight" style={{ fontFamily: 'var(--font-brown)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{agent.name}</h2>
                        <span className="inline-block w-3 h-3 rounded-full bg-green-400 border-2 border-white shadow" title="Online"></span>
                    </div>
                </div>
                <div className="flex-1 mb-3 rounded-2xl bg-[var(--background)] p-3 min-h-[36rem] max-h-[44rem] overflow-y-auto flex flex-col gap-3 border-4 border-[var(--border)] shadow-inner" style={{ fontSize: '16px' }}>
                    {messages.length === 0 && (
                        <div className="text-center text-white text-sm mt-8">Start chatting with {agent.name}!</div>
                    )}
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.user === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`rounded-2xl px-5 py-3 max-w-[75%] shadow-lg border-4 font-bold 
                                    ${msg.user === "user"
                                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--border)]"
                                        : msg.user === "agent"
                                            ? "bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[var(--border)]"
                                            : "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]"}
                                `}
                                style={{ wordBreak: 'break-word' }}
                            >
                                <span className="block text-xs font-bold mb-1" style={{ fontFamily: 'var(--font-brown)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                    {msg.user === "user" ? "You" : msg.user === "agent" ? agent.name : "System"}
                                </span>
                                <span>{msg.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-stretch gap-2 pt-2 bg-[var(--card)] rounded-b-2xl">
                    <input
                        className="flex-1 border-4 border-[var(--border)] rounded-2xl px-3 h-12 text-sm focus:outline-none focus:border-[var(--primary)] bg-[var(--background)] placeholder:text-[var(--muted-foreground)] text-white"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type your message..."
                        disabled={loading}
                    />
                    <button
                        className="bg-[var(--primary)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] text-[var(--primary-foreground)] px-4 h-12 rounded-2xl border-4 border-[var(--border)] font-bold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2"
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        style={{ letterSpacing: '1px' }}
                    >
                        <span className="relative top-[1px] left-[1px]">Send</span>
                        <img
                            src="/images/poopie.png"
                            alt="poopie icon"
                            className="inline-block w-6 h-6 -mb-1 -mt-1"
                            aria-hidden="true"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentChatPage; 