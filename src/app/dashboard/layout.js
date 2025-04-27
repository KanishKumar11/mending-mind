"use client";

import { AuthProvider } from "@/app/lib/auth";

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
