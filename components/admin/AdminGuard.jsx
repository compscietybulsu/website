"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getValidToken } from "@/lib/auth";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const [hasValidToken] = useState(() => Boolean(getValidToken()));

  useEffect(() => {
    if (!hasValidToken) {
      router.replace("/admin");
    }
  }, [hasValidToken, router]);

  if (!hasValidToken) return null;
  return children;
}