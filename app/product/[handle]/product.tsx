"use client";

import { useCart } from "app/context/cartContext";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Info,
  RotateCcw,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";

// Interface for PerfumeImage to match MongoDB schema
interface PerfumeImage {
  url: string;
  alt: string;
}

// Interface for Perfume to match MongoDB schema
interface Perfume {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  discountPrice?: number;
  volume: string;
  stock: number;
  gender: "Male" | "Female" | "Unisex";
  images: PerfumeImage[];
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  collections?: string[];
}

// Client component that uses the useCart hook
export default function ProductClient({ product }: { product: Perfume }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-64 animate-pulse bg-gray-50 dark:bg-gray-800" />
      }
    >
      <ProductDescription product={product} />
    </Suspense>
  );
}

function ProductDescription({ product }: { product: Perfume }) {
  // Volume options - you might want to fetch these from an API or config
  const volumeOptions = ["30ml", "50ml", "100ml"];

  // Selected volume state (initialize with product's volume)
  const [selectedVolume, setSelectedVolume] = useState(product.volume);
  const [quantity, setQuantity] = useState(1);
  const [isWishListed, setIsWishListed] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  // Cart functionality with enhanced stock management
  const { addToCart, cart, getRemainingStock, isItemAvailable } = useCart();

  // Calculate available stock considering what's already in cart
  const currentCartQuantity =
    cart.find((item) => item._id === product._id)?.quantity || 0;
  const availableStock = Math.max(0, product.stock - currentCartQuantity);
  const isOutOfStock = availableStock <= 0;

  // Calculate discount percentage if discounted
  const discountPercentage = product.discountPrice
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  // Reset added-to-cart animation and error message after time
  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => setAddedToCart(false), 2000);
      return () => clearTimeout(timer);
    }

    if (stockError) {
      const timer = setTimeout(() => setStockError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [addedToCart, stockError]);

  // Handle add to cart with animation and stock checking
  const handleAddToCart = () => {
    if (isOutOfStock) {
      setStockError("This item is out of stock");
      return;
    }

    // Check if we can add the requested quantity
    if (quantity > availableStock) {
      setStockError(`Only ${availableStock} item(s) available`);
      // Adjust quantity to available stock
      setQuantity(availableStock);
      return;
    }

    // Use the updated addToCart function that returns success status
    const success = addToCart(product, quantity);

    if (success) {
      setAddedToCart(true);
    } else {
      setStockError("Couldn't add to cart - stock limit reached");
    }
  };

  // Handle quantity changes with stock awareness
  const incrementQuantity = () => {
    if (quantity < availableStock) {
      setQuantity(quantity + 1);
    } else {
      // Flash stock error message
      setStockError(`Maximum available: ${availableStock}`);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      // Clear error if we decrease below available stock
      if (stockError && quantity <= availableStock) {
        setStockError(null);
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Product Title and Brand - Enhanced with better spacing */}
      <div className="border-b border-gray-100 dark:border-gray-800 pb-6">
        <div className="flex items-center">
          {product.isNew && (
            <span className="ml-2 inline-block bg-green-100 dark:bg-green-900/30 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-green-800 dark:text-green-400 rounded-md">
              New
            </span>
          )}
        </div>

        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          {product.name}
        </h1>

        {/* Enhanced Price with animation on discount tag */}
        <div className="mt-4 flex items-center gap-3">
          {product.discountPrice ? (
            <>
              <p className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-white leading-none">
                Rs. {product.discountPrice.toFixed(2)}
              </p>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 line-through">
                Rs. {product.price.toFixed(2)}
              </p>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                }}
                className="bg-red-600 dark:bg-red-700 text-white px-2 py-1 rounded-md text-xs sm:text-sm font-bold"
              >
                SAVE {discountPercentage}%
              </motion.div>
            </>
          ) : (
            <p className="text-2xl sm:text-3xl font-medium text-gray-900 dark:text-white">
              Rs. {product.price.toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* Enhanced Rating with star animations and Stock Status */}
      <div className="flex items-center justify-between">
        {/* Animated Rating display */}
        {product.totalReviews > 0 ? (
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.div
                  key={star}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: star * 0.1 }}
                >
                  <Star
                    size={18}
                    className={`${
                      star <= Math.round(product.averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200 dark:text-gray-700"
                    } mr-0.5`}
                  />
                </motion.div>
              ))}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {product.averageRating.toFixed(1)}
            </span>
            <a
              href="#reviews"
              className="ml-1 text-sm text-amber-600 hover:text-amber-800 dark:text-amber-500 dark:hover:text-amber-400 hover:underline"
            >
              ({product.totalReviews}{" "}
              {product.totalReviews === 1 ? "review" : "reviews"})
            </a>
          </motion.div>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            No reviews yet
          </span>
        )}

        {/* Enhanced Stock status with icon and cart awareness */}
        <div className="text-sm flex items-center">
          {isOutOfStock ? (
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 dark:bg-red-600"></span>
              </span>
              {currentCartQuantity > 0 ? "Max in Cart" : "Out of Stock"}
            </span>
          ) : availableStock <= 5 ? (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-500 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 dark:bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 dark:bg-amber-600"></span>
              </span>
              Only {availableStock} available
              {currentCartQuantity > 0 && ` (${currentCartQuantity} in cart)`}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-500 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 dark:bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 dark:bg-green-600"></span>
              </span>
              In Stock
              {currentCartQuantity > 0 && ` (${currentCartQuantity} in cart)`}
            </span>
          )}
        </div>
      </div>

      {/* Product Tags in pills - Enhanced design with dark mode */}
      <div className="flex flex-wrap gap-2">
        {/* Gender tag */}
        <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 text-xs font-medium rounded-full flex items-center">
          {product.gender === "Male" && "Men's Fragrance"}
          {product.gender === "Female" && "Women's Fragrance"}
          {product.gender === "Unisex" && "Unisex Fragrance"}
        </div>

        {/* Status tags with better styling */}
        {product.isBestseller && (
          <div className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-500 text-xs font-medium rounded-full flex items-center">
            <Star size={12} className="mr-1" />
            Bestseller
          </div>
        )}
        {product.isFeatured && (
          <div className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium rounded-full flex items-center">
            Featured
          </div>
        )}
      </div>

      {/* Enhanced Volume Options with better styling */}
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Volume
          </label>
          <div className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {product.volume}
            </span>
          </div>
        </div>
      </div>

      {/* Stock Error Message */}
      {stockError && (
        <motion.div
          className="flex items-center p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 text-red-600 dark:text-red-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <AlertCircle size={16} className="mr-2" />
          <span className="text-sm">{stockError}</span>
        </motion.div>
      )}

      {/* Quantity control and Add to Cart - Enhanced with better design */}
      {!isOutOfStock && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Quantity
            </label>

            <div className="flex items-center h-12 rounded-md border border-gray-300 dark:border-gray-700 w-36">
              <button
                onClick={decrementQuantity}
                className={`flex-1 flex justify-center items-center h-full 
                  ${
                    quantity <= 1
                      ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  } 
                  transition-colors`}
                disabled={quantity <= 1}
              >
                <span className="text-xl font-medium">−</span>
              </button>

              <span className="flex-1 flex justify-center items-center h-full text-gray-800 dark:text-gray-200 font-medium border-l border-r border-gray-300 dark:border-gray-700">
                {quantity}
              </span>

              <button
                onClick={incrementQuantity}
                className={`flex-1 flex justify-center items-center h-full 
                  ${
                    quantity >= availableStock
                      ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  } 
                  transition-colors`}
                disabled={quantity >= availableStock}
                title={
                  quantity >= availableStock
                    ? `Maximum available: ${availableStock}`
                    : ""
                }
              >
                <span className="text-xl font-medium">+</span>
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-3.5 px-6 rounded-md font-medium text-white flex items-center justify-center gap-2 
                ${
                  addedToCart
                    ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                    : availableStock <= 0
                      ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                      : "bg-black dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700"
                } 
                transition-all duration-300`}
              onClick={handleAddToCart}
              disabled={availableStock <= 0}
            >
              {addedToCart ? (
                <>
                  Added <span className="ml-1">✓</span>
                </>
              ) : availableStock <= 0 ? (
                <>
                  <Info size={18} />
                  {currentCartQuantity > 0
                    ? "Max Quantity in Cart"
                    : "Out of Stock"}
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  Add to Cart
                </>
              )}
            </motion.button>
          </div>
        </div>
      )}

      {/* Out of Stock Button */}
      {isOutOfStock && (
        <button
          className="w-full py-3.5 font-medium text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-md cursor-not-allowed flex items-center justify-center gap-2"
          disabled
        >
          <Info size={18} />
          {currentCartQuantity > 0
            ? "Maximum Quantity in Cart"
            : "Out of Stock"}
        </button>
      )}

      {/* Enhanced Shipping and Return Info with icons */}
      <div className="flex flex-col gap-3 py-4 border-t border-b border-gray-100 dark:border-gray-800">
        <div className="flex gap-2 items-center">
          <Truck size={18} className="text-gray-400 dark:text-gray-500" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Free shipping</span> on orders over
            $50
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <RotateCcw size={18} className="text-gray-400 dark:text-gray-500" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">30-day returns</span> for unopened
            items
          </p>
        </div>
      </div>

      {/* Enhanced Description with better typography and section styling */}
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wider text-sm mb-3 flex items-center">
          <span className="w-6 h-0.5 bg-amber-500 dark:bg-amber-600 mr-2"></span>
          Description
        </h3>

        <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border border-gray-100 dark:border-gray-800">
          {product.description.split("\n").map((paragraph, idx) => (
            <p key={idx} className="mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
