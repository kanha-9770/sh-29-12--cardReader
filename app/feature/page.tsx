// "use client";

// import {
//   Zap,
//   Shield,
//   Users,
//   BarChart3,
//   Layers,
//   Cloud,
//   CheckCircle,
//   Smartphone,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// export default function FeaturesPage() {
//   const features = [
//     {
//       icon: Zap,
//       title: "Lightning Fast Setup",
//       description:
//         "Get started in minutes with our simple, no-code setup. Deploy and scale your system effortlessly.",
//     },
//     {
//       icon: Shield,
//       title: "Enterprise-Grade Security",
//       description:
//         "Your data is protected with top-level encryption, role-based access, and 24/7 monitoring.",
//     },
//     {
//       icon: Users,
//       title: "Team Collaboration",
//       description:
//         "Invite team members, assign roles, and manage access easily — perfect for growing organizations.",
//     },
//     {
//       icon: BarChart3,
//       title: "Advanced Analytics",
//       description:
//         "Gain insights from real-time analytics and visual dashboards designed to help you make data-driven decisions.",
//     },
//     {
//       icon: Layers,
//       title: "Seamless Integrations",
//       description:
//         "Connect effortlessly with popular tools like Zoho, HubSpot, Google Sheets, and Slack.",
//     },
//     {
//       icon: Cloud,
//       title: "Cloud-Based Access",
//       description:
//         "Access your data anywhere, anytime — securely hosted and synced across all devices.",
//     },
//     {
//       icon: Smartphone,
//       title: "Mobile Friendly",
//       description:
//         "Use all core features on your phone or tablet with a fully responsive and optimized design.",
//     },
//     {
//       icon: CheckCircle,
//       title: "Reliable Support",
//       description:
//         "Get dedicated help whenever you need it — via chat, email, or call. We’re here for you 24/7.",
//     },
//   ];

//   // Motion variants
//   const fadeUp = {
//     hidden: { opacity: 0, y: 40 },
//     visible: (i: number) => ({
//       opacity: 1,
//       y: 0,
//       transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
//     }),
//   };

//   return (
//     <div className="min-h-screen bg-[#f3f1f8] overflow-hidden">
//       {/* Hero Section */}
//       <motion.section
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="py-20 text-center px-4"
//       >
//         <h1 className="text-4xl md:text-5xl font-bold text-[#2d2a4a] mb-4">
//           Powerful Features, Seamless Experience
//         </h1>
//         <p className="text-lg text-[#5a5570] max-w-2xl mx-auto mb-10">
//           Everything you need to manage, automate, and grow — built to simplify
//           your workflow and elevate productivity.
//         </p>
//         <Button className="bg-[#483d73] hover:bg-[#5a5570] text-white px-8 py-6 rounded-full text-lg">
//           Get Started Now
//         </Button>
//       </motion.section>

//       {/* Features Grid */}
//       <section className="py-16 bg-white">
//         <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl">
//           {features.map((feature, i) => (
//             <motion.div
//               key={i}
//               variants={fadeUp}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//               custom={i}
//             >
//               <Card
//                 className="bg-[#f3f1f8] border-none shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-2xl p-6 flex flex-col h-full"
//               >
//                 <CardHeader className="flex flex-col items-center text-center flex-grow">
//                   <div className="h-12 w-12 rounded-full bg-[#e5e2f0] flex items-center justify-center mb-4">
//                     <feature.icon className="h-6 w-6 text-[#483d73]" />
//                   </div>
//                   <CardTitle className="text-lg font-semibold text-[#2d2a4a] mb-2">
//                     {feature.title}
//                   </CardTitle>
//                   <CardContent className="p-0 flex-grow flex items-center justify-center">
//                     <p className="text-[#5a5570] text-sm text-center">
//                       {feature.description}
//                     </p>
//                   </CardContent>
//                 </CardHeader>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* CTA Section */}
//       <motion.section
//         initial={{ opacity: 0, y: 50 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8 }}
//         className="py-20 text-center bg-[#f3f1f8]"
//       >
//         <h2 className="text-3xl font-bold text-[#2d2a4a] mb-4">
//           Ready to Unlock These Features?
//         </h2>
//         <p className="text-[#5a5570] mb-8">
//           Join thousands of teams using our platform to simplify their
//           operations.
//         </p>
//         <Button className="bg-[#483d73] hover:bg-[#5a5570] text-white px-8 py-6 rounded-full text-lg transition-transform hover:scale-105">
//           Start Your Free Trial
//         </Button>
//       </motion.section>
//     </div>
//   );
// }


"use client";

import {
  Zap,
  Shield,
  Users,
  BarChart3,
  Layers,
  Cloud,
  CheckCircle,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function FeaturesPage() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Setup",
      description:
        "Get started in minutes with our simple, no-code setup. Deploy and scale your system effortlessly.",
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description:
        "Your data is protected with top-level encryption, role-based access, and 24/7 monitoring.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Invite team members, assign roles, and manage access easily — perfect for growing organizations.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Gain insights from real-time analytics and visual dashboards designed to help you make data-driven decisions.",
    },
    {
      icon: Layers,
      title: "Seamless Integrations",
      description:
        "Connect effortlessly with popular tools like Zoho, HubSpot, Google Sheets, and Slack.",
    },
    {
      icon: Cloud,
      title: "Cloud-Based Access",
      description:
        "Access your data anywhere, anytime — securely hosted and synced across all devices.",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description:
        "Use all core features on your phone or tablet with a fully responsive and optimized design.",
    },
    {
      icon: CheckCircle,
      title: "Reliable Support",
      description:
        "Get dedicated help whenever you need it — via chat, email, or call. We’re here for you 24/7.",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <div className="relative min-h-screen bg-[#f3f1f8] overflow-hidden">
      {/* Floating Background Shapes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2, y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute top-32 -left-20 w-96 h-96 bg-[#d6cff5] rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15, y: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
        className="absolute bottom-32 right-0 w-[500px] h-[500px] bg-[#e0daf6] rounded-full blur-3xl"
      />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-24 text-center px-4 z-10"
      >
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl mx-auto">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-[#2d2a4a] mb-6 leading-tight">
              Powerful Features, <br /> Seamless Experience
            </h1>
            <p className="text-lg text-[#5a5570] mb-8 max-w-lg mx-auto lg:mx-0">
              Everything you need to manage, automate, and grow — built to
              simplify your workflow and elevate productivity.
            </p>
            <Button className="bg-[#483d73] hover:bg-[#5a5570] text-white px-8 py-6 rounded-full text-lg shadow-md hover:shadow-lg transition-all">
              Get Started Now
            </Button>
          </div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex-1 flex justify-center"
          >
            <Image
              src="/img00.png"
              alt="Features Illustration"
              width={480}
              height={480}
              className="object-contain"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="py-20 bg-white relative z-10">
        <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              whileHover={{
                scale: 1.04,
                y: -6,
                boxShadow: "0px 10px 20px rgba(72, 61, 115, 0.2)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Card className="bg-[#f3f1f8] border-none shadow-sm rounded-2xl p-6 flex flex-col h-full">
                <CardHeader className="flex flex-col items-center text-center flex-grow">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="h-12 w-12 rounded-full bg-[#e5e2f0] flex items-center justify-center mb-4"
                  >
                    <feature.icon className="h-6 w-6 text-[#483d73]" />
                  </motion.div>
                  <CardTitle className="text-lg font-semibold text-[#2d2a4a] mb-2">
                    {feature.title}
                  </CardTitle>
                  <CardContent className="p-0 flex-grow flex items-center justify-center">
                    <p className="text-[#5a5570] text-sm text-center leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 text-center bg-[#f3f1f8] relative overflow-hidden z-10"
      >
        <h2 className="text-3xl font-bold text-[#2d2a4a] mb-4">
          Ready to Unlock These Features?
        </h2>
        <p className="text-[#5a5570] mb-8 max-w-2xl mx-auto">
          Join thousands of teams using our platform to simplify their
          operations and take their business to the next level.
        </p>
        <Button className="bg-[#483d73] hover:bg-[#5a5570] text-white px-8 py-6 rounded-full text-lg shadow-md hover:shadow-lg transition-all hover:scale-105">
          Start Your Free Trial
        </Button>
      </motion.section>
    </div>
  );
}
