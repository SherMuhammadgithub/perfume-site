"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CreditCard, MapPin, Package, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "../context/cartContext";

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shipping cost calculation - free for orders over $100
  const shippingCost = subtotal > 100 ? 0 : 5.99;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + shippingCost + tax).toFixed(2);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
        },
        shippingAddress: {
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        items: cart.map((item) => ({
          perfume: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        shippingCost,
        tax,
        total,
        paymentMethod: "Cash on Delivery",
      };

      const response = await axios.post("/api/orders", orderData);

      // Store order info in sessionStorage for confirmation page
      sessionStorage.setItem(
        "lastOrder",
        JSON.stringify({
          orderNumber: response.data.orderNumber,
          ...orderData,
        })
      );

      clearCart();
      router.push("/checkout/confirmation");
    } catch (err: any) {
      console.error("Order submission error:", err);
      setError(
        err?.response?.data?.error || "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const formGroupVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (cart.length === 0) {
    return (
      <motion.div
        className="max-w-4xl mx-auto p-8 text-center bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-sm my-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        >
          <Package className="w-10 h-10 text-gray-400" />
        </motion.div>

        <motion.h1
          className="text-3xl  font-bold mb-4 text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Your cart is empty
        </motion.h1>

        <motion.p
          className="mb-8 text-gray-600 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          It seems you haven't added any items to your cart yet. Discover our
          exclusive collection of luxury fragrances.
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link
            href="/search"
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center font-medium"
          >
            <motion.span
              initial={{ x: 10 }}
              animate={{ x: 0 }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 1,
                repeatDelay: 1,
              }}
              className="mr-2"
            >
              →
            </motion.span>
            Explore Our Collection
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Checkout steps */}
      <motion.div
        className="w-full max-w-3xl mx-auto mb-12 hidden md:flex justify-between relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Progress bar */}
        <div className="absolute top-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>

        {/* Step 1 */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mb-2">
            <Check className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-gray-900">Cart</span>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1.1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mb-2 ring-4 ring-gray-100">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-gray-900">Shipping</span>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mb-2">
            <CreditCard className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-gray-500">Payment</span>
        </motion.div>

        {/* Step 4 */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mb-2">
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-gray-500">
            Confirmation
          </span>
        </motion.div>
      </motion.div>

      <motion.h1
        className="text-3xl  font-bold mb-10 text-center"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
      >
        Complete Your Order
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Customer & Shipping Information Form */}
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm p-8 border border-gray-100"
            variants={itemVariants}
            whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}
          >
            <motion.div className="flex items-center mb-6 gap-3">
              <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold">1</span>
              </div>
              <motion.h2
                className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 w-full"
                variants={itemVariants}
              >
                Personal Details
              </motion.h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
              variants={containerVariants}
            >
              <motion.div variants={formGroupVariants} className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <motion.input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-gray-900"
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(0,0,0,0.1)" }}
                  placeholder="Enter Full Name"
                />
              </motion.div>

              <motion.div variants={formGroupVariants} className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <motion.input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-gray-900"
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(0,0,0,0.1)" }}
                  placeholder="Enter Email"
                />
              </motion.div>

              <motion.div variants={formGroupVariants} className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <motion.input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-gray-900"
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(0,0,0,0.1)" }}
                  placeholder="+92 317 4396952"
                />
              </motion.div>
            </motion.div>

            <motion.div className="flex items-center mb-6 gap-3">
              <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold">2</span>
              </div>
              <motion.h2
                className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 w-full"
                variants={itemVariants}
              >
                Shipping Information
              </motion.h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-6"
              variants={containerVariants}
            >
              <motion.div variants={formGroupVariants} className="space-y-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address <span className="text-red-500">*</span>
                </label>
                <motion.textarea
                  id="address"
                  name="address"
                  required
                  value={form.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-gray-900"
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(0,0,0,0.1)" }}
                  placeholder="123 Example Street, Apt 5B"
                />
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={containerVariants}
              >
                <motion.div variants={formGroupVariants} className="space-y-2">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City <span className="text-red-500">*</span>
                  </label>
                  <motion.input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-gray-900"
                    whileFocus={{ boxShadow: "0 0 0 2px rgba(0,0,0,0.1)" }}
                    placeholder="Enter City Name"
                  />
                </motion.div>

                <motion.div variants={formGroupVariants} className="space-y-2">
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <motion.input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    required
                    value={form.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-gray-900"
                    whileFocus={{ boxShadow: "0 0 0 2px rgba(0,0,0,0.1)" }}
                    placeholder="Enter Postal Code"
                  />
                </motion.div>

                <motion.div variants={formGroupVariants} className="space-y-2">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country <span className="text-red-500">*</span>
                  </label>
                  <motion.input
                    id="country"
                    name="country"
                    type="text"
                    required
                    value={form.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-gray-900"
                    whileFocus={{ boxShadow: "0 0 0 2px rgba(0,0,0,0.1)" }}
                    placeholder="Enter Country Name"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.form>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          className="lg:col-span-1"
          variants={itemVariants}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 sticky top-6"
            whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.05)" }}
          >
            <motion.h2
              className="text-xl font-bold mb-6 pb-2 border-b border-gray-200 text-gray-900"
              variants={itemVariants}
            >
              Order Summary
            </motion.h2>

            <motion.div
              className="max-h-80 overflow-y-auto mb-6 -mx-4 px-4 space-y-4"
              variants={containerVariants}
            >
              {cart.map((item, index) => (
                <motion.div
                  key={`${item._id}-${item.volume}`}
                  className="flex py-4 border-b border-dashed border-gray-200 last:border-b-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.1 * index, duration: 0.3 },
                  }}
                  whileHover={{
                    backgroundColor: "rgba(0,0,0,0.01)",
                    borderRadius: "0.5rem",
                  }}
                >
                  <motion.div
                    className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover object-center"
                      />
                    )}
                  </motion.div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-sm font-medium text-gray-900">
                        <h3 className="font-semibold">{item.name}</h3>
                        <motion.p
                          className="ml-4 font-bold"
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{
                            duration: 0.5,
                            delay: 0.3 + index * 0.1,
                          }}
                        >
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </motion.p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 font-medium">
                        {item.brand}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {item.volume}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="space-y-3 py-4 border-t border-gray-200"
              variants={containerVariants}
              animate="visible"
              custom={1}
            >
              <motion.div
                className="flex justify-between text-sm"
                variants={itemVariants}
              >
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
              </motion.div>

              <motion.div
                className="flex justify-between text-sm"
                variants={itemVariants}
              >
                <span className="text-gray-600">Shipping</span>
                <motion.span
                  animate={
                    shippingCost === 0
                      ? {
                          color: ["#4F46E5", "#10B981", "#4F46E5"],
                          scale: [1, 1.1, 1],
                          transition: {
                            duration: 1.5,
                            repeat: 0,
                            repeatType: "reverse",
                          },
                        }
                      : {}
                  }
                  className={
                    shippingCost === 0
                      ? "font-medium text-green-600"
                      : "font-medium"
                  }
                >
                  {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                </motion.span>
              </motion.div>

              <motion.div
                className="flex justify-between text-sm"
                variants={itemVariants}
              >
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-medium">Rs. {tax.toFixed(2)}</span>
              </motion.div>

              <motion.div
                className="flex justify-between text-base pt-4 border-t border-gray-200 mt-2"
                variants={itemVariants}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.8, duration: 0.3 },
                }}
              >
                <span className="font-semibold text-gray-900">Total</span>
                <motion.span
                  className="font-bold text-gray-900 text-lg"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                    delay: 1,
                  }}
                >
                  Rs. {total.toFixed(2)}
                </motion.span>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-8 space-y-4"
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.9, duration: 0.4 },
              }}
            >
              <motion.div
                className="rounded-lg bg-gray-50 p-4"
                whileHover={{ backgroundColor: "#f9fafb" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Payment Method
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 block">
                      Cash on Delivery
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-300 shadow-sm"
                whileHover={{ scale: 1.01, backgroundColor: "#1f2937" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {loading ? (
                  <motion.div className="flex items-center justify-center gap-2">
                    <motion.span
                      className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <motion.span
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Processing Order...
                    </motion.span>
                  </motion.div>
                ) : (
                  "Complete Order"
                )}
              </motion.button>

              <p className="text-xs text-center text-gray-500 mt-2">
                By completing your purchase, you agree to our Terms of Service
                and Privacy Policy.
              </p>

              <AnimatePresence>
                {error && (
                  <motion.div
                    className="mt-4 text-sm text-red-600 bg-red-50 p-4 rounded-lg border border-red-100"
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <div className="flex gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
