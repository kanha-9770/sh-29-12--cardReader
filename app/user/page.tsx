"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Users,
  Plus,
  X,
  Trash2,
  Building2,
  Loader2,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  organizationId: string;
  isAdmin?: boolean;
  createdAt?: string;
};

export default function UserPage() {
  const router = useRouter();

  const [organizationId, setOrganizationId] = useState("");
  const [organizationCreated, setOrganizationCreated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // FETCH CURRENT USER
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();

        if (data?.user?.email) {
          const orgIdString = data.user.email; // ← using email as orgId (as per your logic)
          setOrganizationId(orgIdString);
          setOrganizationCreated(true);

          if (!data.user.isAdmin) {
            router.push("/unauthorized");
            return;
          }

          setIsAdmin(true);
          await fetchUsers();
        } else {
          throw new Error("No email found in user data");
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  // FETCH USERS
  async function fetchUsers() {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch users");
      }

      const data = await res.json();
      setUsers(
        data.users.map((u: any) => ({
          ...u,
          organizationId,
        }))
      );
    } catch (err: any) {
      toast.error(err.message || "Error loading users");
      setError(err.message);
    }
  }

  // FORM HANDLING
  const handleAddUser = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // CREATE USER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();

    if (!name || !email || !formData.password) {
      toast.warning("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.warning("Password must be at least 8 characters");
      return;
    }

    setIsCreating(true);

    try {
      await toast.promise(createUser(name, email, formData.password), {
        loading: "Creating user...",
        success: "User created successfully ✅",
        error: "Failed to create user ❌",
      });

      await fetchUsers();
      setShowForm(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const createUser = async (name: string, email: string, password: string) => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create user");
    }
  };

  // DELETE USER
  const handleDeleteUser = (id: string) => {
    toast.custom((t) => (
      <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-sm mx-auto">
        <p className="font-medium text-gray-900 dark:text-white mb-4">
          Are you sure you want to delete this user?
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors"
            onClick={() => toast.dismiss(t)}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
            onClick={() => {
              toast.dismiss(t);

              toast.promise(deleteUser(id), {
                loading: "Deleting user...",
                success: "User deleted successfully ✅",
                error: "Failed to delete user ❌",
              });
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const deleteUser = async (id: string) => {
    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to delete");
    }

    await fetchUsers();
  };

  // SORT USERS (admin first)
  const sortedUsers = [...users].sort((a, b) => {
    if (a.isAdmin && !b.isAdmin) return -1;
    if (!a.isAdmin && b.isAdmin) return 1;
    return a.name.localeCompare(b.name);
  });

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#483d73] dark:text-purple-400">
          <Loader2 className="h-7 w-7 animate-spin" />
          <span className="text-lg font-medium">Loading users...</span>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-[#e5e2f0] dark:border-gray-700 shadow-xl">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#483d73] hover:bg-[#352c55] dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20 py-12 md:py-16 transition-all duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#2d2a4a] dark:text-white">
            User Management
          </h1>
          <Button
            onClick={handleAddUser}
            className="bg-[#483d73] hover:bg-[#352c55] dark:bg-purple-600 dark:hover:bg-purple-700 text-white shadow-md"
          >
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>

        {/* Organization ID Card */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border-[#e5e2f0] dark:border-gray-700 shadow-sm">
          <CardContent className="p-5 font-mono text-sm text-[#5a5570] dark:text-gray-400">
            Organization ID: <span className="font-semibold text-[#483d73] dark:text-purple-400">{organizationId}</span>
          </CardContent>
        </Card>

        {/* Users List Card */}
        <Card className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border-[#e5e2f0] dark:border-gray-700 shadow-xl">
          <CardHeader className="border-b border-[#e5e2f0] dark:border-gray-700">
            <CardTitle className="text-xl md:text-2xl text-[#2d2a4a] dark:text-white">
              All Users ({sortedUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {sortedUsers.length === 0 ? (
              <div className="py-12 text-center text-[#5a5570] dark:text-gray-400">
                <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>No users yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-[#e5e2f0] dark:divide-gray-700">
                {sortedUsers.map((u) => (
                  <li
                    key={u.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 px-5 gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#2d2a4a] dark:text-white truncate">
                          {u.name}
                        </p>
                        {u.isAdmin && (
                          <Shield className="h-4 w-4 text-[#483d73] dark:text-purple-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-[#5a5570] dark:text-gray-400 truncate">
                        {u.email}
                      </p>
                    </div>

                    {!u.isAdmin && (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Delete user"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ADD USER MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={handleCloseForm}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-xl w-full max-w-md border border-[#e5e2f0] dark:border-gray-700 shadow-2xl backdrop-blur-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#2d2a4a] dark:text-white">
                  Add New User
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Full Name
                  </label>
                  <Input
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="border-[#e5e2f0] dark:border-gray-600 focus:ring-[#483d73] dark:focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email Address
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-[#e5e2f0] dark:border-gray-600 focus:ring-[#483d73] dark:focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Password
                  </label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="border-[#e5e2f0] dark:border-gray-600 focus:ring-[#483d73] dark:focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Confirm Password
                  </label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="border-[#e5e2f0] dark:border-gray-600 focus:ring-[#483d73] dark:focus:ring-purple-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-[#483d73] hover:bg-[#352c55] dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-medium py-6"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}