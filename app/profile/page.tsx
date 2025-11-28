"use client";

import { generateAvatar } from "@/lib/avatar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save, ArrowLeft } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  organizationId?: string;
  isAdmin: boolean;
  formCount: number;
  formLimit: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();
      setUser(data.user);
      setName(data.user.name || "");
    } catch (error) {
      toast({
        title: "Access Denied",
        description: "Please log in to view your profile.",
        variant: "destructive",
      });
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        toast({
          title: "Profile Updated",
          description: "Your name has been saved successfully.",
        });
        fetchUser();
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not save your name. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const avatarUrl = user ? generateAvatar(user.email) : "";

  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    return user?.email.slice(0, 2).toUpperCase() || "US";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#483d73] dark:text-purple-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/30 py-12 px-4 transition-all duration-500">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-[#483d73] dark:text-purple-400 hover:text-[#352c55] dark:hover:text-purple-300 mb-10 transition-all duration-200 font-medium group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition" />
          <span>Back to Dashboard</span>
        </button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Avatar & Stats */}
          <Card className="lg:col-span-1 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border-[#e5e2f0] dark:border-gray-700 shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-6">
                <Avatar className="h-28 w-28 ring-4 ring-[#483d73]/10 dark:ring-purple-500/30 shadow-2xl">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-[#483d73] dark:bg-purple-600 text-white text-4xl font-bold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <CardTitle className="text-2xl md:text-3xl font-bold text-[#2d2a4a] dark:text-white">
                {user?.name || user?.email.split("@")[0]}
              </CardTitle>
              <CardDescription className="text-base text-[#5a5570] dark:text-gray-400 mt-2">
                {user?.email}
              </CardDescription>

              {user?.isAdmin && (
                <div className="mt-4">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-600">
                    Admin Access
                  </span>
                </div>
              )}
            </CardHeader>

            <CardContent className="pt-6 border-t border-[#e5e2f0] dark:border-gray-700">
              <div className="text-center space-y-3">
                <div>
                  <p className="text-4xl md:text-5xl font-bold text-[#483d73] dark:text-purple-400">
                    {user?.formCount || 0}
                  </p>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    of {user?.formLimit || 15} cards submitted
                  </p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-4">
                  <div
                    className="bg-[#483d73] dark:bg-purple-500 h-3 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(
                        ((user?.formCount || 0) / (user?.formLimit || 15)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Edit Profile */}
          <Card className="lg:col-span-2 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border-[#e5e2f0] dark:border-gray-700 shadow-xl">
            <CardHeader className="border-b border-[#e5e2f0] dark:border-gray-700">
              <CardTitle className="text-2xl text-[#2d2a4a] dark:text-white">
                Profile Settings
              </CardTitle>
              <CardDescription className="text-base text-[#5a5570] dark:text-gray-400">
                Update your personal information
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-8 space-y-8">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800 border-[#e5e2f0] dark:border-gray-600 text-base"
                />
                <p className="text-sm text-muted-foreground dark:text-gray-500">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-medium">
                  Display Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="text-base border-[#e5e2f0] dark:border-gray-600 focus:ring-[#483d73] dark:focus:ring-purple-500"
                />
                <p className="text-sm text-muted-foreground dark:text-gray-500">
                  This name appears in the navbar and on your submissions
                </p>
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  onClick={handleSave}
                  disabled={
                    isSaving ||
                    name.trim() === (user?.name || "") ||
                    name.trim() === ""
                  }
                  size="lg"
                  className="bg-[#483d73] hover:bg-[#352c55] dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-3 h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-[#5a5570] dark:text-gray-500">
          <p className="font-medium">
            CardSync With AI • {new Date().getFullYear()} •{" "}
            <span className="text-[#483d73] dark:text-purple-400 font-bold">
              {user?.formCount}/{user?.formLimit}
            </span>{" "}
            submissions used
          </p>
        </div>
      </div>
    </div>
  );
}