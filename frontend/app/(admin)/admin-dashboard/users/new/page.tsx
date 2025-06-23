"use client";

import { UserForm } from "@/components/admin/UserForm";
import { createUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function CreateUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: z.infer<any>) => {
    setIsLoading(true);
    try {
      await createUser(data);
      toast.success("User created successfully!");
      router.push("/admin-dashboard/users");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to create user.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-2 min-h-[80vh]">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Create New User</h1>
          <p className="text-lg text-gray-600">Fill in the details below to add a new user to the system.</p>
        </div>
        <div className="w-full">
          <UserForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
} 