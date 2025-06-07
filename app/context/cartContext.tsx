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
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  subtotal: number;
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

  // Add a product to the cart
  const addToCart = (product: any, quantity = 1) => {
    console.log("Adding to cart:", product, "Quantity:", quantity);
    setCart((prevCart) => {
      // Check if product is already in cart
      const existingItem = prevCart.find((item) => item._id === product._id);

      if (existingItem) {
        // Update quantity if already in cart
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [
          ...prevCart,
          {
            _id: product._id,
            name: product.name,
            brand: product.brand,
            price: product.discountPrice,
            volume: product.volume,
            image: product.images[0]?.url || "",
            quantity: quantity,
          },
        ];
      }
    });

    // Open the cart when adding an item
    setIsCartOpen(true);
  };

  // Remove a product from the cart
  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  // Update the quantity of a product
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
