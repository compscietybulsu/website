"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { saveToken, getToken } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace("/admin/dashboard");
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api.post("/api/auth/login", { username, password });
      saveToken(data.token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-[#0d2818] p-8">
        <h1 className="font-heading font-extrabold text-white text-2xl mb-6 text-center">Admin Login</h1>

        <label className="block text-sm text-green-200/80 mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          className="w-full rounded-lg bg-black/40 border border-green-800/50 text-white px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-green-400"
        />

        <label className="block text-sm text-green-200/80 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full rounded-lg bg-black/40 border border-green-800/50 text-white px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-green-400"
        />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-heading font-bold py-3 shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}