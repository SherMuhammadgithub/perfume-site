import { Sparkles } from "lucide-react";
import Link from "next/link";

const SITE_NAME = "SCENTILUXE";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");

  return (
    <footer className="bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="text-xl font-playfair font-medium text-gray-900 dark:text-white">
                {SITE_NAME}
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Discover luxury fragrances crafted with passion and precision for
              the discerning connoisseur.
            </p>
          </div>

          {/* Shop Links - Now in multiple columns */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">
              Shop
            </h3>

            {/* Multi-column shop links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
              <Link
                href="/search?category=new-arrivals"
                className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              >
                New Arrivals
              </Link>

              <Link
                href="/search?category=bestsellers"
                className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              >
                Bestsellers
              </Link>

              <Link
                href="/search?category=women's-perfumes"
                className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              >
                Women's Perfumes
              </Link>

              <Link
                href="/search?category=men's-colognes"
                className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              >
                Men's Perfumes
              </Link>

              <Link
                href="/search?category=sale"
                className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              >
                Sale
              </Link>

              <Link
                href="/search?category=niche"
                className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              >
                Niche Perfumes
              </Link>
            </div>
          </div>
        </div>

        {/* Secondary Footer */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 mt-10">
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
            <p>
              &copy; {copyrightDate} {SITE_NAME}. All rights reserved.
            </p>
            <address className="not-italic text-sm text-gray-500 dark:text-gray-400 text-center md:text-right">
              <Link
                href="/policies/privacy"
                className="underline hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
              >
                Privacy Policy
              </Link>
            </address>
            {/* 
            <div className="flex space-x-6 mt-4 md:mt-0">
              ...social icons...
            </div> 
            */}
          </div>
        </div>
      </div>
    </footer>
  );
}
