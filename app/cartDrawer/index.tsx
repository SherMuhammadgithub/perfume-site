"use client";

import { useCart } from "app/context/cartContext";
import { AlertCircle, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
// At the top of your file, ensure you have:
import { Minus, Plus, Trash2 } from "lucide-react";

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
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);

  // Handle animation states
  useEffect(() => {
    if (isCartOpen) {
      setIsAnimating(true);
      // Small delay to ensure CSS transition works
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      setIsVisible(false);
      // Wait for the animation to complete before unmounting
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  // Close cart when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target as Node) &&
        isCartOpen
      ) {
        closeCart();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeCart, isCartOpen]);

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

      // Could show an error message if needed
      if (!success) {
        console.log("Could not update quantity - stock limit reached");
      }
    }, 300);
  };

  if (!isAnimating) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with glass effect */}
      <div
        className={`absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity duration-300 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div
          ref={cartRef}
          className={`w-full sm:w-96 bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${
            isVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Cart Header */}
          <div className="px-4 py-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 tracking-wide flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Your Cart ({totalItems})
            </h2>
            <button
              onClick={closeCart}
              className="text-gray-400 hover:text-gray-500 transition-colors"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Your cart is empty
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start adding items to your cart
                </p>
                <div className="mt-6">
                  <button
                    onClick={closeCart}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cart.map((item: any) => {
                  const isAtMaxStock = item.quantity >= item.stock;
                  const isLowStock =
                    item.stock <= 5 && item.quantity < item.stock;

                  return (
                    <li key={item._id} className="py-5 px-4">
                      <div className="flex items-center">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 border border-gray-200 rounded-md overflow-hidden">
                          <img
                            src={item.image || ""}
                            alt={item.name}
                            className="w-full h-full object-center object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {item.name}
                              </h3>
                              <p className="mt-1 text-xs text-gray-500">
                                {item.brand}
                              </p>
                              {item.volume && (
                                <p className="mt-1 text-xs text-gray-500">
                                  {item.volume}
                                </p>
                              )}
                              {/* Stock indicator */}
                              {isLowStock && (
                                <p className="mt-1 text-xs text-amber-600 flex items-center">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Only {item.stock - item.quantity} left
                                </p>
                              )}
                              {isAtMaxStock && (
                                <p className="mt-1 text-xs text-red-600 flex items-center">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Max stock reached
                                </p>
                              )}
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              Rs. {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          {/* Quantity Control and Remove */}
                          <div className="mt-2 flex justify-between items-center">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item._id,
                                    item.quantity - 1
                                  )
                                }
                                className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                                aria-label="Decrease quantity"
                                disabled={updateLoading === item._id}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-2 text-sm text-gray-900">
                                {updateLoading === item._id
                                  ? "..."
                                  : item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item._id,
                                    item.quantity + 1
                                  )
                                }
                                className={`p-1 ${
                                  isAtMaxStock
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-600 hover:text-gray-800"
                                }`}
                                aria-label="Increase quantity"
                                disabled={
                                  isAtMaxStock || updateLoading === item._id
                                }
                                title={
                                  isAtMaxStock ? "Maximum stock reached" : ""
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item._id)}
                              type="button"
                              className="text-gray-400 hover:text-gray-700 transition-colors duration-200"
                              aria-label="Remove item"
                              disabled={updateLoading === item._id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 py-4 px-4">
              <div className="flex justify-between mb-2 text-sm text-gray-500">
                <p>Shipping</p>
                <p>Calculated at checkout</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Subtotal</p>
                <p>Rs. {subtotal.toFixed(2)}</p>
              </div>
              {cart.length > 0 && (
                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-gray-800 w-full transition-colors duration-200"
                    onClick={closeCart}
                  >
                    Checkout
                  </Link>
                  <button
                    type="button"
                    className="flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 w-full transition-colors duration-200"
                    onClick={closeCart}
                  >
                    Continue Shopping
                  </button>
                </div>
              )}

              {cart.length > 1 && (
                <button
                  type="button"
                  className="mt-4 text-sm text-center w-full text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
