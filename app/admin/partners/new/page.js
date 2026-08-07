import AdminGuard from "@/components/admin/AdminGuard";
import AdminNav from "@/components/admin/AdminNav";
import PartnerForm from "@/components/admin/PartnerForm";

export default function NewPartnerPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320] px-4 sm:px-8 py-10">
        <div className="mx-auto max-w-2xl">
          <AdminNav />
          <h1 className="font-heading font-extrabold text-white text-3xl mb-8">Add Partner</h1>
          <PartnerForm />
        </div>
      </div>
    </AdminGuard>
  );
}