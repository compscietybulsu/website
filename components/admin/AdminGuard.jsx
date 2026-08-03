"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const [hasToken] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!hasToken) {
      router.replace("/admin");
    }
  }, [hasToken, router]);

  if (!hasToken) return null;
  return children;
}