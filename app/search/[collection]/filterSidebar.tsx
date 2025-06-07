"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";

interface Filters {
  collection: string[];
  gender: string[];
  price: { min: number; max: number };
  rating: number;
  onlyNew: boolean;
  onlyBestseller: boolean;
}

interface FilterSidebarProps {
  showFilters: boolean;
  filters: Filters;
  collections: { id: string; name: string }[];
  genders: string[];
  priceRange: { min: number; max: number };
  toggleFilter: (type: "collection" | "gender", value: string) => void;
  updatePriceRange: (min: number, max: number) => void;
  updateRating: (rating: number) => void;
  toggleBooleanFilter: (type: "onlyNew" | "onlyBestseller") => void;
  resetFilters: () => void;
}

// Animation variants
const sidebarVariants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

export default function FilterSidebar({
  showFilters,
  filters,
  collections,
  genders,
  toggleFilter,
  updatePriceRange,
  updateRating,
  toggleBooleanFilter,
  resetFilters,
  priceRange,
}: FilterSidebarProps) {
  return (
    <AnimatePresence mode="sync">
      <motion.aside
        className={`w-full md:w-64 lg:w-72 md:block transition-all duration-300 ${
          showFilters ? "block" : "hidden"
        }`}
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="sticky top-20 bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
          layout
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="flex justify-between items-center mb-6"
            variants={itemVariants}
          >
            <h2 className="text-lg font-medium">Filters</h2>
            <motion.button
              onClick={resetFilters}
              className="text-sm text-amber-600 hover:text-amber-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset All
            </motion.button>
          </motion.div>

          {/* Collections Filter */}
          <motion.div className="mb-6" variants={itemVariants}>
            <h3 className="text-md font-medium mb-2">Collections</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {collections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ x: 2 }}
                >
                  <motion.input
                    type="checkbox"
                    id={`collection-${collection.id}`}
                    checked={filters.collection.includes(collection.name)}
                    onChange={() => toggleFilter("collection", collection.name)}
                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <motion.label
                    htmlFor={`collection-${collection.id}`}
                    className="ml-2 text-sm text-gray-700"
                    animate={{
                      fontWeight: filters.collection.includes(collection.name)
                        ? 600
                        : 400,
                    }}
                  >
                    {collection.name}
                  </motion.label>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Gender Filter */}
          <motion.div className="mb-6" variants={itemVariants}>
            <h3 className="text-md font-medium mb-2">Gender</h3>
            <div className="space-y-2">
              {genders.map((gender, index) => (
                <motion.div
                  key={gender}
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  whileHover={{ x: 2 }}
                >
                  <input
                    type="checkbox"
                    id={`gender-${gender}`}
                    checked={filters.gender.includes(gender)}
                    onChange={() => toggleFilter("gender", gender)}
                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <motion.label
                    htmlFor={`gender-${gender}`}
                    className="ml-2 text-sm text-gray-700"
                    animate={{
                      fontWeight: filters.gender.includes(gender) ? 600 : 400,
                    }}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </motion.label>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Price Range Filter */}
          <motion.div className="mt-6" variants={itemVariants}>
            <h3 className="text-sm font-medium mb-2">Price Range</h3>
            <div className="flex items-center justify-between mb-2">
              <motion.span
                className="text-xs text-gray-500"
                animate={{
                  scale: [1, 1.1, 1],
                  color:
                    filters.price.min > priceRange.min ? "#f59e0b" : "#6b7280",
                }}
                transition={{ duration: 0.3 }}
              >
                ${filters.price.min}
              </motion.span>
              <motion.span
                className="text-xs text-gray-500"
                animate={{
                  scale: [1, 1.1, 1],
                  color:
                    filters.price.max < priceRange.max ? "#f59e0b" : "#6b7280",
                }}
                transition={{ duration: 0.3 }}
              >
                ${filters.price.max}
              </motion.span>
            </div>
            <motion.input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              step={(priceRange.max - priceRange.min) / 100}
              value={filters.price.min}
              onChange={(e) =>
                updatePriceRange(Number(e.target.value), filters.price.max)
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              whileHover={{ scale: 1.02 }}
            />
            <motion.input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              step={(priceRange.max - priceRange.min) / 100}
              value={filters.price.max}
              onChange={(e) =>
                updatePriceRange(filters.price.min, Number(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
              whileHover={{ scale: 1.02 }}
            />
          </motion.div>

          {/* Rating Filter */}
          <motion.div className="mb-6 mt-6" variants={itemVariants}>
            <h3 className="text-md font-medium mb-2">Rating</h3>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <motion.button
                  key={rating}
                  onClick={() =>
                    updateRating(filters.rating === rating ? 0 : rating)
                  }
                  className={`h-8 w-8 flex items-center justify-center rounded-full ${
                    filters.rating >= rating
                      ? "bg-amber-500 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: filters.rating >= rating ? 1.05 : 1,
                    opacity: 1,
                  }}
                  transition={{
                    delay: rating * 0.05,
                    type: "spring",
                    stiffness: 400,
                    damping: 10,
                  }}
                >
                  <Star
                    size={16}
                    fill={filters.rating >= rating ? "currentColor" : "none"}
                  />
                </motion.button>
              ))}
              {filters.rating > 0 && (
                <motion.span
                  className="text-sm text-gray-600"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                >
                  & Up
                </motion.span>
              )}
            </div>
          </motion.div>

          {/* Other Filters */}
          <motion.div className="mb-6" variants={itemVariants}>
            <h3 className="text-md font-medium mb-2">Other Filters</h3>
            <div className="space-y-2">
              <motion.div
                className="flex items-center"
                whileHover={{ x: 2 }}
                animate={{
                  backgroundColor: filters.onlyNew
                    ? "rgba(245, 158, 11, 0.1)"
                    : "transparent",
                  borderRadius: "4px",
                  padding: filters.onlyNew ? "4px" : "0px",
                }}
              >
                <input
                  type="checkbox"
                  id="only-new"
                  checked={filters.onlyNew}
                  onChange={() => toggleBooleanFilter("onlyNew")}
                  className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <motion.label
                  htmlFor="only-new"
                  className="ml-2 text-sm text-gray-700"
                  animate={{ fontWeight: filters.onlyNew ? 600 : 400 }}
                >
                  New Arrivals
                </motion.label>
              </motion.div>
              <motion.div
                className="flex items-center"
                whileHover={{ x: 2 }}
                animate={{
                  backgroundColor: filters.onlyBestseller
                    ? "rgba(245, 158, 11, 0.1)"
                    : "transparent",
                  borderRadius: "4px",
                  padding: filters.onlyBestseller ? "4px" : "0px",
                }}
              >
                <input
                  type="checkbox"
                  id="only-bestseller"
                  checked={filters.onlyBestseller}
                  onChange={() => toggleBooleanFilter("onlyBestseller")}
                  className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <motion.label
                  htmlFor="only-bestseller"
                  className="ml-2 text-sm text-gray-700"
                  animate={{ fontWeight: filters.onlyBestseller ? 600 : 400 }}
                >
                  Bestsellers
                </motion.label>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.aside>
    </AnimatePresence>
  );
}
