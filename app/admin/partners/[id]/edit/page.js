"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNav from "@/components/admin/AdminNav";
import PartnerForm from "@/components/admin/PartnerForm";
import { api } from "@/lib/api";

function EditPartnerContent() {
  const { id } = useParams();
  const [partner, setPartner] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/api/partners/${id}`)
      .then(setPartner)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!partner) return <p className="text-green-200/70">Loading...</p>;

  return <PartnerForm initialData={partner} partnerId={id} />;
}

export default function EditPartnerPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] px-4 sm:px-8 py-10">
        <div className="mx-auto max-w-2xl">
          <AdminNav />
          <h1 className="font-heading font-extrabold text-white text-3xl mb-8">Edit Partner</h1>
          <EditPartnerContent />
        </div>
      </div>
    </AdminGuard>
  );
}