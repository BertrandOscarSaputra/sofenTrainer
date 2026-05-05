"use client";

import { useState } from "react";

export default function ApiTester() {
  const [token, setToken] = useState("");
  const [url, setUrl] = useState("http://localhost:3535/api/users");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("{\n\n}");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activePreset, setActivePreset] = useState<number | null>(null);

  const presets = [
    { label: "1. Register", method: "POST", url: "http://localhost:3535/auth/register", body: '{\n  "name": "Test User",\n  "email": "test@example.com",\n  "password": "password123"\n}' },
    { label: "2. Login", method: "POST", url: "http://localhost:3535/auth/login", body: '{\n  "email": "test@example.com",\n  "password": "password123"\n}' },
    { label: "3. Get Users", method: "GET", url: "http://localhost:3535/api/users", body: "" },
    { label: "4. Get Trainers", method: "GET", url: "http://localhost:3535/api/trainers", body: "" },
    { label: "5. Get Bookings", method: "GET", url: "http://localhost:3535/api/bookings", body: "" },
    { label: "6. Create Booking", method: "POST", url: "http://localhost:3535/api/bookings", body: '{\n  "trainerId": 1,\n  "scheduleId": 1,\n  "notes": "Testing"\n}' },
    { label: "7. AI Recommendations", method: "GET", url: "http://localhost:3535/api/recommendations/1", body: "" },
    { label: "8. AI Chat Sync", method: "POST", url: "http://localhost:3535/api/recommendations/chat", body: '{\n  "userId": 1,\n  "message": "Pindahkan ke hari Jumat",\n  "currentSchedule": []\n}' },
  ];

  const handlePreset = (preset: any, index: number) => {
    setUrl(preset.url);
    setMethod(preset.method);
    setBody(preset.body);
    setActivePreset(index);
    setResponse(null);
  };

  const handleTest = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      if (method !== "GET" && method !== "DELETE") {
        options.body = body;
      }

      const res = await fetch(url, options);
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
        if (url.includes("/auth/login") && data.data?.token) {
          setToken(data.data.token);
        }
      } catch {
        data = text;
      }

      setResponse({ status: res.status, ok: res.ok, data });
    } catch (err: any) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const methodColors: Record<string, string> = {
    GET: "text-blue-400",
    POST: "text-green-400",
    PUT: "text-yellow-400",
    PATCH: "text-orange-400",
    DELETE: "text-red-400",
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-300 font-sans p-6 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-3rem)]">
        
        {/* Header */}
        <header className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <span className="text-indigo-400 font-bold text-xl">⚡</span>
            </div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">SofenTrainer API Tester</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500">Global JWT Auth:</span>
            <input 
              type="text" 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste token or Login to auto-fill..."
              className="w-64 px-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-slate-600"
            />
          </div>
        </header>

        <div className="flex gap-6 flex-1 min-h-0">
          
          {/* Left Sidebar: Presets */}
          <div className="w-72 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">Collections</h2>
            {presets.map((p, i) => (
              <button 
                key={i}
                onClick={() => handlePreset(p, i)}
                className={`text-left text-sm px-4 py-3 rounded-lg border transition-all duration-200 group flex items-center gap-3 ${
                  activePreset === i 
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-white' 
                  : 'bg-transparent border-transparent hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className={`text-[10px] font-bold w-10 ${methodColors[p.method]}`}>{p.method}</span>
                <span className="truncate">{p.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-6 bg-[#161b22] rounded-xl border border-slate-800 p-6 overflow-hidden shadow-2xl">
            
            {/* Request Bar */}
            <div className="flex gap-3">
              <select 
                value={method} 
                onChange={(e) => setMethod(e.target.value)}
                className={`px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${methodColors[method]} outline-none appearance-none cursor-pointer`}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono tracking-tight"
                placeholder="Enter request URL"
              />
              <button 
                onClick={handleTest}
                disabled={loading}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
              >
                {loading ? (
                  <><span className="animate-spin text-lg">⟳</span> Sending</>
                ) : (
                  <>Send Request <span className="text-indigo-200">→</span></>
                )}
              </button>
            </div>

            <div className="flex flex-1 gap-6 min-h-0">
              {/* Request Body (Conditionally rendered) */}
              {(method === "POST" || method === "PUT" || method === "PATCH") && (
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Request Body (JSON)</label>
                  </div>
                  <textarea 
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="flex-1 w-full p-4 font-mono text-sm border border-slate-700 rounded-lg bg-slate-900 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none custom-scrollbar"
                    spellCheck="false"
                  />
                </div>
              )}

              {/* Response Panel */}
              <div className="flex-[1.5] flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Response</label>
                  {response && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${response.ok ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {response.status} {response.ok ? 'OK' : 'Error'}
                    </span>
                  )}
                </div>
                <div className="flex-1 relative border border-slate-700 rounded-lg bg-[#0d1117] overflow-hidden group">
                  <div className="absolute inset-0 overflow-auto p-4 custom-scrollbar">
                    {response ? (
                      <pre className="font-mono text-[13px] leading-relaxed text-slate-300">
                        {JSON.stringify(response.data || response.error, null, 2)}
                      </pre>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3">
                        <span className="text-4xl">🚀</span>
                        <p className="text-sm">Hit Send to view response</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}} />
    </div>
  );
}
