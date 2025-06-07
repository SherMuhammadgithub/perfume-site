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
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>
              &copy; {copyrightDate} {SITE_NAME}. All rights reserved.
            </p>

            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-500 hover:text-amber-600 dark:hover:text-amber-500"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12"></path>
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-500 hover:text-amber-600 dark:hover:text-amber-500"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.66.254 1.216.598 1.772 1.153.555.555.899 1.112 1.153 1.772.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427-.254.66-.598 1.216-1.153 1.772-.555.555-1.112.899-1.772 1.153-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465-.66-.254-1.216-.598-1.772-1.153-.555-.555-.899-1.112-1.153-1.772-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427.254-.66.598-1.216 1.153-1.772.555-.555 1.112-.899 1.772-1.153.636-.247 1.363-.416 2.427-.465C9.576 2.013 9.93 2 12.315 2zm.064 3.848c-2.386 0-2.72.01-3.673.054-.89.04-1.375.19-1.697.315-.422.164-.726.36-1.04.673-.317.317-.51.618-.677 1.04-.124.322-.277.807-.318 1.697-.043.95-.053 1.286-.053 3.67v.06c0 2.39.01 2.724.054 3.67.04.893.19 1.379.318 1.697.167.432.357.723.673 1.04.315.317.618.51 1.038.677.322.124.808.277 1.697.318.95.043 1.285.053 3.672.053s2.724-.01 3.672-.053c.893-.04 1.378-.194 1.7-.32.42-.163.722-.357 1.04-.673.32-.32.51-.62.677-1.043.126-.313.276-.795.32-1.69.05-.934.063-1.28.063-3.65v-.12c0-2.37-.012-2.716-.063-3.65-.044-.894-.194-1.376-.32-1.688-.163-.42-.357-.723-.677-1.043-.315-.317-.618-.51-1.04-.677-.32-.123-.805-.275-1.7-.318-.95-.05-1.29-.063-3.67-.063zm0 2.568c2.357 0 4.27 1.913 4.27 4.271 0 2.356-1.913 4.27-4.27 4.27-2.357 0-4.273-1.913-4.273-4.27 0-2.357 1.916-4.27 4.272-4.27zm0 7.04c1.54 0 2.786-1.245 2.786-2.786 0-1.543-1.245-2.788-2.786-2.788-1.543 0-2.788 1.246-2.788 2.788 0 1.54 1.245 2.785 2.788 2.785zm4.515-7.148a.982.982 0 1 0 0-1.965.982.982 0 0 0 0 1.965z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-500 hover:text-amber-600 dark:hover:text-amber-500"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
