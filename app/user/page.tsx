"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, Plus, X, Trash2, Building2 } from "lucide-react";

export default function UserPage() {
  const [organizationId, setOrganizationId] = useState<string>("");
  const [organizationCreated, setOrganizationCreated] = useState<boolean>(false);
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<
    { id: number; name: string; email: string; organizationId: string }[]
  >([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch organization ID from the logged-in user’s JWT (from cookie)
  useEffect(() => {
    async function fetchOrganization() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();

        // email = organization ID (as per your login logic)
        if (data?.user?.email) {
          const orgId = data.user.email;
          setOrganizationId(orgId);
          setOrganizationCreated(true);
          console.log("✅ Organization ID:", orgId);
        } else {
          console.warn("⚠️ No email found in token payload");
        }
      } catch (err) {
        console.error("❌ Error fetching organization:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrganization();
  }, []);

  const handleAddUser = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill out all fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      organizationId,
    };

    setUsers([...users, newUser]);
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setShowForm(false);
  };

  const handleDeleteUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f3f1f8]">
        <p className="text-[#483d73] text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f1f8] py-16">
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
                Organization Created
              </p>
              <p className="text-[#5a5570] text-sm">{organizationId}</p>
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
              {users.length === 0 ? (
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
                  {users.map((user) => (
                    <motion.li
                      key={user.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between py-3 px-2"
                    >
                      <div>
                        <p className="text-[#2d2a4a] font-medium">{user.name}</p>
                        <p className="text-sm text-[#5a5570]">{user.email}</p>
                        <p className="text-xs text-[#8a86a3]">
                          Org ID: {user.organizationId}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full transition"
                        title="Delete user"
                      >
                        <Trash2 className="h-5 w-5" />
                      </motion.button>
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
                      className="bg-gray-100 cursor-not-allowed"
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
                    />
                  </div>

                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                      type="submit"
                      className="w-full bg-[#483d73] hover:bg-[#5a5570] text-white"
                    >
                      Create User
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
