"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { useAuth } from "../context/authContext";

// Create a separate client component that uses useSearchParams
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const { login, loading, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    try {
      console.log("Attempting login...");
      const result = (await login(email, password)) as any;
      console.log("Login result:", result);

      // Get user from context too
      console.log("User from context:", user);

      if (result?.role === "admin" || user?.role === "admin") {
        console.log("Admin user detected, redirecting to admin...");
        router.push("/admin");
      } else {
        console.log("Regular user, redirecting to:", redirect);
        router.push(redirect);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setFormError(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{" "}
            <Link
              href="/register"
              className="font-medium text-black dark:text-amber-500 hover:text-gray-800 dark:hover:text-amber-400"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-600 dark:focus:border-amber-600"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-600 dark:focus:border-amber-600"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black dark:bg-amber-600 hover:bg-gray-800 dark:hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-amber-600 dark:focus:ring-offset-gray-900"
            >
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z"
                  />
                </svg>
              ) : null}
              Sign in
            </button>
          </div>

          {formError && (
            <div className="text-red-500 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
              {formError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// Main page component with Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

// Simple loading skeleton with dark mode
function LoginSkeleton() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-white dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}
