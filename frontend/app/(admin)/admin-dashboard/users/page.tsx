"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/types/user";
import { getUsers } from "@/lib/api";
import { DataTable } from "@/components/admin/DataTable";
import { columns } from "@/components/admin/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Debounce hook
import { useRef } from "react";
function useDebouncedValue(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setDebounced(value), delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, delay]);
  return debounced;
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const [users, setUsers] = useState<User[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(() => {
    if (status === "authenticated" && session.user.role === "admin") {
      setLoading(true);
      getUsers(page, limit, debouncedSearch)
        .then((data) => {
          setUsers(data.data);
          setPageCount(data.pagination.pages);
          setTotal(data.pagination.total);
          setError(null);
        })
        .catch((error) => {
          console.error("Failed to fetch users:", error);
          setError("Failed to load users. Please try again later.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [status, session, page, limit, debouncedSearch]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user.role !== "admin") {
      router.push("/dashboard");
    } else {
      fetchUsers();
    }
  }, [status, session, router, fetchUsers]);

  // Pass fetchUsers to columns for data refresh after actions
  const memoizedColumns = useMemo(() => columns(fetchUsers), [fetchUsers]);

  if (status === "loading" || loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="rounded-md border">
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    );
  }

  if (session?.user.role !== "admin") {
    return null; // Or an access denied component
  }
  
  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Button onClick={() => router.push('/admin-dashboard/users/new')}>
            Create User
          </Button>
        </div>
        <form
          className="w-full"
          onSubmit={e => { e.preventDefault(); fetchUsers(); }}
        >
          <div className="flex items-center w-full max-w-full gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </span>
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <Button type="submit" variant="outline" className="h-10 px-6">Search</Button>
          </div>
        </form>
      </div>
      <div className="mb-2 text-sm text-gray-500">
        Showing {users.length} of {total} users | Page {page} of {pageCount}
      </div>
      <DataTable
        columns={memoizedColumns}
        data={users}
        pageCount={pageCount}
      />
    </div>
  );
} 