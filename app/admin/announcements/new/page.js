import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNav from "@/components/admin/AdminNav";
import AnnouncementForm from "@/components/admin/AnnouncementForm";

export default function NewAnnouncementPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] px-4 sm:px-8 py-10">
        <div className="mx-auto max-w-2xl">
          <AdminNav />
          <Link
            href="/admin/announcements"
            className="inline-block text-green-400 text-sm hover:text-green-300 transition-colors mb-4"
          >
            ← Back to Announcements
          </Link>
          <h1 className="font-heading font-extrabold text-white text-3xl mb-8">Add Announcement</h1>
          <AnnouncementForm />
        </div>
      </div>
    </AdminGuard>
  );
}
