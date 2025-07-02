'use client'

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const HomePage = () => {
  const { data: agents, isLoading } = useQuery({
    queryKey: ['agents'], queryFn: () => {
      return fetch('https://agents-api.doodles.app/agents')
        .then((res) => res.json())
        .then((data) => data);
    }
  })

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[var(--background)] mt-16 relative overflow-visible" style={{ fontFamily: 'Tahoma, Geneva, Verdana, sans-serif' }}>
      {/* Left fly (buddy list, different height) */}
      <img
        src="/images/fly.png"
        alt="fly"
        className="pointer-events-none select-none opacity-80 absolute -left-30 top-[3rem] w-16 h-16 z-50"
        aria-hidden="true"
      />
      {/* Right fly (buddy list, different height) */}
      <img
        src="/images/fly.png"
        alt="fly"
        className="pointer-events-none select-none opacity-80 absolute -right-25 top-[8rem] w-16 h-16 z-50 -scale-x-100"
        aria-hidden="true"
      />
      {/* Buddy list container */}
      <div className="w-full max-w-2xl bg-[var(--card)] border-4 border-[var(--border)] rounded-t-2xl rounded-b-2xl shadow-2xl overflow-hidden pt-8 pb-4">
        {agents?.agents.map((agent: { id: string; name: string; description: string; avatar: string }) => (
          <Link href={`/agents/${agent.id}/chat`} key={agent.id} className="no-underline">
            <div className="flex items-center gap-3 p-6 border-b-4 border-[var(--border)] last:border-b-0 hover:bg-[var(--background)] cursor-pointer transition-colors">
              {/* Avatar with poopie hat */}
              <div className="relative w-24 h-24 mr-3 flex-shrink-0">
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
                <span className="inline-block w-4 h-4 rounded-full bg-green-400 border-2 border-white shadow" title="Online"></span>
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">{agent.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
