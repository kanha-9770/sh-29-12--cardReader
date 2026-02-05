"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Plug,
  Bell,
  CreditCard,
  Shield,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Save } from "lucide-react";
import { generateAvatar } from "@/lib/avatar";

// ── Profile Settings Component ──
function ProfileSettings() {
  const [user, setUser] = useState<any>(null);
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
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
    return user?.email.slice(0, 2).toUpperCase() || "US";
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#483d73] dark:text-purple-400" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
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
              <Label htmlFor="email" className="text-base font-medium text-foreground">
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
              <Label htmlFor="name" className="text-base font-medium text-foreground">
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
    </div>
  );
}

// ── Billing & Plans Component (with dark mode support) ──
function BillingAndPlans() {
  return (
    <div className="space-y-8">
      <Card className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border-[#e5e2f0] dark:border-gray-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-[#2d2a4a] dark:text-white">
            Current Plan
          </CardTitle>
          <CardDescription className="text-[#5a5570] dark:text-gray-400">
            Manage your subscription and billing details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border border-[#e5e2f0] dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-900/30">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Free Plan</h3>
              <p className="text-sm text-muted-foreground mt-1">
                15 card submissions per month
              </p>
            </div>
            <div className="text-right mt-4 sm:mt-0">
              <span className="text-2xl font-bold text-foreground">₹0</span>
              <p className="text-sm text-muted-foreground">/month</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 text-foreground">Upgrade Options</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-2 border-[#483d73] dark:border-purple-500 bg-white/60 dark:bg-gray-800/60">
                <CardHeader>
                  <CardTitle className="text-[#483d73] dark:text-purple-400">Pro Plan</CardTitle>
                  <CardDescription className="text-muted-foreground">₹499 / month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground dark:text-gray-400">
                    <li>✓ 100 submissions/month</li>
                    <li>✓ Priority support</li>
                    <li>✓ Advanced integrations</li>
                  </ul>
                  <Button className="w-full mt-6 bg-[#483d73] hover:bg-[#352c55] dark:bg-purple-600 dark:hover:bg-purple-700 text-white">
                    Upgrade to Pro
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/60 dark:bg-gray-800/60">
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription className="text-muted-foreground">Contact us</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground dark:text-gray-400">
                    <li>✓ Unlimited submissions</li>
                    <li>✓ Custom branding</li>
                    <li>✓ Dedicated account manager</li>
                  </ul>
                  <Button variant="outline" className="w-full mt-6 border-[#483d73] dark:border-purple-500 text-[#483d73] dark:text-purple-400 hover:bg-[#483d73]/10 dark:hover:bg-purple-500/10">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="pt-6 border-t border-[#e5e2f0] dark:border-gray-700">
            <h3 className="text-lg font-medium mb-4 text-foreground">Billing History</h3>
            <p className="text-muted-foreground dark:text-gray-400">No invoices yet.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Navigation Items ──
const navItems = [
  { title: "Profile", href: "/settings", icon: User },
  { title: "Zoho Integration", href: "/settings/zoho-integration", icon: Plug },
  { title: "Billing & Plans", href: "/settings/billing", icon: CreditCard },
  { title: "Notifications", href: "/settings/notifications", icon: Bell, disabled: true },
  { title: "Security", href: "/settings/security", icon: Shield, disabled: true },
];

export default function SettingsPage() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const currentItem = navItems.find((item) => item.href === pathname) || navItems[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20 transition-all duration-500">
      {/* Mobile header */}
      {isMobile && (
        <div className="sticky top-0 z-30 border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80">
          <div className="flex h-14 items-center px-4 gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5 text-[#483d73] dark:text-purple-400" />
            </Button>
            <h1 className="text-lg font-semibold text-[#2d2a4a] dark:text-white">Settings</h1>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-900 border-r border-[#e5e2f0] dark:border-gray-800 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:relative md:translate-x-0 shadow-xl
          `}
        >
          <div className="flex h-full flex-col">
            {/* Sidebar header */}
            <div className="p-6 border-b border-[#e5e2f0] dark:border-gray-800">
              <h2 className="text-xl font-bold text-[#2d2a4a] dark:text-white">Settings</h2>
              <p className="text-sm text-[#5a5570] dark:text-gray-400 mt-1">
                Manage your account and integrations
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <Link href={item.href}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={`
                            w-full justify-start gap-3 h-11 px-4 text-left
                            ${isActive ? "bg-[#f0eef7] dark:bg-purple-950/30" : ""}
                            ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
                          `}
                          disabled={item.disabled}
                        >
                          <Icon className="h-5 w-5 text-[#483d73] dark:text-purple-400" />
                          <span className="text-[#2d2a4a] dark:text-gray-200">{item.title}</span>
                          {item.disabled && (
                            <span className="ml-auto text-xs text-muted-foreground dark:text-gray-500">
                              Soon
                            </span>
                          )}
                        </Button>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-[#e5e2f0] dark:border-gray-800 mt-auto">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 dark:bg-black/60 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content area */}
        <main className="flex-1 p-4 md:p-8">
          <Card className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border-[#e5e2f0] dark:border-gray-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-[#2d2a4a] dark:text-white">
                {currentItem.title}
              </CardTitle>
              <CardDescription className="text-[#5a5570] dark:text-gray-400">
                {currentItem.title === "Profile"
                  ? "Update your profile and view usage"
                  : currentItem.title === "Billing & Plans"
                  ? "Manage subscription and payment methods"
                  : currentItem.title === "Zoho Integration"
                  ? "Sync scanned cards to Zoho"
                  : "Configure this section"}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {pathname === "/settings" ? (
                <ProfileSettings />
              ) : pathname === "/settings/billing" ? (
                <BillingAndPlans />
              ) : pathname === "/settings/zoho-integration" ? (
                <div className="py-10 text-center text-[#5a5570] dark:text-gray-400">
                  {/* ← Replace with your actual Zoho integration component */}
                  Your Zoho Integration form / component should be rendered here
                </div>
              ) : (
                <div className="py-20 text-center text-[#5a5570] dark:text-gray-400">
                  <h3 className="text-xl font-medium text-foreground">Coming Soon</h3>
                  <p className="mt-2">This section is under development.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}