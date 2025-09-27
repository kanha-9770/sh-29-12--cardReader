"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Menu, X, RotateCw, PlusCircle } from "lucide-react";

export function Navbar({ user }: { user: any }) {
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

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push("/");
    }
  };

  const handleHardRefreshHome = () => {
    window.location.href = "/";
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
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="bg-[#483d73] hover:bg-[#3d3260] text-white hover:text-white"
            size="sm"
          >
            <PlusCircle className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
            <span>New Form</span>
          </Button>
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
            href="/admin"
            className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
          >
            Admin Dashboard
          </Link>
          <Link
            href="/form"
            className="text-black text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
          >
            Form
          </Link>
          <Link
            href="/pricing"
            className="text-back text-sm font-medium hover:text-white transition-all px-3 py-1.5 rounded hover:bg-[#3d3260]"
          >
            Pricing
          </Link>
          <Button
            className="bg-[#483d73] hover:bg-[#3d3260] text-white"
            asChild
          >
            <Link href="/login" onClick={() => setIsOpen(false)}>
              Sign In
            </Link>
          </Button> 
          <Button
            variant="outline"
            onClick={handleLogout}
            size="sm"
            className="border-gray-500 text-red-500 hover:bg-gray-700 transition-all"
          >
            Logout
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden text-white focus:outline-none transition-all ml-auto"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="sm:hidden bg-gray-900 text-white w-full py-3 px-4 flex flex-col space-y-3 shadow-lg transition-all border-t border-gray-700">
          <Link
            href="/admin"
            className="text-sm font-medium hover:text-gray-300 transition-all py-2 px-3 rounded hover:bg-gray-800 w-full text-center"
            onClick={() => setIsOpen(false)}
          >
            Admin Dashboard
          </Link>
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
        </div>
      )}
    </nav>
  );
}


