// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Users, Plus, X, Trash2, Building2, Loader2, Shield } from "lucide-react";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function UserPage() {
//   const router = useRouter();
//   const [organizationId, setOrganizationId] = useState<string>("");
//   const [organizationCreated, setOrganizationCreated] = useState<boolean>(false);
//   const [showForm, setShowForm] = useState(false);
//   const [users, setUsers] = useState<
//     { id: string; name: string; email: string; organizationId: string; isAdmin?: boolean; createdAt?: string }[]
//   >([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isCreating, setIsCreating] = useState(false);
//   const [isAdmin, setIsAdmin] = useState<boolean>(false);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await fetch("/api/auth/me", { cache: "no-store" });
//         if (!res.ok) throw new Error("Failed to fetch user data");
//         const data = await res.json();

//         if (data?.user?.email) {
//           const orgIdString = data.user.email;
//           setOrganizationId(orgIdString);
//           setOrganizationCreated(true);

//           if (!data.user.isAdmin) {
//             router.push('/unauthorized');
//             return;
//           }
//           setIsAdmin(true);

//           await fetchUsers();
//         } else {
//           throw new Error("No email found in user data");
//         }
//       } catch (err: any) {
//         console.error("Error fetching data:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [router]);

//   async function fetchUsers() {
//     try {
//       const res = await fetch("/api/users");
//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.error || "Failed to fetch users");
//       }
//       const data = await res.json();

//       setUsers(
//         data.users.map((u: any) => ({
//           ...u,
//           organizationId,
//         }))
//       );
//     } catch (err: any) {
//       console.error("Error fetching users:", err);
//       toast.error("Failed to fetch users.");
//       setError(err.message);
//     }
//   }

//   const handleAddUser = () => setShowForm(true);
//   const handleCloseForm = () => setShowForm(false);
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const name = formData.name.trim();
//     const email = formData.email.trim().toLowerCase();
//     if (!name || !email || !formData.password) {
//       toast.warning("Please fill out all fields.");
//       return;
//     }
//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match!");
//       return;
//     }
//     if (formData.password.length < 8) {
//       toast.warning("Password must be at least 8 characters.");
//       return;
//     }

//     setIsCreating(true);
//     try {
//       await toast.promise(
//         fetch("/api/users", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name, email, password: formData.password }),
//         }).then(async (res) => {
//           if (!res.ok) {
//             const errData = await res.json();
//             throw new Error(errData.error || "Failed to create user");
//           }
//           return res.json();
//         }),
//         {
//           pending: "Creating user...",
//           success: "User created successfully!",
//           error: "Error creating user.",
//         }
//       );

//       await fetchUsers();
//       setFormData({ name: "", email: "", password: "", confirmPassword: "" });
//       setShowForm(false);
//     } catch (err: any) {
//       console.error("Error creating user:", err);
//       toast.error(err.message);
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const handleDeleteUser = (id: string) => {
//     toast(
//       ({ closeToast }) => (
//         <div className="flex flex-col gap-3">
//           <p className="font-medium">Are you sure you want to delete this user?</p>
//           <div className="flex justify-end gap-2">
//             <button
//               onClick={closeToast}
//               className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
//             >
//               No
//             </button>
//             <button
//               onClick={async () => {
//                 closeToast();

//                 toast.promise(
//                   (async () => {
//                     const res = await fetch("/api/users", {
//                       method: "PATCH",
//                       headers: { "Content-Type": "application/json" },
//                       body: JSON.stringify({ userId: id }),
//                     });

//                     if (!res.ok) {
//                       const errData = await res.json();
//                       throw new Error(errData.error || "Failed to delete user");
//                     }
//                     await fetchUsers();
//                   })(),
//                   {
//                     pending: "Deleting user...",
//                     success: "User deleted!",
//                     error: "Failed to delete user",
//                   }
//                 );
//               }}
//               className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
//             >
//               Yes
//             </button>
//           </div>
//         </div>
//       ),
//       {
//         closeOnClick: false,
//         autoClose: false,
//       }
//     );
//   };

//   const sortedUsers = [...users].sort((a, b) => {
//     if (a.isAdmin && !b.isAdmin) return -1;
//     if (!a.isAdmin && b.isAdmin) return 1;
//     return a.name.localeCompare(b.name);
//   });

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#f3f1f8] dark:bg-gray-900">
//         <div className="text-[#483d73] dark:text-purple-400 text-lg font-semibold flex items-center gap-3">
//           <Loader2 className="h-6 w-6 animate-spin" />
//           Loading...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#f3f1f8] dark:bg-gray-900">
//         <Card className="bg-white dark:bg-gray-800 shadow-lg border-none">
//           <CardContent className="pt-6 text-center">
//             <p className="text-red-500 dark:text-red-400 text-lg font-medium">Error: {error}</p>
//             <Button onClick={() => window.location.reload()} className="mt-4 bg-[#483d73] hover:bg-[#5a5570] dark:bg-purple-600 dark:hover:bg-purple-700">
//               Retry
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f3f1f8] dark:bg-gray-900 py-16 transition-colors duration-500">
//       <ToastContainer position="top-right" theme="colored" />

//       <div className="container mx-auto px-4 max-w-6xl">

//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex flex-col md:flex-row items-center justify-between mb-10"
//         >
//           <div className="flex items-center gap-3">
//             <Users className="h-9 w-9 text-[#483d73] dark:text-purple-400" />
//             <h1 className="text-3xl md:text-4xl font-bold text-[#2d2a4a] dark:text-white">
//               User Management
//             </h1>
//           </div>
//           <motion.div whileTap={{ scale: 0.95 }}>
//             <Button
//               onClick={handleAddUser}
//               className="bg-[#483d73] hover:bg-[#5a5570] dark:bg-purple-600 dark:hover:bg-purple-700 text-white flex items-center gap-2 mt-4 md:mt-0 font-medium"
//             >
//               <Plus className="h-5 w-5" /> Add User
//             </Button>
//           </motion.div>
//         </motion.div>

//         {/* Organization Info */}
//         {organizationCreated && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="flex items-center gap-3 mb-8 bg-white dark:bg-gray-800/90 border border-[#e5e2f0] dark:border-gray-700 shadow-md px-6 py-4 rounded-xl backdrop-blur-sm"
//           >
//             <Building2 className="text-[#483d73] dark:text-purple-400 h-6 w-6" />
//             <div>
//               <p className="text-[#2d2a4a] dark:text-gray-300 text-sm font-semibold">
//                 Organization ID
//               </p>
//               <p className="text-[#5a5570] dark:text-gray-400 text-sm font-mono tracking-wider">
//                 {organizationId}
//               </p>
//             </div>
//           </motion.div>
//         )}

//         {/* User List */}
//         <Card className="bg-white dark:bg-gray-800/90 shadow-xl border-none overflow-hidden">
//           <CardHeader className="border-b border-[#e5e2f0] dark:border-gray-700">
//             <CardTitle className="text-2xl text-[#2d2a4a] dark:text-white">All Users ({sortedUsers.length})</CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <AnimatePresence>
//               {sortedUsers.length === 0 ? (
//                 <motion.p
//                   key="empty"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="text-[#5a5570] dark:text-gray-500 text-center py-12 text-lg"
//                 >
//                   No users added yet.
//                 </motion.p>
//               ) : (
//                 <ul className="divide-y divide-[#e5e2f0] dark:divide-gray-700">
//                   {sortedUsers.map((user) => (
//                     <motion.li
//                       key={user.id}
//                       layout
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -20 }}
//                       transition={{ duration: 0.3 }}
//                       className="flex items-center justify-between py-5 px-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
//                     >
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 flex-wrap">
//                           <p className="text-[#2d2a4a] dark:text-white font-semibold text-lg">
//                             {user.name}
//                           </p>

//                           {user.isAdmin && (
//                             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md">
//                               <Shield className="h-3.5 w-3.5" />
//                               Admin
//                             </span>
//                           )}

//                           <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
//                             ID: {user.id.slice(0, 8)}...
//                           </span>
//                         </div>

//                         <p className="text-sm text-[#5a5570] dark:text-gray-400 mt-1.5">
//                           {user.email}
//                         </p>
//                       </div>

//                       {!user.isAdmin ? (
//                         <motion.button
//                           whileHover={{ scale: 1.15 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => handleDeleteUser(user.id)}
//                           className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-3 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition"
//                           title="Delete user"
//                         >
//                           <Trash2 className="h-5 w-5" />
//                         </motion.button>
//                       ) : (
//                         <div className="p-3">
//                           <span className="text-gray-400 dark:text-gray-600 text-xs italic">
//                             protected
//                           </span>
//                         </div>
//                       )}
//                     </motion.li>
//                   ))}
//                 </ul>
//               )}
//             </AnimatePresence>
//           </CardContent>
//         </Card>

//         {/* Add User Modal */}
//         <AnimatePresence>
//           {showForm && (
//             <motion.div
//               className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={handleCloseForm}
//             >
//               <motion.div
//                 initial={{ y: 60, opacity: 0, scale: 0.95 }}
//                 animate={{ y: 0, opacity: 1, scale: 1 }}
//                 exit={{ y: 60, opacity: 0, scale: 0.95 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                 className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex justify-between items-center border-b border-[#e5e2f0] dark:border-gray-700 p-6">
//                   <h2 className="text-2xl font-bold text-[#2d2a4a] dark:text-white">
//                     Create New User
//                   </h2>
//                   <button
//                     onClick={handleCloseForm}
//                     className="text-[#5a5570] dark:text-gray-400 hover:text-[#2d2a4a] dark:hover:text-white transition"
//                     disabled={isCreating}
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>
//                 <form onSubmit={handleSubmit} className="p-6 space-y-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-[#2d2a4a] dark:text-gray-300 mb-2">
//                       Organization ID
//                     </label>
//                     <Input
//                       value={organizationId}
//                       readOnly
//                       className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed font-mono text-sm border-[#e5e2f0] dark:border-gray-600"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-[#2d2a4a] dark:text-gray-300 mb-2">
//                       Name
//                     </label>
//                     <Input
//                       name="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       placeholder="John Doe"
//                       required
//                       disabled={isCreating}
//                       className="text-base"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-[#2d2a4a] dark:text-gray-300 mb-2">
//                       Email
//                     </label>
//                     <Input
//                       name="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="john@example.com"
//                       required
//                       disabled={isCreating}
//                       className="text-base"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-[#2d2a4a] dark:text-gray-300 mb-2">
//                       Password
//                     </label>
//                     <Input
//                       name="password"
//                       type="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       placeholder="••••••••"
//                       required
//                       disabled={isCreating}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-[#2d2a4a] dark:text-gray-300 mb-2">
//                       Confirm Password
//                     </label>
//                     <Input
//                       name="confirmPassword"
//                       type="password"
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       placeholder="••••••••"
//                       required
//                       disabled={isCreating}
//                     />
//                   </div>

//                   <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//                     <Button
//                       type="submit"
//                       disabled={isCreating}
//                       className="w-full bg-[#483d73] hover:bg-[#5a5570] dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-bold text-lg py-6 shadow-lg"
//                     >
//                       {isCreating ? (
//                         <>
//                           <Loader2 className="mr-3 h-5 w-5 animate-spin" />
//                           Creating User...
//                         </>
//                       ) : (
//                         "Create User"
//                       )}
//                     </Button>
//                   </motion.div>
//                 </form>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }


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

  // ✅ FETCH CURRENT USER
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

  // ✅ FETCH USERS
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

  // ✅ FORM HANDLING
  const handleAddUser = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ CREATE USER
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

  // ✅ DELETE USER
  const handleDeleteUser = (id: string) => {
    toast.custom((t) => (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg border dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white">
          Delete this user?
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-3 py-1 text-sm rounded bg-gray-200 dark:bg-gray-700"
            onClick={() => toast.dismiss(t)}
          >
            Cancel
          </button>

          <button
            className="px-3 py-1 text-sm rounded bg-red-600 text-white"
            onClick={() => {
              toast.dismiss(t);

              toast.promise(deleteUser(id), {
                loading: "Deleting user...",
                success: "User deleted ✅",
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

  // ✅ SORT USERS
  const sortedUsers = [...users].sort((a, b) => {
    if (a.isAdmin && !b.isAdmin) return -1;
    if (!a.isAdmin && b.isAdmin) return 1;
    return a.name.localeCompare(b.name);
  });

  // ✅ LOADING
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin mr-3" />
        Loading...
      </div>
    );
  }

  // ✅ ERROR
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ UI
 return (
  <div className="min-h-screen bg-[#f3f1f8] dark:bg-gray-900 py-14 transition-colors duration-300">
    <div className="container mx-auto px-4 max-w-6xl">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center mb-10"
      >
        <div className="flex items-center gap-3">
          <Users className="h-9 w-9 text-[#483d73] dark:text-purple-400" />
          <h1 className="text-3xl md:text-4xl font-bold text-[#2d2a4a] dark:text-white">
            User Management
          </h1>
        </div>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleAddUser}
            className="bg-[#483d73] hover:bg-[#5a5570] dark:bg-purple-600 dark:hover:bg-purple-700 text-white mt-4 md:mt-0"
          >
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </motion.div>
      </motion.div>

      {/* ORGANIZATION */}
      <Card className="mb-8 bg-white dark:bg-gray-800 border-none shadow">
        <CardContent className="flex items-center gap-4 p-4">
          <Building2 className="text-purple-500" />
          <div>
            <p className="text-sm font-semibold dark:text-gray-300">
              Organization ID
            </p>
            <p className="font-mono text-gray-600 dark:text-gray-400">
              {organizationId}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* USER LIST */}
      <Card className="bg-white dark:bg-gray-800 border-none shadow-xl">
        <CardHeader>
          <CardTitle className="dark:text-white">
            All Users ({sortedUsers.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          <AnimatePresence>
            {sortedUsers.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 dark:text-gray-400 py-10"
              >
                No users yet.
              </motion.p>
            ) : (
              <ul className="divide-y dark:divide-gray-700">
                {sortedUsers.map((u) => (
                  <motion.li
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-between items-center py-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold dark:text-white">{u.name}</p>

                        {u.isAdmin && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-purple-600 text-white">
                            Admin
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {u.email}
                      </p>
                    </div>

                    {!u.isAdmin ? (
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <Trash2 />
                      </motion.button>
                    ) : (
                      <span className="text-xs italic text-gray-400">
                        Protected
                      </span>
                    )}
                  </motion.li>
                ))}
              </ul>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>

    {/* MODAL */}
    <AnimatePresence>
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseForm}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 40 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-[400px]"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-white">
                Create User
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="name" placeholder="Name" onChange={handleChange} />
              <Input name="email" placeholder="Email" onChange={handleChange} />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
              />
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
              />

              <Button
                type="submit"
                disabled={isCreating}
                className="w-full bg-[#483d73] hover:bg-[#5a5570] dark:bg-purple-600"
              >
                {isCreating ? "Creating..." : "Create User"}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

}
