"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNav from "@/components/admin/AdminNav";

function PartnersContent() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/partners")
      .then(setPartners)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!confirm("Remove this partner?")) return;
    try {
      await api.delete(`/api/partners/${id}`, { token: getToken() });
      setPartners((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] px-4 sm:px-8 py-10">
      <div className="mx-auto max-w-4xl">
        <AdminNav />

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading font-extrabold text-white text-3xl">Partners</h1>
          <Link
            href="/admin/partners/new"
            className="rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-heading font-bold px-6 py-3 shadow-lg hover:opacity-90 transition-opacity"
          >
            + Add Partner
          </Link>
        </div>

        {loading && <p className="text-green-200/70">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <div className="grid sm:grid-cols-2 gap-4">
          {partners.map((partner) => (
            <div key={partner._id} className="rounded-xl bg-[#0d2818] p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-700 overflow-hidden shrink-0">
                {partner.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={partner.image} alt={partner.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-white truncate">{partner.name}</p>
                <p className="text-green-200/60 text-xs truncate">{partner.detail}</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link href={`/admin/partners/${partner._id}/edit`} className="text-green-300 text-sm hover:text-white">
                  Edit
                </Link>
                <button onClick={() => handleDelete(partner._id)} className="text-red-400 text-sm hover:text-red-300">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!loading && partners.length === 0 && (
            <p className="text-green-200/60 text-sm">No partners yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PartnersAdminPage() {
  return (
    <AdminGuard>
      <PartnersContent />
    </AdminGuard>
  );
}