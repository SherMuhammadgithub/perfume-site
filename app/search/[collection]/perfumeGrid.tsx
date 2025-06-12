"use client";

import { useCart } from "app/context/cartContext";
import { AnimatePresence, motion } from "framer-motion";
import { Perfume } from "lib/interfaces/data.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PerfumeGridProps {
  filteredPerfumes: Perfume[];
  sortOption: string;
  handleSortChangeAction: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  resetFiltersAction: () => void;
}

// Animation variants
const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 12,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export default function PerfumeGrid({
  filteredPerfumes,
  sortOption,
  handleSortChangeAction,
  resetFiltersAction,
}: PerfumeGridProps) {
  const { addToCart, cart } = useCart();
  const router = useRouter();
  const [addedToCart, setAddedToCart] = useState<{ [key: string]: boolean }>(
    {}
  );

  const goToProductPage = (id: string) => {
    router.push(`/product/${id}`);
  };

  const handleAddToCart = (perfume: Perfume) => {
    // Check stock before adding to cart
    if (perfume.stock <= 0) {
      return; // Don't add if out of stock
    }

    // Check how many of this item are already in cart
    const itemInCart = cart.find((item) => item._id === perfume._id);
    const currentQuantityInCart = itemInCart ? itemInCart.quantity : 0;

    // Don't add if adding one more would exceed available stock
    if (currentQuantityInCart >= perfume.stock) {
      return;
    }

    addToCart(perfume);
    // Show "Added" animation
    setAddedToCart({ ...addedToCart, [perfume._id]: true });
    setTimeout(() => {
      setAddedToCart({ ...addedToCart, [perfume._id]: false });
    }, 1500);
  };

  // Helper function to check if item is out of stock or max quantity reached
  const isItemMaxedOut = (perfume: Perfume): boolean => {
    if (perfume.stock <= 0) return true;

    const itemInCart = cart.find((item) => item._id === perfume._id);
    const currentQuantityInCart = itemInCart ? itemInCart.quantity : 0;

    return currentQuantityInCart >= perfume.stock;
  };

  // Helper function to get button text based on stock
  const getButtonText = (perfume: Perfume): string => {
    if (addedToCart[perfume._id]) {
      return "✓ Added to Cart";
    }

    if (perfume.stock <= 0) {
      return "Out of Stock";
    }

    const itemInCart = cart.find((item) => item._id === perfume._id);
    const currentQuantityInCart = itemInCart ? itemInCart.quantity : 0;

    if (currentQuantityInCart >= perfume.stock) {
      return "Max Quantity Reached";
    }

    return "Add to Cart";
  };

  return (
    <motion.div
      className="flex-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sort and Results Count */}
      <motion.div
        className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.p
          className="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-0"
          animate={{
            scale: filteredPerfumes.length > 0 ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 0.5 }}
        >
          Showing <span className="font-medium">{filteredPerfumes.length}</span>{" "}
          products
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label className="text-sm text-gray-500 dark:text-gray-400 mr-2">
            Sort by:
          </label>
          <motion.select
            value={sortOption}
            onChange={handleSortChangeAction}
            className="text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </motion.select>
        </motion.div>
      </motion.div>

      {/* Products Grid */}
      {filteredPerfumes.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
          layout
        >
          <AnimatePresence mode="sync">
            {filteredPerfumes?.map((perfume) => {
              const isOutOfStock = perfume.stock <= 0;
              const isMaxedOut = isItemMaxedOut(perfume);

              return (
                <motion.div
                  key={perfume._id}
                  className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/10 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/20 transition-shadow duration-300"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout={false}
                  layoutId={`perfume-${perfume._id}`}
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className="aspect-w-4 aspect-h-5 relative"
                    onClick={() => goToProductPage(perfume._id)}
                    style={{ cursor: "pointer" }}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="h-64 relative bg-gray-50 dark:bg-gray-700">
                      {perfume.images && perfume.images.length > 0 ? (
                        <Image
                          src={perfume.images[0]?.url || "/placeholder.png"}
                          alt={perfume.images[0]?.alt || perfume.name}
                          fill
                          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className={`object-contain object-center p-2 ${
                            isOutOfStock ? "opacity-70" : ""
                          }`}
                          priority={false}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-600 bg-gradient-to-b from-transparent to-gray-100 dark:to-gray-700 flex items-center justify-center">
                          <span className="text-2xl font-light text-gray-500 dark:text-gray-400">
                            {perfume.name}
                          </span>
                        </div>
                      )}

                      {/* Animated Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
                        {perfume.isNew && (
                          <motion.span
                            className="bg-black dark:bg-gray-900 text-center text-white text-xs px-2 py-1 rounded-full"
                            initial={{ opacity: 0, scale: 0.8, x: -20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ type: "spring" }}
                          >
                            New
                          </motion.span>
                        )}
                        {perfume.isBestseller && (
                          <motion.span
                            className="bg-amber-500 text-center text-white text-xs px-2 py-1 rounded-full"
                            initial={{ opacity: 0, scale: 0.8, x: -20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ type: "spring", delay: 0.1 }}
                          >
                            Bestseller
                          </motion.span>
                        )}
                        {isOutOfStock && (
                          <motion.span
                            className="bg-red-500 text-center text-white text-xs px-2 py-1 rounded-full"
                            initial={{ opacity: 0, scale: 0.8, x: -20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ type: "spring", delay: 0.2 }}
                          >
                            Out of Stock
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {perfume.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {perfume.brand}
                    </p>
                    <motion.div
                      className="mt-2 flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ${
                            i < Math.floor(perfume.averageRating)
                              ? "text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </motion.svg>
                      ))}
                      <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                        {perfume.averageRating}
                      </span>
                    </motion.div>
                    <motion.div
                      className="mt-2 flex justify-between items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {perfume.discountPrice !== undefined &&
                      perfume.discountPrice !== null ? (
                        <div className="flex items-center space-x-2">
                          <motion.p
                            className="text-lg font-medium text-red-600 dark:text-red-400"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            Rs.{" "}
                            {(typeof perfume.discountPrice === "number"
                              ? perfume.discountPrice
                              : parseFloat(String(perfume.discountPrice))
                            ).toFixed(2)}
                          </motion.p>
                          <motion.p
                            className="text-sm text-gray-500 dark:text-gray-400 line-through"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.8 }}
                          >
                            Rs.{" "}
                            {(typeof perfume.price === "number"
                              ? perfume.price
                              : parseFloat(String(perfume.price))
                            ).toFixed(2)}
                          </motion.p>
                        </div>
                      ) : (
                        <motion.p
                          className="text-lg font-medium text-gray-900 dark:text-gray-100"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          Rs.{" "}
                          {(typeof perfume.price === "number"
                            ? perfume.price
                            : parseFloat(String(perfume.price))
                          ).toFixed(2)}
                        </motion.p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {perfume.volume}{" "}
                        {perfume.stock > 0 && (
                          <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                            ({perfume.stock} in stock)
                          </span>
                        )}
                      </p>
                    </motion.div>
                    <motion.div
                      className="mt-3 flex gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                        {perfume.category}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                        {perfume.gender}
                      </span>
                    </motion.div>
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.button
                        className={`w-full ${
                          addedToCart[perfume._id]
                            ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                            : isMaxedOut
                              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                              : "bg-black dark:bg-gray-900 hover:bg-gray-700 dark:hover:bg-gray-800"
                        } text-white py-2 px-4 rounded-md transition-colors duration-200`}
                        onClick={() => handleAddToCart(perfume)}
                        whileHover={!isMaxedOut ? { scale: 1.02 } : {}}
                        whileTap={!isMaxedOut ? { scale: 0.98 } : {}}
                        disabled={isMaxedOut}
                      >
                        {getButtonText(perfume)}
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </motion.svg>
          <motion.h3
            className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            No products found
          </motion.h3>
          <motion.p
            className="mt-1 text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Try adjusting your filters to find what you're looking for.
          </motion.p>
          <motion.button
            onClick={resetFiltersAction}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black dark:bg-gray-900 hover:bg-gray-700 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Clear All Filters
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
