"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin");
      return;
    }
    setChecked(true);

    function handleAuthExpired() {
      router.replace("/admin");
    }

    window.addEventListener("compsciety:auth-expired", handleAuthExpired);
    return () => window.removeEventListener("compsciety:auth-expired", handleAuthExpired);
  }, [router]);

  if (!checked) return null;
  return children;
}