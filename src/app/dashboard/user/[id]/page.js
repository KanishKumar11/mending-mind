"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/auth";
import LoginForm from "../../components/LoginForm";
import UserDetail from "../../components/UserDetail";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function UserDetailPage() {
  const { isAuthenticated } = useAuth();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && params.id) {
      fetchUser(params.id);
    }
  }, [isAuthenticated, params.id]);

  const fetchUser = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
      } else {
        setError("Failed to fetch user details");
      }
    } catch (error) {
      setError("An error occurred while fetching user details");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-8">
        <Image
          src="/Mind_Logo.png"
          alt="Mending Mind Logo"
          width={120}
          height={48}
          priority
          className="object-contain mr-4"
        />
        <h1 className="text-3xl font-bold">User Details</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F0C93B]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <UserDetail user={user} />
      )}
    </div>
  );
}
