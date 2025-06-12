"use client";

import { useCart } from "app/context/cartContext";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    getRemainingStock,
    isItemAvailable,
  } = useCart();

  const cartRef = useRef<HTMLDivElement>(null);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);

  // Prevent scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Handle quantity updates with loading state
  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    setUpdateLoading(id);
    const success = updateQuantity(id, newQuantity);

    // Small delay to show loading state
    setTimeout(() => {
      setUpdateLoading(null);

      if (!success) {
        console.log("Could not update quantity - stock limit reached");
      }
    }, 300);
  };

  // Define variants for animations
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, delay: 0.1 },
    },
  };

  const drawerVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 30,
      },
    },
    exit: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 30,
        delay: 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 },
    },
  };

  const listVariants = {
    visible: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  };

  // Detect swipe to close
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      closeCart();
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop with glass effect */}
          <motion.div
            className="absolute inset-0 backdrop-blur-sm bg-black/30"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeCart}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <motion.div
              ref={cartRef}
              className="w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl flex flex-col"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              dragDirectionLock
            >
              {/* Cart Header */}
              <motion.div
                className="px-4 py-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.h2
                  className="text-lg font-medium text-gray-900 dark:text-white tracking-wide flex items-center"
                  layoutId="cartTitle"
                >
                  <motion.div
                    className="mr-2"
                    animate={{
                      rotate: [0, -10, 10, -5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <ShoppingBag className="h-5 w-5" />
                  </motion.div>
                  Your Cart ({totalItems})
                </motion.h2>
                <motion.button
                  onClick={closeCart}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 transition-colors p-2"
                  aria-label="Close cart"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </motion.div>

              {/* Cart Items */}
              <motion.div
                className="flex-1 overflow-y-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {cart.length === 0 ? (
                  <motion.div
                    className="p-8 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                  >
                    <motion.div
                      className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500 mb-4 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full"
                      initial={{ rotate: -5 }}
                      animate={{
                        rotate: [0, -5, 5, 0],
                        scale: [1, 0.98, 1.02, 1],
                      }}
                      transition={{ duration: 2, delay: 0.5, repeat: 0 }}
                    >
                      <ShoppingBag className="h-10 w-10" />
                    </motion.div>
                    <motion.h3
                      className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      Your cart is empty
                    </motion.h3>
                    <motion.p
                      className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      Start adding items to your cart
                    </motion.p>
                    <motion.div
                      className="mt-6"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <motion.button
                        onClick={closeCart}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 focus:outline-none"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Continue Shopping
                      </motion.button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.ul
                    className="divide-y divide-gray-200 dark:divide-gray-700"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <AnimatePresence initial={false}>
                      {cart.map((item: any) => {
                        const isAtMaxStock = item.quantity >= item.stock;
                        const isLowStock =
                          item.stock <= 5 && item.quantity < item.stock;

                        return (
                          <motion.li
                            key={item._id}
                            className="py-5 px-4"
                            variants={itemVariants}
                            layout
                            exit={{
                              opacity: 0,
                              x: 100,
                              transition: { duration: 0.2 },
                            }}
                          >
                            <div className="flex items-center">
                              {/* Product Image */}
                              <motion.div
                                className="flex-shrink-0 w-20 h-20 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <img
                                  src={item.image || ""}
                                  alt={item.name}
                                  className="w-full h-full object-center object-cover"
                                />
                              </motion.div>

                              {/* Product Info */}
                              <div className="ml-4 flex-1">
                                <div className="flex justify-between">
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                      {item.name}
                                    </h3>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                      {item.brand}
                                    </p>
                                    {item.volume && (
                                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {item.volume}
                                      </p>
                                    )}
                                    {/* Stock indicator */}
                                    <AnimatePresence mode="wait">
                                      {isLowStock && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -5 }}
                                          className="mt-1 text-xs text-amber-600 dark:text-amber-500 flex items-center"
                                        >
                                          <motion.span
                                            animate={{
                                              scale: [1, 1.2, 1],
                                              opacity: [1, 0.8, 1],
                                            }}
                                            transition={{
                                              repeat: Infinity,
                                              repeatType: "reverse",
                                              duration: 2,
                                            }}
                                          >
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                          </motion.span>
                                          Only {item.stock - item.quantity} left
                                        </motion.p>
                                      )}
                                      {isAtMaxStock && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -5 }}
                                          className="mt-1 text-xs text-red-600 dark:text-red-500 flex items-center"
                                        >
                                          <motion.span
                                            animate={{
                                              scale: [1, 1.2, 1],
                                              opacity: [1, 0.8, 1],
                                            }}
                                            transition={{
                                              repeat: Infinity,
                                              repeatType: "reverse",
                                              duration: 2,
                                            }}
                                          >
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                          </motion.span>
                                          Max stock reached
                                        </motion.p>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                  <motion.p
                                    className="text-sm font-medium text-gray-900 dark:text-white"
                                    key={`price-${item.quantity}`}
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    Rs.{" "}
                                    {(item.price * item.quantity).toFixed(2)}
                                  </motion.p>
                                </div>

                                {/* Quantity Control and Remove */}
                                <div className="mt-2 flex justify-between items-center">
                                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                                    <motion.button
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          item._id,
                                          item.quantity - 1
                                        )
                                      }
                                      className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50"
                                      aria-label="Decrease quantity"
                                      disabled={updateLoading === item._id}
                                      whileHover={{
                                        backgroundColor: "#f3f4f6",
                                      }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </motion.button>
                                    <motion.span
                                      className="px-2 text-sm text-gray-900 dark:text-white"
                                      key={`qty-${item.quantity}`}
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      {updateLoading === item._id
                                        ? "..."
                                        : item.quantity}
                                    </motion.span>
                                    <motion.button
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          item._id,
                                          item.quantity + 1
                                        )
                                      }
                                      className={`p-1 ${
                                        isAtMaxStock
                                          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                          : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                      }`}
                                      aria-label="Increase quantity"
                                      disabled={
                                        isAtMaxStock ||
                                        updateLoading === item._id
                                      }
                                      title={
                                        isAtMaxStock
                                          ? "Maximum stock reached"
                                          : ""
                                      }
                                      whileHover={
                                        !isAtMaxStock
                                          ? { backgroundColor: "#f3f4f6" }
                                          : {}
                                      }
                                      whileTap={
                                        !isAtMaxStock ? { scale: 0.95 } : {}
                                      }
                                    >
                                      <Plus className="h-3 w-3" />
                                    </motion.button>
                                  </div>

                                  <motion.button
                                    onClick={() => removeFromCart(item._id)}
                                    type="button"
                                    className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                                    aria-label="Remove item"
                                    disabled={updateLoading === item._id}
                                    whileHover={{
                                      scale: 1.1,
                                      color: "#ef4444",
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </motion.ul>
                )}
              </motion.div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <motion.div
                  className="border-t border-gray-200 dark:border-gray-700 py-4 px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3 + Math.min(cart.length * 0.05, 0.5),
                  }}
                >
                  <div className="flex justify-between mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <p>Shipping</p>
                    <p>Calculated at checkout</p>
                  </div>
                  <motion.div
                    className="flex justify-between text-base font-medium text-gray-900 dark:text-white mb-4"
                    key={subtotal}
                    animate={{
                      backgroundColor: [
                        "rgba(0,0,0,0)",
                        "rgba(251,191,36,0.1)",
                        "rgba(0,0,0,0)",
                      ],
                    }}
                    transition={{ duration: 1.5 }}
                  >
                    <p>Subtotal</p>
                    <motion.p
                      key={`subtotal-${subtotal}`}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.4 }}
                    >
                      Rs. {subtotal.toFixed(2)}
                    </motion.p>
                  </motion.div>
                  {cart.length > 0 && (
                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          href="/checkout"
                          className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-900 w-full transition-colors duration-200"
                          onClick={closeCart}
                        >
                          Checkout
                        </Link>
                      </motion.div>
                      <motion.button
                        type="button"
                        className="flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 w-full transition-colors duration-200"
                        onClick={closeCart}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Continue Shopping
                      </motion.button>
                    </div>
                  )}

                  {cart.length > 1 && (
                    <motion.button
                      type="button"
                      className="mt-4 text-sm text-center w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                      onClick={clearCart}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Clear Cart
                    </motion.button>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
