import ConditionalNavbar from "components/layout/conditional-navbar";
import { WelcomeToast } from "components/welcome-toast";
import { Playfair_Display } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import CartDrawer from "./cartDrawer";
import { AuthProvider } from "./context/authContext";
import { CartProvider } from "./context/cartContext";
import "./globals.css";

// Configure Playfair Display font
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const { SITE_NAME } = process.env;

export const metadata = {
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={playfairDisplay.variable}>
      <head>
        {/* Add material icons for the admin panel */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <AuthProvider>
          <CartProvider>
            <ConditionalNavbar />
            <main>
              {children}
              <CartDrawer />
              <Toaster closeButton />
              <WelcomeToast />
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
