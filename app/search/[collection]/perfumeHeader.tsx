"use client";

import { motion } from "framer-motion";

interface PerfumeHeaderProps {
  toggleMobileFiltersAction: () => void;
  showFilters: boolean;
}

export default function PerfumeHeader({
  toggleMobileFiltersAction,
  showFilters,
}: PerfumeHeaderProps) {
  return (
    <>
      {/* Header with animation */}
      <motion.header
        className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-900/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-6">
          <motion.h1
            className="text-3xl font-bold text-gray-900 dark:text-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Luxury Perfumes
          </motion.h1>
          <motion.p
            className="mt-2 text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Discover your signature scent from our exquisite collection
          </motion.p>
        </div>
      </motion.header>

      {/* Mobile Filter Toggle Button with animation */}
      <motion.div
        className="md:hidden sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-900/30 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      >
        <motion.button
          onClick={toggleMobileFiltersAction}
          className="w-full py-2 px-4 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-md flex items-center justify-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ rotate: showFilters ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 6a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm4 6a1 1 0 011-1h6a1 1 0 010 2h-6a1 1 0 01-1-1z"
            />
          </motion.svg>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </motion.button>
      </motion.div>
    </>
  );
}
