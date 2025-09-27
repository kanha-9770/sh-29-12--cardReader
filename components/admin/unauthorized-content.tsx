"use client"

import { motion } from "framer-motion"
import { LockIcon, ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedContent() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white bg-opacity-5 backdrop-blur-md rounded-lg p-10 shadow-2xl max-w-md w-full text-center border border-white border-opacity-10"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotateY: 360 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 10 }}
        className="mb-8"
      >
        <LockIcon className="w-20 h-20 mx-auto text-red-400" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-4xl font-bold mb-6 text-white"
      >
        Access Denied
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-gray-300 mb-10 text-lg"
      >
        You are not authorized to access this page. Please log in with the appropriate credentials.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <Link
          href="/login"
          className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Return to Login
        </Link>
      </motion.div>
    </motion.div>
  )
}

