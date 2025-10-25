// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Check,
//   Star,
//   Zap,
//   Users,
//   Building,
//   ArrowRight,
//   Shield,
// } from "lucide-react";

// export default function PricingPage() {
//   const [isAnnual, setIsAnnual] = useState(true);
//   const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

//   const plans = [
//     {
//       name: "Starter",
//       description: "Perfect for individuals and small teams",
//       monthlyPrice: 29,
//       annualPrice: 290,
//       icon: Zap,
//       features: [
//         "Up to 500 cards per month",
//         "Basic CRM integration",
//         "Mobile app access",
//         "Cloud storage (5GB)",
//         "Email support",
//         "Basic analytics",
//       ],
//       popular: false,
//     },
//     {
//       name: "Professional",
//       description: "Ideal for growing businesses",
//       monthlyPrice: 79,
//       annualPrice: 790,
//       icon: Users,
//       features: [
//         "Up to 2,000 cards per month",
//         "Advanced CRM integrations",
//         "Team collaboration",
//         "Cloud storage (50GB)",
//         "Priority support",
//         "Advanced analytics",
//         "Custom fields",
//         "API access",
//       ],
//       popular: true,
//     },
//     {
//       name: "Enterprise",
//       description: "For large organizations",
//       monthlyPrice: 199,
//       annualPrice: 1990,
//       icon: Building,
//       features: [
//         "Unlimited cards",
//         "All CRM integrations",
//         "Advanced team management",
//         "Unlimited cloud storage",
//         "24/7 phone support",
//         "Custom analytics",
//         "White-label options",
//         "Dedicated account manager",
//         "SSO integration",
//         "Custom integrations",
//       ],
//       popular: false,
//     },
//   ];

//   const handleCheckout = async (planName: string, price: number) => {
//     try {
//       setLoadingPlan(planName);
//       const res = await fetch("/api/create-checkout-session", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ planName, price }),
//       });

//       const data = await res.json();
//       if (data.url) {
//         window.location.href = data.url;
//       } else {
//         console.error("No checkout URL returned:", data);
//         alert("Failed to start checkout");
//       }
//     } catch (err) {
//       console.error("Checkout error:", err);
//       alert("Something went wrong while starting checkout.");
//     } finally {
//       setLoadingPlan(null);
//     }
//   };

//   const handleMainCTA = () => {
//     handleCheckout("Professional", isAnnual ? 65 : 79); // default to professional plan
//   };

//   return (
//     <div className="min-h-screen bg-[#f3f1f8]">
//       {/* Hero Section */}
//       <section className="py-16 text-center">
//         <h1 className="text-4xl md:text-5xl font-bold text-[#2d2a4a] mb-6">
//           Simple, Transparent Pricing
//         </h1>
//         <p className="text-lg text-[#5a5570] max-w-2xl mx-auto mb-8">
//           Choose the perfect plan for your business. All plans include a 30-day
//           free trial with no credit card required.
//         </p>

//         {/* Billing Toggle */}
//         <div className="flex items-center justify-center gap-4 mb-12">
//           <span
//             className={`text-sm font-medium ${
//               !isAnnual ? "text-[#2d2a4a]" : "text-[#5a5570]"
//             }`}
//           >
//             Monthly
//           </span>
//           <button
//             onClick={() => setIsAnnual(!isAnnual)}
//             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//               isAnnual ? "bg-[#483d73]" : "bg-[#e5e2f0]"
//             }`}
//           >
//             <span
//               className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                 isAnnual ? "translate-x-6" : "translate-x-1"
//               }`}
//             />
//           </button>
//           <span
//             className={`text-sm font-medium ${
//               isAnnual ? "text-[#2d2a4a]" : "text-[#5a5570]"
//             }`}
//           >
//             Annual
//           </span>
//           {isAnnual && (
//             <span className="bg-[#483d73] text-white text-xs px-2 py-1 rounded-full">
//               Save 17%
//             </span>
//           )}
//         </div>
//       </section>

//       {/* Pricing Cards */}
//       <section className="py-12 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//             {plans.map((plan, index) => (
//               <Card
//                 key={index}
//                 className={`relative border-none shadow-lg transition-all duration-300 hover:shadow-xl ${
//                   plan.popular
//                     ? "bg-[#f3f1f8] ring-2 ring-[#483d73] scale-105"
//                     : "bg-white hover:scale-105"
//                 }`}
//               >
//                 {plan.popular && (
//                   <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
//                     <div className="bg-[#483d73] text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
//                       <Star className="h-4 w-4" />
//                       Most Popular
//                     </div>
//                   </div>
//                 )}

//                 <CardHeader className="text-center pb-6">
//                   <div className="h-12 w-12 rounded-full bg-[#e5e2f0] flex items-center justify-center mx-auto mb-4">
//                     <plan.icon className="h-6 w-6 text-[#483d73]" />
//                   </div>
//                   <CardTitle className="text-2xl font-bold text-[#2d2a4a] mb-2">
//                     {plan.name}
//                   </CardTitle>
//                   <p className="text-[#5a5570] mb-4">{plan.description}</p>
//                   <div className="text-center">
//                     <span className="text-4xl font-bold text-[#2d2a4a]">
//                       $
//                       {isAnnual
//                         ? Math.floor(plan.annualPrice / 12)
//                         : plan.monthlyPrice}
//                     </span>
//                     <span className="text-[#5a5570]">/month</span>
//                     {isAnnual && (
//                       <p className="text-sm text-[#5a5570] mt-1">
//                         Billed annually (${plan.annualPrice})
//                       </p>
//                     )}
//                   </div>
//                 </CardHeader>

//                 <CardContent className="space-y-6">
//                   <ul className="space-y-3">
//                     {plan.features.map((feature, i) => (
//                       <li key={i} className="flex items-start gap-3">
//                         <Check className="h-5 w-5 text-[#483d73] flex-shrink-0 mt-0.5" />
//                         <span className="text-[#2d2a4a] text-sm">
//                           {feature}
//                         </span>
//                       </li>
//                     ))}
//                   </ul>

//                   <Button
//                     disabled={loadingPlan === plan.name}
//                     onClick={() =>
//                       handleCheckout(
//                         plan.name,
//                         isAnnual
//                           ? Math.floor(plan.annualPrice / 12)
//                           : plan.monthlyPrice
//                       )
//                     }
//                     className={`w-full ${
//                       plan.popular
//                         ? "bg-[#483d73] hover:bg-[#5a5570] text-white"
//                         : "border-[#483d73] text-[#483d73] hover:bg-[#f3f1f8]"
//                     }`}
//                     variant={plan.popular ? "default" : "outline"}
//                   >
//                     {loadingPlan === plan.name
//                       ? "Redirecting..."
//                       : "Start Free Trial"}
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>
//       {/* Features Comparison */}
//       <section className="py-16 bg-[#f3f1f8]">
//         <div className="container mx-auto px-4">
//           <div className="text-center max-w-3xl mx-auto mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-[#2d2a4a] mb-4">
//               Compare Plans
//             </h2>
//             <p className="text-[#5a5570] text-lg">
//               See what's included in each plan to find the perfect fit for your
//               needs
//             </p>
//           </div>

//           <div className="max-w-4xl mx-auto">
//             <Card className="border-none shadow-lg bg-white overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-[#e5e2f0]">
//                       <th className="text-left p-6 text-[#2d2a4a] font-semibold">
//                         Features
//                       </th>
//                       <th className="text-center p-6 text-[#2d2a4a] font-semibold">
//                         Starter
//                       </th>
//                       <th className="text-center p-6 text-[#2d2a4a] font-semibold">
//                         Professional
//                       </th>
//                       <th className="text-center p-6 text-[#2d2a4a] font-semibold">
//                         Enterprise
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {[
//                       {
//                         feature: "Cards per month",
//                         starter: "500",
//                         pro: "2,000",
//                         enterprise: "Unlimited",
//                       },
//                       {
//                         feature: "Cloud storage",
//                         starter: "5GB",
//                         pro: "50GB",
//                         enterprise: "Unlimited",
//                       },
//                       {
//                         feature: "CRM integrations",
//                         starter: "Basic",
//                         pro: "Advanced",
//                         enterprise: "All",
//                       },
//                       {
//                         feature: "Team collaboration",
//                         starter: "❌",
//                         pro: "✅",
//                         enterprise: "✅",
//                       },
//                       {
//                         feature: "API access",
//                         starter: "❌",
//                         pro: "✅",
//                         enterprise: "✅",
//                       },
//                       {
//                         feature: "Priority support",
//                         starter: "❌",
//                         pro: "✅",
//                         enterprise: "✅",
//                       },
//                       {
//                         feature: "Phone support",
//                         starter: "❌",
//                         pro: "❌",
//                         enterprise: "✅",
//                       },
//                       {
//                         feature: "Custom integrations",
//                         starter: "❌",
//                         pro: "❌",
//                         enterprise: "✅",
//                       },
//                     ].map((row, index) => (
//                       <tr
//                         key={index}
//                         className="border-b border-[#e5e2f0] last:border-b-0"
//                       >
//                         <td className="p-6 text-[#2d2a4a] font-medium">
//                           {row.feature}
//                         </td>
//                         <td className="p-6 text-center text-[#5a5570]">
//                           {row.starter}
//                         </td>
//                         <td className="p-6 text-center text-[#5a5570]">
//                           {row.pro}
//                         </td>
//                         <td className="p-6 text-center text-[#5a5570]">
//                           {row.enterprise}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </section>
//       {/* FAQ Section */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center max-w-3xl mx-auto mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-[#2d2a4a] mb-4">
//               Pricing FAQ
//             </h2>
//           </div>

//           <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div>
//               <h3 className="text-lg font-semibold text-[#2d2a4a] mb-3">
//                 Can I change plans anytime?
//               </h3>{" "}
//               <p className="text-[#5a5570]">
//                 Yes, you can upgrade or downgrade your plan at any time. Changes
//                 take effect immediately.
//               </p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-[#2d2a4a] mb-3">
//                 What payment methods do you accept?
//               </h3>
//               <p className="text-[#5a5570]">
//                 We accept all major credit cards, PayPal, and bank transfers for
//                 annual plans.
//               </p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-[#2d2a4a] mb-3">
//                 Is there a setup fee?
//               </h3>
//               <p className="text-[#5a5570]">
//                 No setup fees. The device is included with your subscription at
//                 no additional cost.
//               </p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-[#2d2a4a] mb-3">
//                 What happens after the trial?
//               </h3>
//               <p className="text-[#5a5570]">
//                 Your trial automatically converts to a paid plan. Cancel anytime
//                 during the trial with no charges.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 bg-[#e5e2f0]">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
//             <div className="flex flex-col md:flex-row">
//               <div className="md:w-2/3 p-12 flex flex-col justify-center">
//                 <h2 className="text-3xl font-bold text-[#2d2a4a] mb-4">
//                   Ready to Transform Your Networking?
//                 </h2>
//                 <p className="text-[#5a5570] mb-8">
//                   Start your free trial today and see why thousands of
//                   professionals trust CardSync.
//                 </p>
//                 <div className="flex flex-col sm:flex-row gap-4">
//                   <Button
//                     size="lg"
//                     disabled={loadingPlan === "Professional"}
//                     onClick={handleMainCTA}
//                     className="bg-[#483d73] hover:bg-[#5a5570] text-white"
//                   >
//                     {loadingPlan === "Professional"
//                       ? "Redirecting..."
//                       : "Start Free Trial"}
//                   </Button>
//                   <Button
//                     size="lg"
//                     variant="outline"
//                     className="border-[#483d73] text-[#483d73] hover:bg-[#f3f1f8]"
//                   >
//                     Schedule Demo
//                   </Button>
//                 </div>
//               </div>
//               <div className="md:w-1/3 bg-[#f3f1f8] p-12 flex items-center justify-center">
//                 <div className="text-center">
//                   <Shield className="h-16 w-16 text-[#483d73] mx-auto mb-4" />
//                   <p className="text-[#2d2a4a] font-semibold">
//                     30-Day Free Trial
//                   </p>
//                   <p className="text-[#5a5570] text-sm">
//                     No credit card required
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Check,
  Star,
  Zap,
  Users,
  Building,
  ArrowRight,
  Shield,
} from "lucide-react";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals and small teams",
      monthlyPrice: 29,
      annualPrice: 290,
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
      monthlyPrice: 79,
      annualPrice: 790,
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
      monthlyPrice: 199,
      annualPrice: 1990,
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

  const handleCheckout = async (planName: string, price: number) => {
    try {
      setLoadingPlan(planName);
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName, price }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned:", data);
        alert("Failed to start checkout");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong while starting checkout.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleMainCTA = () => {
    handleCheckout("Professional", isAnnual ? 65 : 79); // default to professional plan
  };

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
      `}</style>
      <div className="min-h-screen bg-[#f3f1f8]">
        {/* Hero Section */}
        <section className="py-16 text-center fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2d2a4a] mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-[#5a5570] max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your business. All plans include a 30-day
            free trial with no credit card required.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span
              className={`text-sm font-medium ${
                !isAnnual ? "text-[#2d2a4a]" : "text-[#5a5570]"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                isAnnual ? "bg-[#483d73]" : "bg-[#e5e2f0]"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ${
                  isAnnual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                isAnnual ? "text-[#2d2a4a]" : "text-[#5a5570]"
              }`}
            >
              Annual
            </span>
            {isAnnual && (
              <span className="bg-[#483d73] text-white text-xs px-2 py-1 rounded-full bounce-in">
                Save 17%
              </span>
            )}
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12 bg-white fade-in-up">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative border-none shadow-lg transition-all duration-300 hover:shadow-xl fade-in-up ${plan.popular
                    ? "bg-[#f3f1f8] ring-2 ring-[#483d73] scale-105"
                    : "bg-white hover:scale-105"
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bounce-in">
                      <div className="bg-[#483d73] text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <CardHeader className="text-center pb-6">
                    <div className="h-12 w-12 rounded-full bg-[#e5e2f0] flex items-center justify-center mx-auto mb-4">
                      <plan.icon className="h-6 w-6 text-[#483d73]" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-[#2d2a4a] mb-2">
                      {plan.name}
                    </CardTitle>
                    <p className="text-[#5a5570] mb-4">{plan.description}</p>
                    <div className="text-center">
                      <span className="text-4xl font-bold text-[#2d2a4a]">
                        $
                        {isAnnual
                          ? Math.floor(plan.annualPrice / 12)
                          : plan.monthlyPrice}
                      </span>
                      <span className="text-[#5a5570]">/month</span>
                      {isAnnual && (
                        <p className="text-sm text-[#5a5570] mt-1">
                          Billed annually (${plan.annualPrice})
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 slide-in-left" style={{ animationDelay: `${i * 0.1}s` }}>
                          <Check className="h-5 w-5 text-[#483d73] flex-shrink-0 mt-0.5" />
                          <span className="text-[#2d2a4a] text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      disabled={loadingPlan === plan.name}
                      onClick={() =>
                        handleCheckout(
                          plan.name,
                          isAnnual
                            ? Math.floor(plan.annualPrice / 12)
                            : plan.monthlyPrice
                        )
                      }
                      className={`w-full transition-all duration-300 hover:scale-105 ${
                        plan.popular
                          ? "bg-[#483d73] hover:bg-[#5a5570] text-white"
                          : "border-[#483d73] text-[#483d73] hover:bg-[#f3f1f8]"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {loadingPlan === plan.name
                        ? "Redirecting..."
                        : "Start Free Trial"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        {/* Features Comparison */}
        <section className="py-16 bg-[#f3f1f8] fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2d2a4a] mb-4">
                Compare Plans
              </h2>
              <p className="text-[#5a5570] text-lg">
                See what's included in each plan to find the perfect fit for your
                needs
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="border-none shadow-lg bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#e5e2f0]">
                        <th className="text-left p-6 text-[#2d2a4a] font-semibold">
                          Features
                        </th>
                        <th className="text-center p-6 text-[#2d2a4a] font-semibold">
                          Starter
                        </th>
                        <th className="text-center p-6 text-[#2d2a4a] font-semibold">
                          Professional
                        </th>
                        <th className="text-center p-6 text-[#2d2a4a] font-semibold">
                          Enterprise
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          feature: "Cards per month",
                          starter: "500",
                          pro: "2,000",
                          enterprise: "Unlimited",
                        },
                        {
                          feature: "Cloud storage",
                          starter: "5GB",
                          pro: "50GB",
                          enterprise: "Unlimited",
                        },
                        {
                          feature: "CRM integrations",
                          starter: "Basic",
                          pro: "Advanced",
                          enterprise: "All",
                        },
                        {
                          feature: "Team collaboration",
                          starter: "❌",
                          pro: "✅",
                          enterprise: "✅",
                        },
                        {
                          feature: "API access",
                          starter: "❌",
                          pro: "✅",
                          enterprise: "✅",
                        },
                        {
                          feature: "Priority support",
                          starter: "❌",
                          pro: "✅",
                          enterprise: "✅",
                        },
                        {
                          feature: "Phone support",
                          starter: "❌",
                          pro: "❌",
                          enterprise: "✅",
                        },
                        {
                          feature: "Custom integrations",
                          starter: "❌",
                          pro: "❌",
                          enterprise: "✅",
                        },
                      ].map((row, index) => (
                        <tr
                          key={index}
                          className="border-b border-[#e5e2f0] last:border-b-0 fade-in-up"
                          style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                        >
                          <td className="p-6 text-[#2d2a4a] font-medium">
                            {row.feature}
                          </td>
                          <td className="p-6 text-center text-[#5a5570]">
                            {row.starter}
                          </td>
                          <td className="p-6 text-center text-[#5a5570]">
                            {row.pro}
                          </td>
                          <td className="p-6 text-center text-[#5a5570]">
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
        {/* FAQ Section */}
        <section className="py-16 bg-white fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2d2a4a] mb-4">
                Pricing FAQ
              </h2>
            </div>

            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="fade-in-up" style={{ animationDelay: '0.7s' }}>
                <h3 className="text-lg font-semibold text-[#2d2a4a] mb-3">
                  Can I change plans anytime?
                </h3>{" "}
                <p className="text-[#5a5570]">
                  Yes, you can upgrade or downgrade your plan at any time. Changes
                  take effect immediately.
                </p>
              </div>
              <div className="fade-in-up" style={{ animationDelay: '0.7s' }}>
                <h3 className="text-lg font-semibold text-[#2d2a4a] mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-[#5a5570]">
                  We accept all major credit cards, PayPal, and bank transfers for
                  annual plans.
                </p>
              </div>
              <div className="fade-in-up" style={{ animationDelay: '0.8s' }}>
                <h3 className="text-lg font-semibold text-[#2d2a4a] mb-3">
                  Is there a setup fee?
                </h3>
                <p className="text-[#5a5570]">
                  No setup fees. The device is included with your subscription at
                  no additional cost.
                </p>
              </div>
              <div className="fade-in-up" style={{ animationDelay: '0.8s' }}>
                <h3 className="text-lg font-semibold text-[#2d2a4a] mb-3">
                  What happens after the trial?
                </h3>
                <p className="text-[#5a5570]">
                  Your trial automatically converts to a paid plan. Cancel anytime
                  during the trial with no charges.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#e5e2f0] fade-in-up" style={{ animationDelay: '0.9s' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 p-12 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold text-[#2d2a4a] mb-4">
                    Ready to Transform Your Networking?
                  </h2>
                  <p className="text-[#5a5570] mb-8">
                    Start your free trial today and see why thousands of
                    professionals trust CardSync.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      disabled={loadingPlan === "Professional"}
                      onClick={handleMainCTA}
                      className="bg-[#483d73] hover:bg-[#5a5570] text-white transition-all duration-300 hover:scale-105"
                    >
                      {loadingPlan === "Professional"
                        ? "Redirecting..."
                        : "Start Free Trial"}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-[#483d73] text-[#483d73] hover:bg-[#f3f1f8] transition-all duration-300 hover:scale-105"
                    >
                      Schedule Demo
                    </Button>
                  </div>
                </div>
                <div className="md:w-1/3 bg-[#f3f1f8] p-12 flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="h-16 w-16 text-[#483d73] mx-auto mb-4" />
                    <p className="text-[#2d2a4a] font-semibold">
                      30-Day Free Trial
                    </p>
                    <p className="text-[#5a5570] text-sm">
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