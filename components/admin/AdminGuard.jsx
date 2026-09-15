"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getValidToken } from "@/lib/auth";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getValidToken()) {
      router.replace("/admin");
      return;
    }

    queueMicrotask(() => {
      setChecked(true);
    });

    function handleAuthExpired() {
      router.replace("/admin");
    }

    window.addEventListener("compsciety:auth-expired", handleAuthExpired);
    return () => window.removeEventListener("compsciety:auth-expired", handleAuthExpired);
  }, [router]);

  if (!checked) return null;
  return children;
}