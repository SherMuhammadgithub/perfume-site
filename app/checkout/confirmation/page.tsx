"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderSummary {
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  paymentMethod: string;
}

export default function OrderConfirmation() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderSummary | null>(null);

  useEffect(() => {
    const lastOrder = sessionStorage.getItem("lastOrder");

    if (!lastOrder) {
      // No order found, redirect to home
      router.push("/");
      return;
    }

    try {
      setOrder(JSON.parse(lastOrder));
    } catch (error) {
      console.error("Error parsing order data:", error);
      router.push("/");
    }
  }, [router]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 70 },
    },
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.3,
      },
    }),
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-black"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 my-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      >
        <motion.div
          className="text-center mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
              duration: 0.8,
            }}
          >
            {/* After spring animation completes, add bounce effect with keyframes */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0],
              }}
              transition={{
                type: "tween", // Use tween for multi-keyframe animations
                duration: 0.8,
                delay: 0.3, // Start after the spring animation
                ease: "easeInOut",
              }}
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
            </motion.div>
          </motion.div>

          <motion.h1 className="text-3xl  font-bold" variants={itemVariants}>
            Thank You For Your Order!
          </motion.h1>
          <motion.p className="text-gray-500 mt-2" variants={itemVariants}>
            Your order has been received and is being processed.
          </motion.p>
        </motion.div>

        <motion.div
          className="bg-gray-50 rounded-lg p-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex flex-col sm:flex-row justify-between mb-4 pb-4 border-b"
            variants={itemVariants}
          >
            <div>
              <motion.h2
                className="text-lg font-medium"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                Order #{order.orderNumber}
              </motion.h2>
              <p className="text-gray-500 text-sm mt-1">
                Date: {new Date().toLocaleDateString()}
              </p>
            </div>
            <motion.div
              className="mt-4 sm:mt-0"
              animate={{
                scale: [1, 1.05, 1],
                transition: { duration: 1.5, repeat: 2, repeatType: "reverse" },
              }}
            >
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
                Processing
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-medium text-gray-900 uppercase mb-2">
                Shipping To
              </h3>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-gray-700">{order.customer.name}</p>
                <p className="text-sm text-gray-700 mt-1">
                  {order.shippingAddress.address}
                </p>
                <p className="text-sm text-gray-700">
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-sm text-gray-700">
                  {order.shippingAddress.country}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  Phone: {order.customer.phone}
                </p>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-medium text-gray-900 uppercase mb-2">
                Payment Method
              </h3>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <p className="text-sm text-gray-700">{order.paymentMethod}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Payment will be collected upon delivery
                </p>

                <h3 className="text-sm font-medium text-gray-900 uppercase mb-2 mt-4">
                  Contact Info
                </h3>
                <p className="text-sm text-gray-700">{order.customer.email}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.h3
          className="text-lg font-medium mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          Order Summary
        </motion.h3>

        <motion.div
          className="border rounded-lg overflow-hidden mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          whileHover={{ boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Qty
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <motion.tr
                  key={index}
                  custom={index}
                  variants={tableRowVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ backgroundColor: "#fafafa" }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    Rs. {item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    <motion.span
                      initial={{ fontWeight: 400 }}
                      whileHover={{ fontWeight: 500 }}
                    >
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </motion.span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="sm:w-1/2"></div>
          <motion.div
            className="w-full sm:w-1/2 bg-gray-50 rounded p-4"
            whileHover={{ backgroundColor: "#f9fafb" }}
          >
            <motion.div
              className="flex justify-between py-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <span className="text-sm text-gray-700">Subtotal</span>
              <span className="text-sm font-medium">
                Rs. {order.subtotal.toFixed(2)}
              </span>
            </motion.div>
            <motion.div
              className="flex justify-between py-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <span className="text-sm text-gray-700">Shipping</span>
              <span className="text-sm font-medium">
                {order.shippingCost === 0
                  ? "Free"
                  : `Rs. ${order.shippingCost.toFixed(2)}`}
              </span>
            </motion.div>
            <motion.div
              className="flex justify-between py-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <span className="text-sm text-gray-700">Tax</span>
              <span className="text-sm font-medium">
                Rs. {order.tax.toFixed(2)}
              </span>
            </motion.div>
            <motion.div
              className="flex justify-between py-2 border-t mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <span className="text-base font-medium">Total</span>
              <motion.span
                className="text-base font-medium"
                animate={{
                  scale: [1, 1.1, 1],
                  transition: { delay: 1.5, duration: 0.5 },
                }}
              >
                Rs. {order.total.toFixed(2)}
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <motion.p
            className="text-sm text-gray-500 mb-4"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
          >
            If you have any questions about your order, please contact our
            customer support.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link
              href="/"
              className="inline-block bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
