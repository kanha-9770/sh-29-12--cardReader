"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Check,
  Star,
  Zap,
  Users,
  Building,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [expandedFeatures, setExpandedFeatures] = useState<{
    [key: string]: boolean;
  }>({});
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });

  const plans = [
    {
      name: "Free",
      description: "Get started instantly – no credit card required",
      price: "Free",
      icon: Sparkles,
      features: [
        "15 cards to scan & save",
        "Basic digital business card",
        "Mobile app access",
        "QR code sharing",
        "Export to contacts",
        "Basic analytics",
      ],
      cta: "Current Plan",
      popular: false,
      isFree: true,
    },
    {
      name: "Starter",
      description: "Perfect for individuals and small teams",
      monthlyPriceINR: 1999,
      annualPriceINR: 20390,
      icon: Zap,
      features: [
        "Up to 500 cards per month",
        "Basic CRM integration",
        "Mobile app access",
        "Cloud storage (5GB)",
        "Email support",
        "Basic analytics",
      ],
      popular: false,
    },
    {
      name: "Professional",
      description: "Ideal for growing businesses",
      monthlyPriceINR: 6999,
      annualPriceINR: 71390,
      icon: Users,
      features: [
        "Up to 2,000 cards per month",
        "Advanced CRM integrations",
        "Team collaboration",
        "Cloud storage (50GB)",
        "Priority support",
        "Advanced analytics",
        "Custom fields",
        "API access",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      monthlyPriceINR: 9999,
      annualPriceINR: 101990,
      icon: Building,
      features: [
        "Unlimited cards",
        "All CRM integrations",
        "Advanced team management",
        "Unlimited cloud storage",
        "24/7 phone support",
        "Custom analytics",
        "White-label options",
        "Dedicated account manager",
        "SSO integration",
        "Custom integrations",
      ],
      popular: false,
    },
  ];

  const getPrice = (plan: any) =>
    plan.isFree
      ? null
      : isAnnual
      ? Math.floor(plan.annualPriceINR / 12)
      : plan.monthlyPriceINR;

  const getAnnualTotal = (plan: any) => plan.annualPriceINR;

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const toggleFeatures = (planName: string) => {
    setExpandedFeatures((prev) => ({
      ...prev,
      [planName]: !prev[planName],
    }));
  };

  const handleCheckout = async (planName: string, price: number) => {
    try {
      setLoadingPlan(planName);
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName, price, currency: "INR" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Failed to start checkout");
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .bounce-in { animation: bounceIn 0.6s ease-out forwards; }
      `}</style>

      <div className="min-h-screen bg-[#f3f1f8] dark:bg-gray-900">
        {/* Hero Section */}
        <section className="py-10 text-center fade-in-up">
          <h1 className="text-3xl md:text-5xl font-bold text-[#2d2a4a] dark:text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#5a5570] dark:text-gray-400 max-w-2xl mx-auto mb-8 px-3">
            Choose the perfect plan. 15 Cards free to scan. No credit card
            required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${!isAnnual ? "text-[#2d2a4a] dark:text-white" : "text-[#5a5570] dark:text-gray-500"}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${isAnnual ? "bg-[#483d73]" : "bg-[#e5e2f0] dark:bg-gray-700"}`}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white transition-all ${isAnnual ? "translate-x-6" : "translate-x-1"}`} />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? "text-[#2d2a4a] dark:text-white" : "text-[#5a5570] dark:text-gray-500"}`}>
                Annual
              </span>
              {isAnnual && (
                <span className="bg-[#483d73] text-white text-xs px-2 py-1 rounded-full bounce-in">
                  Save 15%
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Mobile Carousel */}
<section className="py-10 bg-white dark:bg-gray-800 block md:hidden">
  <div className="relative w-full">
    <div className="overflow-hidden snap-x snap-mandatory" ref={emblaRef}>
      <div className="flex gap-5 px-5 py-2">
        {plans.map((plan, index) => {
          const isExpanded = expandedFeatures[plan.name] || false;
          return (
            <div key={index} className="flex-none w-[calc(120vw-4.5rem)] snap-start max-w-[500px] px-5">
              <Card className={`relative h-full min-h-[470px] flex flex-col border transition-all duration-200 rounded-xl shadow-lg ${
                plan.popular
                  ? "bg-[#aca8b6] dark:bg-gray-800 ring-2 ring-[#483d73] dark:ring-purple-500"
                  : plan.isFree
                  ? "border-gray-300 dark:border-gray-700 bg-gradient-to-br from-[#f9f8fb] to-white dark:from-gray-800 dark:to-gray-900"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}>
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-[#483d73] dark:bg-purple-600 text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg">
                      <Star className="h-3 w-3" fill="currentColor" /> Most Popular
                    </div>
                  </div>
                )}

                <CardHeader className="text-center pb-5 pt-6 flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-[#e5e2f0] dark:bg-gray-700 flex items-center justify-center mx-auto mb-3 shadow-md">
                    <plan.icon className="h-5 w-5 text-[#483d73] dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg font-bold text-[#2d2a4a] dark:text-white mb-1">
                    {plan.name}
                  </CardTitle>
                  <p className="text-[11px] leading-tight text-[#5a5570] dark:text-gray-400">
                    {plan.description}
                  </p>

                  {!plan.isFree ? (
                    <div className="mt-4">
                      <span className="text-2xl font-bold text-[#2d2a4a] dark:text-white">
                        ₹{getPrice(plan)}
                      </span>
                      <span className="text-[#5a5570] dark:text-gray-400 text-xs">/month</span>
                      {isAnnual && (
                        <p className="text-[10px] text-[#5a5570] dark:text-gray-400 mt-1">
                          Billed annually (₹{getAnnualTotal(plan)})
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-[#2d2a4a] dark:text-white">
                        {plan.price}
                      </span>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="flex flex-col justify-between text-center space-y-3 px-4 pb-4">
                  <ul className="space-y-2 flex-1 text-center">
                    {(isExpanded ? plan.features : plan.features.slice(0, 5)).map((f, i) => (
                      <li key={i} className="flex items-center justify-center gap-2 text-[11px] text-[#2d2a4a] dark:text-gray-300">
                        <Check className="h-4 w-4 text-[#483d73] dark:text-purple-400 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {plan.features.length > 5 && (
                      <li className="text-[10px] italic text-[#5a5570] dark:text-gray-500">
                        <span 
                          className="cursor-pointer underline hover:text-[#483d73] dark:hover:text-purple-400 transition"
                          onClick={() => toggleFeatures(plan.name)}
                        >
                          {isExpanded ? "Show less" : `+${plan.features.length - 5} more`}
                        </span>
                      </li>
                    )}
                  </ul>

                  {!plan.isFree ? (
                    <Button
                      disabled={loadingPlan === plan.name}
                      onClick={() => handleCheckout(plan.name, getPrice(plan)!)}
                      className={`w-full py-2 text-xs rounded-lg transition-all font-medium shadow-md ${
                        plan.popular
                          ? "bg-[#483d73] hover:bg-[#5a5570] dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
                          : "border-2 border-[#483d73] dark:border-purple-500 text-[#483d73] dark:text-purple-400 hover:bg-[#f3f1f8] dark:hover:bg-gray-700"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {loadingPlan === plan.name ? "Redirecting..." : "Upgrade Now"}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-[#483d73]/70 dark:bg-purple-600/70 text-white text-xs font-medium py-2 rounded-lg cursor-not-allowed opacity-90 shadow-md" 
                      disabled
                    >
                      {plan.cta}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>

    <button 
      onClick={scrollPrev} 
      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 z-20 active:scale-95 transition-all hover:scale-110"
    >
      <ChevronLeft className="w-4 h-4 text-[#483d73] dark:text-purple-400" />
    </button>
    <button 
      onClick={scrollNext} 
      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 z-20 active:scale-95 transition-all hover:scale-110"
    >
      <ChevronRight className="w-4 h-4 text-[#483d73] dark:text-purple-400" />
    </button>
  </div>
</section>

        {/* Desktop Grid */}
<section className="py-12 bg-white dark:bg-gray-800 hidden md:block fade-in-up">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
      {plans.map((plan, index) => (
        <Card
          key={index}
          className={`relative border-none shadow-lg transition-all hover:shadow-xl fade-in-up ${
            plan.popular
              ? "bg-[#f3f1f8] dark:bg-gray-800 ring-2 ring-[#483d73] dark:ring-purple-500 scale-105"
              : plan.isFree
              ? "bg-gradient-to-br from-[#f9f8fb] to-white dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-700"
              : "bg-white dark:bg-gray-800 hover:scale-105"
          }`}
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bounce-in">
              <div className="bg-[#483d73] dark:bg-purple-600 text-white px-4 py-1 rounded-full text-sm flex items-center gap-1 shadow-lg">
                <Star className="h-4 w-4" fill="currentColor" /> Most Popular
              </div>
            </div>
          )}

          <CardHeader className="text-center pb-6 pt-10">
            <div className="h-12 w-12 rounded-full bg-[#e5e2f0] dark:bg-gray-700 flex items-center justify-center mx-auto mb-4 shadow-md">
              <plan.icon className="h-6 w-6 text-[#483d73] dark:text-purple-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#2d2a4a] dark:text-white mb-2">
              {plan.name}
            </CardTitle>
            <p className="text-[#5a5570] dark:text-gray-400 mb-4 leading-relaxed">
              {plan.description}
            </p>

            {!plan.isFree ? (
              <div className="text-center">
                <span className="text-4xl font-bold text-[#2d2a4a] dark:text-white">
                  ₹{getPrice(plan)}
                </span>
                <span className="text-[#5a5570] dark:text-gray-400 text-lg">/month</span>
                {isAnnual && (
                  <p className="text-sm text-[#5a5570] dark:text-gray-400 mt-1 font-medium">
                    Billed annually (₹{getAnnualTotal(plan)})
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center">
                <span className="text-4xl font-bold text-[#2d2a4a] dark:text-white">
                  {plan.price}
                </span>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-10">
            <ul className="space-y-3">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-[#483d73] dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-[#2d2a4a] dark:text-gray-300 leading-relaxed">
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            {!plan.isFree ? (
              <Button
                disabled={loadingPlan === plan.name}
                onClick={() => handleCheckout(plan.name, getPrice(plan)!)}
                className={`w-full hover:scale-105 transition-all py-6 text-base font-medium rounded-xl shadow-md ${
                  plan.popular
                    ? "bg-[#483d73] hover:bg-[#5a5570] dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
                    : "border-2 border-[#483d73] dark:border-purple-500 text-[#483d73] dark:text-purple-400 hover:bg-[#f3f1f8] dark:hover:bg-gray-700"
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                {loadingPlan === plan.name ? "Redirecting..." : "Upgrade Now"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="w-full bg-[#483d73]/70 dark:bg-purple-600/70 text-white py-6 text-base font-medium rounded-xl cursor-not-allowed opacity-90 shadow-md"
                disabled
              >
                Current Plan
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>

        {/* Comparison Table */}
        <section className="py-10 bg-[#f3f1f8] dark:bg-gray-900 fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-7">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2d2a4a] dark:text-white mb-4">
                Compare Plans
              </h2>
              <p className="text-[#5a5570] dark:text-gray-400 text-sm sm:text-base lg:text-lg">
                See what's included in each plan to find the perfect fit for your needs
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <Card className="border-none shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm md:text-base">
                    <thead>
                      <tr className="border-b border-[#e5e2f0] dark:border-gray-700">
                        <th className="text-left p-3 sm:p-4 md:p-6 text-[#2d2a4a] dark:text-white font-semibold">
                          Features
                        </th>
                        <th className="text-center p-3 sm:p-4 md:p-6 text-[#2d2a4a] dark:text-white font-semibold">
                          Starter
                        </th>
                        <th className="text-center p-3 sm:p-4 md:p-6 text-[#2d2a4a] dark:text-white font-semibold">
                          Professional
                        </th>
                        <th className="text-center p-3 sm:p-4 md:p-6 text-[#2d2a4a] dark:text-white font-semibold">
                          Enterprise
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { feature: "Cards per month", starter: "500", pro: "2,000", enterprise: "Unlimited" },
                        { feature: "Cloud storage", starter: "5GB", pro: "50GB", enterprise: "Unlimited" },
                        { feature: "CRM integrations", starter: "Basic", pro: "Advanced", enterprise: "All" },
                        { feature: "Team collaboration", starter: "No", pro: "Yes", enterprise: "Yes" },
                        { feature: "API access", starter: "No", pro: "Yes", enterprise: "Yes" },
                        { feature: "Priority support", starter: "No", pro: "Yes", enterprise: "Yes" },
                        { feature: "Phone support", starter: "No", pro: "No", enterprise: "Yes" },
                        { feature: "Custom integrations", starter: "No", pro: "No", enterprise: "Yes" },
                      ].map((row, index) => (
                        <tr key={index} className="border-b border-[#e5e2f0] dark:border-gray-700 last:border-b-0 fade-in-up" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                          <td className="p-3 sm:p-4 md:p-6 text-[#2d2a4a] dark:text-gray-300 font-medium">
                            {row.feature}
                          </td>
                          <td className="p-3 sm:p-4 md:p-6 text-center text-[#5a5570] dark:text-gray-400">
                            {row.starter}
                          </td>
                          <td className="p-3 sm:p-4 md:p-6 text-center text-[#5a5570] dark:text-gray-400">
                            {row.pro}
                          </td>
                          <td className="p-3 sm:p-4 md:p-6 text-center text-[#5a5570] dark:text-gray-400">
                            {row.enterprise}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-10 bg-[#e5e2f0] dark:bg-gray-800 fade-in-up" style={{ animationDelay: "0.9s" }}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 p-12 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold text-[#2d2a4a] dark:text-white mb-4">
                    Ready to Transform Your Networking?
                  </h2>
                  <p className="text-[#5a5570] dark:text-gray-400 mb-5 text-sm sm:text-base lg:text-lg">
                    Start your free trial today and see why thousands of professionals trust CardSync.
                  </p>
                  <div className="flex flex-row items-center gap-3 max-w-full">
                    <Link href="/form">
                      <Button size="lg" className="bg-[#483d73] hover:bg-[#5a5570] text-white transition-all duration-300 hover:scale-105 px-3 py-1 text-sm sm:px-5 sm:py-2 sm:text-base">
                        Start Free Trial
                      </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="border-[#483d73] text-[#483d73] hover:bg-[#f3f1f8] transition-all duration-300 hover:scale-105 px-3 py-1 text-sm sm:px-5 sm:py-2 sm:text-base">
                      Schedule Demo
                    </Button>
                  </div>
                </div>
                <div className="md:w-1/3 bg-[#f3f1f8] dark:bg-gray-900 p-12 flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="h-16 w-16 text-[#483d73] mx-auto mb-4" />
                    <p className="text-[#2d2a4a] dark:text-white font-semibold">
                      15 Cards Free To Scan
                    </p>
                    <p className="text-[#5a5570] dark:text-gray-400 text-sm">
                      No credit card required
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
} 