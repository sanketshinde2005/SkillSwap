"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, getUserRole } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
  role?: "ADMIN";
};

export default function ProtectedRoute({ children, role }: Props) {
  const router = useRouter();

  useEffect(() => {
    // Not logged in → login page
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }

    // Admin-only route protection
    if (role === "ADMIN" && getUserRole() !== "ADMIN") {
      router.replace("/skills");
    }
  }, [router, role]);

  return <>{children}</>;
}
