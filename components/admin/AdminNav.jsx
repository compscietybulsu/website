"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";

const TABS = [
  { label: "Blogs", href: "/admin/dashboard" },
  { label: "Partners", href: "/admin/partners" },
  { label: "Executives", href: "/admin/leaders" },
  { label: "Committees", href: "/admin/committees" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearToken();
    router.push("/admin");
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex gap-6">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`font-heading font-semibold text-sm ${pathname.startsWith(tab.href) ? "text-white" : "text-green-300/60 hover:text-white"
              } transition-colors`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <button onClick={handleLogout} className="text-green-300 text-sm hover:text-white">
        Log Out
      </button>
    </div>
  );
}