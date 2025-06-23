"use client";

import { UserForm } from "@/components/admin/UserForm";
import { getUser, updateUser } from "@/lib/api";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser(id);
        setUser(userData);
      } catch (error) {
        toast.error("Failed to fetch user data.");
        router.push("/admin-dashboard/users");
      } finally {
        setIsFetching(false);
      }
    };
    fetchUser();
  }, [id, router]);

  const handleSubmit = async (data: z.infer<any>) => {
    setIsLoading(true);
    try {
      await updateUser(id, data);
      toast.success("User updated successfully!");
      router.push("/admin-dashboard/users");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isFetching) {
      return (
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-2 min-h-[80vh]">
          <div className="w-full max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Edit User</h1>
              <p className="text-lg text-gray-600">Update the details below to edit the user.</p>
            </div>
            <div className="w-full">
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
        </div>
      )
  }

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-2 min-h-[80vh]">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Edit User</h1>
          <p className="text-lg text-gray-600">Update the details below to edit the user.</p>
        </div>
        <div className="w-full">
          {user && (
            <UserForm
              onSubmit={handleSubmit}
              defaultValues={user}
              isEditing
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
} 