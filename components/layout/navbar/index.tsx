"use client";

import CartButton from "app/cartDrawer/cartButton";
import { useAuth } from "app/context/authContext"; // Add this import
import { ChevronDown, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SITE_NAME = "Maison";

export function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const { user, isAdmin, logout } = useAuth(); // Get auth context

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Admin menu items
  const adminItems = [
    { title: "Dashboard", path: "/admin", icon: "dashboard" },
    { title: "Products", path: "/admin/products", icon: "inventory" },
    { title: "Orders", path: "/admin/orders", icon: "shopping_cart" },
    { title: "Customers", path: "/admin/customers", icon: "people" },
    { title: "Settings", path: "/admin/settings", icon: "settings" },
  ];

  const collectionItems = [
    { title: "For Women", path: "/collections/women" },
    { title: "For Men", path: "/collections/men" },
    { title: "Gift Sets", path: "/collections/gift-sets" },
    { title: "New Arrivals", path: "/collections/new-arrivals" },
  ];

  return (
    <>
      <style jsx global>{`
        .nav-link {
          position: relative;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #d4af37;
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .dropdown-content {
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.3s ease;
        }

        .dropdown:hover .dropdown-content {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .logo-text {
          position: relative;
        }

        .logo-text::before {
          content: "";
          position: absolute;
          width: 30px;
          height: 1px;
          background-color: #d4af37;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
        }

        .announcement-bar {
          background: linear-gradient(90deg, #000 0%, #222 50%, #000 100%);
          background-size: 200% 100%;
          animation: gradientMove 15s ease infinite;
        }

        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .shimmer {
          position: relative;
          overflow: hidden;
        }

        .shimmer::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }

        /* Add styles for admin dropdown */
        .admin-dropdown-content {
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.3s ease;
          right: 0;
        }

        .admin-dropdown:hover .admin-dropdown-content {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
      `}</style>

      {/* Announcement Bar */}
      <div className="announcement-bar lowercase w-full text-white text-center py-2.5 text-xs tracking-widest font-light">
        FREE SHIPPING ON ORDERS OVER $100 | 14 DAYS RETURN POLICY
      </div>

      {/* Main Navigation */}
      <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between py-6 px-6">
              {/* Left Section */}
              <div className="flex items-center space-x-12">
                {/* Navigation Links */}
                <div className="flex items-center space-x-10">
                  <Link
                    href="/"
                    className="nav-link text-sm tracking-widest text-gray-900 hover:text-amber-600 transition-colors duration-300"
                  >
                    HOME
                  </Link>
                </div>
              </div>

              {/* Center Logo */}
              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                <Link href="/">
                  <div className="h-auto w-36 relative">
                    <Image
                      src="/images/logo.jpeg"
                      alt={SITE_NAME}
                      width={120}
                      height={120}
                      className="shimmer object-contain"
                      style={{ maxHeight: "80px" }}
                    />
                  </div>
                </Link>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-12">
                {/* Navigation Links */}
                <div className="flex items-center space-x-10">
                  {/* Admin Dropdown - Only visible for admin users */}
                  {isAdmin && (
                    <div className="admin-dropdown relative group">
                      <div className="flex items-center space-x-1 cursor-pointer">
                        <span className="nav-link text-sm tracking-widest text-amber-600 hover:text-amber-700 transition-colors duration-300">
                          ADMIN
                        </span>
                        <ChevronDown className="h-4 w-4 text-amber-600 transition-transform duration-300 group-hover:rotate-180" />
                      </div>

                      {/* Admin Dropdown Menu */}
                      <div className="admin-dropdown-content absolute right-0 bg-white shadow-lg rounded-sm mt-6 py-6 w-64 z-50">
                        <div className="px-6 pb-3 mb-3 border-b border-gray-100">
                          <h4 className="text-xs tracking-widest text-gray-400 font-medium">
                            ADMIN PANEL
                          </h4>
                        </div>
                        {adminItems.map((item, index) => (
                          <Link
                            key={index}
                            href={item.path}
                            className="block px-6 py-2 text-sm hover:bg-gray-50 transition-colors duration-200 hover:text-amber-600"
                          >
                            <div className="flex items-center">
                              <span className="material-symbols-outlined mr-2">
                                {item.icon}
                              </span>
                              {item.title}
                            </div>
                          </Link>
                        ))}
                        <div className="px-6 pt-4 mt-3 border-t border-gray-100">
                          <button
                            onClick={logout}
                            className="text-xs tracking-widest text-amber-600 hover:underline flex items-center"
                          >
                            <span className="material-symbols-outlined mr-1">
                              logout
                            </span>
                            LOGOUT
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* User and Cart Icons */}
                <div className="flex items-center space-x-6">
                  {/* User Account Icon */}
                  <Link
                    href={user ? "/account" : "/login"}
                    className="transition-transform duration-300 ease-in-out hover:scale-105 hover:opacity-80"
                  >
                    <User className="h-5 w-5 text-gray-900" />
                  </Link>

                  {/* Shopping Cart Icon */}
                  <div className="relative cursor-pointer">
                    <CartButton></CartButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-between py-4 px-4">
            <button
              onClick={() => setShowMobileMenu(true)}
              className="text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <Link href="/">
                <div className="h-auto w-36 relative">
                  <Image
                    src="/images/logo.jpeg"
                    alt={SITE_NAME}
                    width={120}
                    height={120}
                    className="shimmer object-contain"
                    style={{ maxHeight: "60px" }}
                  />
                </div>
              </Link>
            </div>

            <div className="relative cursor-pointer">
              <CartButton></CartButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (Hidden by default) */}
      {showMobileMenu && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowMobileMenu(false)}
          ></div>
          <div className="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white z-50 shadow-xl p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className=" text-xl">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="text-gray-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <Link
                href="/"
                className="block py-2 text-gray-900 hover:text-amber-600 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>

              {/* Admin section in mobile menu */}
              {isAdmin && (
                <>
                  <div className="pt-6 mt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-amber-600 font-medium">
                        Admin Panel
                      </span>
                      <button onClick={() => setShowAdminMenu(!showAdminMenu)}>
                        <ChevronDown
                          className={`h-4 w-4 text-amber-600 transform transition-transform ${showAdminMenu ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>

                    {showAdminMenu && (
                      <div className="pl-4 mt-2 space-y-2">
                        {adminItems.map((item, index) => (
                          <Link
                            key={index}
                            href={item.path}
                            className="flex items-center py-1 text-sm text-gray-600 hover:text-amber-600 transition-colors"
                            onClick={() => setShowMobileMenu(false)}
                          >
                            <span className="material-symbols-outlined mr-2 text-sm">
                              {item.icon}
                            </span>
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="pt-6 mt-6 border-t border-gray-100">
                {/* Logout option for users */}
                {user && (
                  <button
                    onClick={() => {
                      logout();
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center py-2 text-gray-900 hover:text-amber-600 transition-colors w-full text-left"
                  >
                    <span className="material-symbols-outlined mr-3">
                      logout
                    </span>
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;
