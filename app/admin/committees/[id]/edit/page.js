"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNav from "@/components/admin/AdminNav";
import CommitteeMemberForm from "@/components/admin/CommitteeMemberForm";
import { api } from "@/lib/api";

function EditCommitteeMemberContent() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/api/committee-members/${id}`)
      .then(setMember)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!member) return <p className="text-green-200/70">Loading...</p>;

  return <CommitteeMemberForm initialData={member} memberId={id} />;
}

export default function EditCommitteeMemberPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] px-4 sm:px-8 py-10">
        <div className="mx-auto max-w-2xl">
          <AdminNav />
          <Link
            href="/admin/committees"
            className="inline-block text-green-400 text-sm hover:text-green-300 transition-colors mb-4"
          >
            ← Back to Committees
          </Link>
          <h1 className="font-heading font-extrabold text-white text-3xl mb-8">Edit Committee Member</h1>
          <EditCommitteeMemberContent />
        </div>
      </div>
    </AdminGuard>
  );
}