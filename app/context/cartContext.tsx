"use client";

import { createContext, ReactNode, useContext, useState } from "react";

// Define cart item type based on your perfume structure
export interface CartItem {
  _id: string;
  name: string;
  brand: string;
  price: number;
  volume: string;
  image: string;
  quantity: number;
  stock: number; // Add stock field to track availability
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => boolean; // Return success status
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => boolean; // Return success status
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  subtotal: number;
  isItemAvailable: (productId: string, requestedQuantity?: number) => boolean; // New helper
  getRemainingStock: (productId: string) => number; // New helper
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Calculate total items
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Calculate subtotal
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Check if a product can be added to cart based on stock
  const isItemAvailable = (
    productId: string,
    requestedQuantity = 1
  ): boolean => {
    const item = cart.find((item) => item._id === productId);

    if (!item) return true; // If not in cart yet, it's available

    const currentQuantity = item.quantity;
    return currentQuantity + requestedQuantity <= item.stock;
  };

  // Get remaining stock for a product
  const getRemainingStock = (productId: string): number => {
    const item = cart.find((item) => item._id === productId);
    if (!item) return 0; // If not found, return 0
    return Math.max(0, item.stock - item.quantity);
  };

  // Add a product to the cart
  const addToCart = (product: any, quantity = 1): boolean => {
    if (!product || !product._id) {
      console.error("Invalid product:", product);
      return false;
    }

    // Check if product has stock
    if (product.stock <= 0) {
      console.log("Product out of stock:", product.name);
      return false;
    }

    // Verify the stock isn't exceeded
    let canAdd = true;

    setCart((prevCart) => {
      // Check if product is already in cart
      const existingItem = prevCart.find((item) => item._id === product._id);

      if (existingItem) {
        // Verify we don't exceed stock
        if (existingItem.quantity + quantity > product.stock) {
          console.log(
            `Cannot add more. Already have ${existingItem.quantity}, stock is ${product.stock}`
          );
          canAdd = false;
          return prevCart; // Don't update cart
        }

        // Update quantity if already in cart
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Verify quantity doesn't exceed stock
        if (quantity > product.stock) {
          console.log(`Cannot add ${quantity}. Stock is ${product.stock}`);
          canAdd = false;
          return prevCart; // Don't update cart
        }

        // Add new item to cart
        return [
          ...prevCart,
          {
            _id: product._id,
            name: product.name,
            brand: product.brand,
            price: product.discountPrice || product.price,
            volume: product.volume,
            image: product.images?.[0]?.url || "",
            quantity: quantity,
            stock: product.stock, // Store stock info
          },
        ];
      }
    });

    // Only open the cart when adding was successful
    if (canAdd) {
      setIsCartOpen(true);
    }

    return canAdd;
  };

  // Remove a product from the cart
  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  // Update the quantity of a product with stock verification
  const updateQuantity = (id: string, quantity: number): boolean => {
    if (quantity <= 0) {
      removeFromCart(id);
      return true;
    }

    let isSuccess = true;

    setCart((prevCart) => {
      const item = prevCart.find((item) => item._id === id);

      // If item not found or quantity exceeds stock
      if (!item || quantity > item.stock) {
        isSuccess = false;
        return prevCart; // Don't update
      }

      return prevCart.map((item) =>
        item._id === id ? { ...item, quantity } : item
      );
    });

    return isSuccess;
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Cart visibility controls
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    totalItems,
    subtotal,
    isItemAvailable,
    getRemainingStock,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
