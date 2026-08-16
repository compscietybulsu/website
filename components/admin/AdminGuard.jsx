"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Perform your auth check here (e.g., checking localStorage or token)
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.replace("/admin");
      return;
    }

    // Use setTimeout or queue microtask if state must be updated asynchronously, 
    // or better yet, verify token and set state safely.
    const timer = setTimeout(() => {
      setChecked(true);
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return <>{children}</>;
}