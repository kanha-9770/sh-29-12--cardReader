"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Menu, X, RotateCw, PlusCircle } from "lucide-react";

// Define the User interface to match the expected JWT payload
interface User {
  id: number;
  email: string;
  isAdmin: boolean;
}

interface NavbarProps {
  user: User | null;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="border-b border-[#e5e2f0] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-2 w-full sm:w-auto mb-2 sm:mb-0">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <span className="font-semibold text-xl text-[#2d2a4a]">
              CardSync
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center space-x-4">
          <Link
            href="/"
            className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
          >
            Dashboard
          </Link>
          <Link
            href="/form"
            className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
          >
            Form
          </Link>
          <Link
            href="/feature"
            className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
          >
            Feature
          </Link>
          <Link
            href="/pricing"
            className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
          >
            Pricing
          </Link>
          <Link
            href="/user"
            className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
          >
            User Management
          </Link>
          {user ? (
            <Button
              variant="outline"
              onClick={handleLogout}
              size="sm"
              className="bg-[#483d73] hover:bg-[#3d3260] text-white hover:text-white transition-all"
            >
              Logout
            </Button>
          ) : (
            <Button
              className="bg-[#483d73] hover:bg-[#3d3260] text-white"
              asChild
            >
              <Link href="/login" onClick={() => setIsOpen(false)}>
                Sign In
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden text-black focus:outline-none transition-all ml-auto top-6"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="sm:hidden bg-gray-900 text-white w-full py-3 px-4 flex flex-col space-y-3 shadow-lg transition-all border-t border-gray-700">
          <Link
            href="/"
            className="text-sm font-medium hover:text-gray-300 transition-all py-2 px-3 rounded hover:bg-gray-800 w-full text-center"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium hover:text-gray-300 transition-all py-2 px-3 rounded hover:bg-gray-800 w-full text-center"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/form"
            className="text-sm font-medium hover:text-gray-300 transition-all py-2 px-3 rounded hover:bg-gray-800 w-full text-center"
            onClick={() => setIsOpen(false)}
          >
            Form
          </Link>
            <Link
            href="/feature"
            className="text-sm font-medium hover:text-gray-300 transition-all py-2 px-3 rounded hover:bg-gray-800 w-full text-center"
          >
            Feature
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium hover:text-gray-300 transition-all py-2 px-3 rounded hover:bg-gray-800 w-full text-center"
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </Link>
          {user ? (
            <Button
              variant="outline"
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="border-gray-500 text-red-500 hover:bg-gray-700 transition-all w-full"
              size="sm"
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="outline"
              asChild
              className="border-gray-500 text-white hover:bg-gray-700 transition-all w-full"
              size="sm"
            >
              <Link href="/login" onClick={() => setIsOpen(false)}>
                Sign In
              </Link>
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}