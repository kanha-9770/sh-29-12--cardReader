"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, Plus, X, Trash2, Building2, Loader2, Shield } from "lucide-react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserPage() {
  const router = useRouter();
  const [organizationId, setOrganizationId] = useState<string>("");
  const [organizationCreated, setOrganizationCreated] = useState<boolean>(false);
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<
    { id: string; name: string; email: string; organizationId: string; isAdmin?: boolean; createdAt?: string }[]
  >([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();

        if (data?.user?.email) {
          const orgIdString = data.user.email;
          setOrganizationId(orgIdString);
          setOrganizationCreated(true);

          if (!data.user.isAdmin) {
            router.push('/unauthorized');
            return;
          }
          setIsAdmin(true);

          await fetchUsers();
        } else {
          throw new Error("No email found in user data");
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

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
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users.");
      setError(err.message);
    }
  }

  const handleAddUser = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    if (!name || !email || !formData.password) {
      toast.warning("Please fill out all fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (formData.password.length < 8) {
      toast.warning("Password must be at least 8 characters.");
      return;
    }

    setIsCreating(true);
    try {
      await toast.promise(
        fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password: formData.password }),
        }).then(async (res) => {
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Failed to create user");
          }
          return res.json();
        }),
        {
          pending: "Creating user...",
          success: "User created successfully!",
          error: "Error creating user.",
        }
      );

      await fetchUsers();
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      setShowForm(false);
    } catch (err: any) {
      console.error("Error creating user:", err);
      toast.error(err.message);
    } finally {
      setIsCreating(false);
    }
  };

 const handleDeleteUser = (id: string) => {
  toast(
    ({ closeToast }) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium">Are you sure you want to delete this user?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={closeToast}
            className="px-3 py-1 rounded bg-gray-300 text-gray-800 text-sm"
          >
            No
          </button>
          <button
            onClick={async () => {
              closeToast();

              toast.promise(
                (async () => {
                  const res = await fetch("/api/users", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: id }),
                  });

                  if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || "Failed to delete user");
                  }
                  await fetchUsers();
                })(),
                {
                  pending: "Deleting user...",
                  success: "User deleted!",
                  error: "Failed to delete user",
                }
              );
            }}
            className="px-3 py-1 rounded bg-red-600 text-white text-sm"
          >
            Yes
          </button>
        </div>
      </div>
    ),
    {
      closeOnClick: false,
      autoClose: false,
    }
  );
};


  const sortedUsers = [...users].sort((a, b) => {
    if (a.isAdmin && !b.isAdmin) return -1;
    if (!a.isAdmin && b.isAdmin) return 1;
    return a.name.localeCompare(b.name);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f3f1f8]">
        <p className="text-[#483d73] text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f3f1f8]">
        <Card className="bg-white shadow-lg border-none">
          <CardContent className="pt-6">
            <p className="text-red-500 text-center">Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4 mx-auto block">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f1f8] py-16">
      <ToastContainer position="top-right" theme="colored" />

      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between mb-10"
        >
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-[#483d73]" />
            <h1 className="text-3xl font-bold text-[#2d2a4a]">User Management</h1>
          </div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleAddUser}
              className="bg-[#483d73] hover:bg-[#5a5570] text-white flex items-center gap-2 mt-4 md:mt-0"
            >
              <Plus className="h-5 w-5" /> Add User
            </Button>
          </motion.div>
        </motion.div>

        {/* Organization Info */}
        {organizationCreated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 mb-6 bg-white border border-[#e5e2f0] shadow-sm px-4 py-3 rounded-lg"
          >
            <Building2 className="text-[#483d73] h-5 w-5" />
            <div>
              <p className="text-[#2d2a4a] text-sm font-semibold">
                Organization ID
              </p>
              <p className="text-[#5a5570] text-sm font-mono">{organizationId}</p>
            </div>
          </motion.div>
        )}

        {/* User List */}
        <Card className="bg-white shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-[#2d2a4a]">All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {sortedUsers.length === 0 ? (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[#5a5570] text-center py-6"
                >
                  No users added yet.
                </motion.p>
              ) : (
                <ul className="divide-y divide-[#e5e2f0]">
                  {sortedUsers.map((user) => (
                    <motion.li
                      key={user.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between py-4 px-2"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[#2d2a4a] font-medium">{user.name}</p>

                          {user.isAdmin && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              <Shield className="h-3 w-3" />
                              Admin
                            </span>
                          )}

                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono bg-gray-100 text-gray-600">
                            ID: {user.organizationId}
                          </span>
                        </div>

                        <p className="text-sm text-[#5a5570] mt-1">{user.email}</p>
                      </div>

                      {!user.isAdmin ? (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full transition"
                          title="Delete user"
                        >
                          <Trash2 className="h-5 w-5" />
                        </motion.button>
                      ) : (
                        <div className="p-2">
                          <span className="text-gray-400 text-xs" title="Admins cannot be deleted">
                            —
                          </span>
                        </div>
                      )}
                    </motion.li>
                  ))}
                </ul>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Add User Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md"
              >
                <div className="flex justify-between items-center border-b border-[#e5e2f0] p-5">
                  <h2 className="text-xl font-bold text-[#2d2a4a]">
                    Create New User
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-[#5a5570] hover:text-[#2d2a4a]"
                    disabled={isCreating}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#2d2a4a] mb-1">
                      Organization ID
                    </label>
                    <Input
                      value={organizationId}
                      readOnly
                      className="bg-gray-100 cursor-not-allowed font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d2a4a] mb-1">
                      Name
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter name"
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d2a4a] mb-1">
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d2a4a] mb-1">
                      Password
                    </label>
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d2a4a] mb-1">
                      Confirm Password
                    </label>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      required
                      disabled={isCreating}
                    />
                  </div>

                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                      type="submit"
                      disabled={isCreating}
                      className="w-full bg-[#483d73] hover:bg-[#5a5570] text-white"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating User...
                        </>
                      ) : (
                        "Create User"
                      )}
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
