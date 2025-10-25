"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CreditCard,
  Shield,
  Zap,
  Star,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .slide-in-left {
          animation: slideInLeft 0.6s ease-out forwards;
        }
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .bounce-in {
          animation: bounceIn 0.6s ease-out forwards;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
      `}</style>
      <div className=" bg-[#f3f1f8] pt-12">
        {/* Hero Section */}
        <section className="py-10 relative overflow-hidden fade-in-up">
          <div className="absolute inset-0 opacity-5 bg-cover bg-center" />
          <div className="container mx-auto px-4 relative">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 bg-[#e5e2f0] px-4 py-2 rounded-full text-sm text-[#2d2a4a] bounce-in">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#483d73]"></span>
                  New: Contactless Card Reader
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-[#2d2a4a] leading-tight">
                  Seamless Card Reading <br />
                  <span className="text-[#483d73]">For Modern Business</span>
                </h1>
                <p className="text-lg text-[#5a5570] max-w-lg">
                  Transform how you collect and manage business cards with our
                  elegant, efficient card reader. Designed for professionals who
                  value both style and substance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/pricing">
                  <Button
                    size="lg"
                    className="bg-[#483d73] hover:bg-[#5a5570] text-white px-8 transition-all duration-300 hover:scale-105"
                  >
                    Order Now
                  </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#483d73] text-[#483d73] hover:bg-[#f3f1f8] transition-all duration-300 hover:scale-105"
                  >
                    Watch Demo <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="relative aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#e5e2f0] to-[#b3adca] rounded-full opacity-50 blur-3xl"></div>
                  <Image
                    src="/card-01.png"
                    alt="CardSync Card Reader"
                    width={800}
                    height={800}
                    className="relative z-10 object-contain h-full float"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white fade-in-up">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2d2a4a] mb-4">
                Designed for Efficiency & Elegance
              </h2>
              <p className="text-[#5a5570] text-lg">
                Our card reader combines cutting-edge technology with minimalist
                design, making it the perfect addition to your professional
                toolkit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-md bg-[#f3f1f8] hover:shadow-lg transition-all duration-300 hover:scale-105 fade-in-up" style={{ animationDelay: '0.1s' }}>
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-full bg-[#e5e2f0] flex items-center justify-center mb-6">
                    <Zap className="h-6 w-6 text-[#483d73]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2d2a4a] mb-3">
                    Lightning Fast Scanning
                  </h3>
                  <p className="text-[#5a5570]">
                    Capture card details in under 2 seconds with our advanced
                    optical recognition technology.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-[#f3f1f8] hover:shadow-lg transition-all duration-300 hover:scale-105 fade-in-up" style={{ animationDelay: '0.2s' }}>
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-full bg-[#e5e2f0] flex items-center justify-center mb-6">
                    <Shield className="h-6 w-6 text-[#483d73]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2d2a4a] mb-3">
                    Secure Data Storage
                  </h3>
                  <p className="text-[#5a5570]">
                    All card information is encrypted and securely stored in our
                    cloud database with enterprise-level protection.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-[#f3f1f8] hover:shadow-lg transition-all duration-300 hover:scale-105 fade-in-up" style={{ animationDelay: '0.3s' }}>
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-full bg-[#e5e2f0] flex items-center justify-center mb-6">
                    <CreditCard className="h-6 w-6 text-[#483d73]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2d2a4a] mb-3">
                    Seamless Integration
                  </h3>
                  <p className="text-[#5a5570]">
                    Connect with your favorite CRM systems and contact management
                    tools with just a few clicks.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2d2a4a] mb-4">
                How CardSync Works
              </h2>
              <p className="text-[#5a5570] text-lg">
                A simple three-step process to transform your networking
                experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="text-center space-y-4 relative fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div className="h-16 w-16 rounded-full bg-[#e5e2f0] flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="text-2xl font-bold text-[#483d73]">1</span>
                </div>
                <h3 className="text-xl font-semibold text-[#2d2a4a]">
                  Scan the Card
                </h3>
                <p className="text-[#5a5570]">
                  Place the business card on the reader or use the mobile app to
                  capture an image.
                </p>
                <div className="hidden md:block absolute top-10 left-full w-24 h-0.5 bg-[#e5e2f0] -translate-x-6">
                  <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 text-[#d1cce2]" />
                </div>
              </div>

              <div className="text-center space-y-4 relative fade-in-up" style={{ animationDelay: '0.6s' }}>
                <div className="h-16 w-16 rounded-full bg-[#e5e2f0] flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="text-2xl font-bold text-[#483d73]">2</span>
                </div>
                <h3 className="text-xl font-semibold text-[#2d2a4a]">
                  Process Information
                </h3>
                <p className="text-[#5a5570]">
                  Our AI extracts all relevant details and organizes them into a
                  digital contact.
                </p>
                <div className="hidden md:block absolute top-10 left-full w-24 h-0.5 bg-[#e5e2f0] -translate-x-6">
                  <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 text-[#d1cce2]" />
                </div>
              </div>

              <div className="text-center space-y-4 fade-in-up" style={{ animationDelay: '0.7s' }}>
                <div className="h-16 w-16 rounded-full bg-[#e5e2f0] flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-[#483d73]">3</span>
                </div>
                <h3 className="text-xl font-semibold text-[#2d2a4a]">
                  Sync & Manage
                </h3>
                <p className="text-[#5a5570]">
                  Access your contacts from any device and integrate with your
                  existing tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2d2a4a] mb-4">
              Loved by Professionals
            </h2>
            <p className="text-[#5a5570] text-lg">
              See what our customers are saying about CardSync
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-[#e5e2f0] shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-[#e5e2f0] text-[#e5e2f0]"
                    />
                  ))}
                </div>
                <p className="text-[#5a5570] mb-6">
                  "CardSync has completely transformed how I manage contacts
                  after conferences. The elegant design fits perfectly with my
                  aesthetic, and the functionality is unmatched."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#e5e2f0] overflow-hidden">
                    <img
                      src="/placeholder.svg?height=100&width=100"
                      alt="Sarah Johnson"
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-[#2d2a4a]">Sarah Johnson</p>
                    <p className="text-sm text-[#483d73]">Marketing Director</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#e5e2f0] shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-[#e5e2f0] text-[#e5e2f0]"
                    />
                  ))}
                </div>
                <p className="text-[#5a5570] mb-6">
                  "As someone who attends multiple networking events monthly,
                  CardSync has saved me countless hours of manual data entry.
                  The nude color palette of the device is a bonus!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#e5e2f0] overflow-hidden">
                    <img
                      src="/placeholder.svg?height=100&width=100"
                      alt="Michael Chen"
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-[#2d2a4a]">Michael Chen</p>
                    <p className="text-sm text-[#483d73]">Sales Executive</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#e5e2f0] shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-[#e5e2f0] text-[#e5e2f0]"
                    />
                  ))}
                </div>
                <p className="text-[#5a5570] mb-6">
                  "The integration with our CRM system was seamless. CardSync
                  doesn't just look beautiful on my desk—it's become an
                  essential part of our business workflow."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#e5e2f0] overflow-hidden">
                    <img
                      src="/placeholder.svg?height=100&width=100"
                      alt="Amara Patel"
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-[#2d2a4a]">Amara Patel</p>
                    <p className="text-sm text-[#483d73]">Business Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

        {/* CTA Section */}
        <section className="py-20 bg-[#e5e2f0] fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-12 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold text-[#2d2a4a] mb-4">
                    Ready to Elevate Your Networking?
                  </h2>
                  <p className="text-[#5a5570] mb-8">
                    Join thousands of professionals who have transformed their
                    contact management with CardSync.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "30-day free trial",
                      "Free shipping",
                      "24/7 customer support",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 slide-in-left" style={{ animationDelay: `${0.9 + i * 0.1}s` }}>
                        <CheckCircle className="h-5 w-5 text-[#483d73]" />
                        <span className="text-[#2d2a4a]">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/form">
                  <Button
                    size="lg"
                    className="bg-[#483d73] hover:bg-[#5a5570] text-white w-full md:w-auto transition-all duration-300 hover:scale-105"
                  >
                    Get Your CardSync Now
                  </Button>
                  </Link>
                </div>
                <div className="md:w-1/2 bg-[#f3f1f8] flex items-center justify-center">
                  <Image
                    src="/card-05.png"
                    width={800}
                    height={800}
                    alt="CardSync Device"
                    className="h-full float"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}