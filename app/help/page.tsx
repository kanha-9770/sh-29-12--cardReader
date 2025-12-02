"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Mail,
  MessageSquare,
  Phone,
  Scan,
  Users,
  FileText,
  Download,
  Settings,
  Globe,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HelpAndSupport() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app: send to your backend or email service
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#f3f1f8] to-white dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#483d73] to-[#62588b] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Help & Support Center
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Everything you need to master your Business Card Scanner & Lead
              Management system
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border border-[#e5e2f0] dark:border-gray-700">
              <CardHeader>
                <Scan className="w-10 h-10 text-[#483d73] dark:text-purple-400 mb-3" />
                <CardTitle className="text-[#2d2a4a] dark:text-white">
                  How to Scan Cards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="#scan-guide">
                  <Button
                    variant="outline"
                    className="w-full border-[#483d73] text-[#483d73] hover:bg-[#f3f1f8] dark:border-purple-500 dark:text-purple-400 dark:hover:bg-gray-700 transition-all"
                  >
                    View Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>
    
            <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border border-[#e5e2f0] dark:border-gray-700">
              <CardHeader>
                <FileText className="w-10 h-10 text-[#483d73] dark:text-purple-400 mb-3" />
                <CardTitle className="text-[#2d2a4a] dark:text-white">
                  Download Excel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="#export">
                  <Button
                    variant="outline"
                    className="w-full border-[#483d73] text-[#483d73] hover:bg-[#f3f1f8] dark:border-purple-500 dark:text-purple-400 dark:hover:bg-gray-700 transition-all"
                  >
                    Export Instructions
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border border-[#e5e2f0] dark:border-gray-700">
              <CardHeader>
                <MessageSquare className="w-10 h-10 text-[#483d73] dark:text-purple-400 mb-3" />
                <CardTitle className="text-[#2d2a4a] dark:text-white">
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="#contact">
                  <Button className="w-full bg-[#483d73] hover:bg-[#31294e] dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-medium transition-all hover:scale-105">
                    Get Help Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* FAQ Accordion */}
          <div id="faq">
            <h2 className="text-3xl font-bold text-center mb-10">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="max-w-4xl mx-auto">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  How accurate is the card scanning?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Our OCR engine achieves{" "}
                    <Badge variant="secondary">98%+</Badge> accuracy on clear,
                    well-lit business cards. For best results: use good
                    lighting, place card flat, and avoid glare.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger id="scan-guide">
                  How do I scan a business card properly?
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Open the app and tap "Scan New Card"</li>
                    <li>Place card on a dark, non-reflective surface</li>
                    <li>Hold phone 6-8 inches above card</li>
                    <li>Align card within the guide frame</li>
                    <li>Wait for green border → tap capture</li>
                    <li>Review extracted data before saving</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Can I edit extracted data if OCR is wrong?
                </AccordionTrigger>
                <AccordionContent>
                  Yes! After scanning, you can:
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Tap any field to correct it</li>
                    <li>Add missing information</li>
                    <li>Write notes in the description box</li>
                    <li>Admin can also edit from dashboard</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger id="export">
                  How do I export all leads to Excel?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-muted-foreground">
                    <p>Go to Admin Dashboard → Card Data tab</p>
                    <p>
                      Click <Badge>Download Excel</Badge> button
                    </p>
                    <p className="font-medium text-green-600 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Works perfectly on iPhone, Android & Desktop
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>
                  Can multiple team members use the app?
                </AccordionTrigger>
                <AccordionContent>
                  Absolutely! Each user logs in with their email. All scans
                  appear in the shared admin dashboard with their name.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>
                  What data is extracted from cards?
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-600 w-4 h-4" />{" "}
                      Company Name
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-600 w-4 h-4" /> Person
                      Name
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-600 w-4 h-4" /> Email
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-600 w-4 h-4" /> Phone
                      Numbers
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-600 w-4 h-4" />{" "}
                      Address
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-600 w-4 h-4" />{" "}
                      Website
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <Separator />

          {/* Contact Support */}
          <div id="contact" className="max-w-2xl mx-auto">
            <Card className="bg-white dark:bg-gray-800 border border-[#e5e2f0] dark:border-gray-700 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-[#483d73]/10 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-10 h-10 text-[#483d73] dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl text-[#2d2a4a] dark:text-white">
                  Need Personal Help?
                </CardTitle>
                <CardDescription className="text-[#5a5570] dark:text-gray-400">
                  We typically reply within 1-2 hours
                </CardDescription>
              </CardHeader>

              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500 dark:text-green-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-[#2d2a4a] dark:text-white">
                      Thank you! We'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label
                        htmlFor="name"
                        className="text-[#2d2a4a] dark:text-gray-200"
                      >
                        Your Name
                      </Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="bg-white dark:bg-gray-700 border-[#e5e2f0] dark:border-gray-600 focus:ring-[#483d73] dark:focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-[#2d2a4a] dark:text-gray-200"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="bg-white dark:bg-gray-700 border-[#e5e2f0] dark:border-gray-600 focus:ring-[#483d73] dark:focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="message"
                        className="text-[#2d2a4a] dark:text-gray-200"
                      >
                        How can we help you?
                      </Label>
                      <Textarea
                        id="message"
                        rows={5}
                        required
                        placeholder="Describe your issue or question..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="bg-white dark:bg-gray-700 border-[#e5e2f0] dark:border-gray-600 focus:ring-[#483d73] dark:focus:ring-purple-500 resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#483d73] hover:bg-[#31294e] dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-medium text-base py-6 shadow-lg transition-all hover:scale-105"
                    >
                      Send Message
                    </Button>
                  </form>
                )}

                <Separator className="my-8 border-[#e5e2f0] dark:border-gray-700" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-2">
                    <Mail className="w-8 h-8 text-[#483d73] dark:text-purple-400 mx-auto" />
                    <p className="font-medium text-[#2d2a4a] dark:text-white">
                      Email
                    </p>
                    <p className="text-sm text-[#5a5570] dark:text-gray-400 break-all">
                      support@yourcompany.com
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Phone className="w-8 h-8 text-[#483d73] dark:text-purple-400 mx-auto" />
                    <p className="font-medium text-[#2d2a4a] dark:text-white">
                      Phone
                    </p>
                    <p className="text-sm text-[#5a5570] dark:text-gray-400">
                      +91 98765 43210
                    </p>
                  </div>
                  <div className="space-y-2">
                    <MessageSquare className="w-8 h-8 text-[#483d73] dark:text-purple-400 mx-auto" />
                    <p className="font-medium text-[#2d2a4a] dark:text-white">
                      WhatsApp
                    </p>
                    <p className="text-sm text-[#5a5570] dark:text-gray-400">
                      Same number
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center py-8 text-muted-foreground">
            <p>© 2025 Your Company • Business Card Scanner Pro</p>
            <p className="text-sm mt-2">
              Made with <span className="text-red-500">♥</span> for exhibition
              teams
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
