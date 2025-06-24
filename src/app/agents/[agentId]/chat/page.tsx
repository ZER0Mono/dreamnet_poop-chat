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
        <div>
            <button
                className="mb-4 ml-4 flex items-center gap-1 text-white hover:underline text-sm font-bold px-2 py-1 rounded transition-colors"
                onClick={() => router.push("/")}
                type="button"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 inline-block"><path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L4.414 8H17a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                Back
            </button>
            <div className="flex flex-col max-w-md mx-auto p-4 bg-white border border-gray-300 rounded shadow-md" style={{ fontFamily: 'Tahoma, Geneva, Verdana, sans-serif' }}>
                <div className="flex items-center mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-lg mr-3 border border-blue-300" />
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-gray-800 leading-tight">{agent.name}</h2>
                            <span className="inline-block w-3 h-3 rounded-full bg-green-500 border border-white shadow" title="Online"></span>
                        </div>
                        <div className="text-xs text-gray-500">Instant Message</div>
                    </div>
                </div>
                <div className="flex-1 mb-3 border border-gray-300 rounded bg-white p-3 min-h-64 max-h-80 overflow-y-auto" style={{ fontSize: '15px' }}>
                    {messages.length === 0 && (
                        <div className="text-center text-gray-400 text-sm mt-8">Start chatting with {agent.name}!</div>
                    )}
                    {messages.map((msg, idx) => (
                        <div key={idx} className="mb-1 text-left">
                            <span className={
                                msg.user === "user"
                                    ? "font-bold text-blue-700"
                                    : msg.user === "agent"
                                        ? "font-bold text-red-600"
                                        : "font-bold text-green-600"
                            }>
                                {msg.user === "user" ? "You" : msg.user === "agent" ? agent.name : "System"}
                            </span>
                            <span className="font-bold text-black">: </span>
                            <span className="text-black">{msg.text}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-end gap-2 border-t border-gray-200 pt-2 bg-gray-50 rounded-b">
                    <input
                        className="flex-1 border border-gray-400 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white placeholder:text-black text-black"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type your message..."
                        disabled={loading}
                        style={{ fontFamily: 'Tahoma, Geneva, Verdana, sans-serif' }}
                    />
                    <button
                        className="bg-gray-200 hover:bg-blue-400 hover:text-white text-gray-700 px-4 py-2 rounded border border-gray-400 font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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