"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const isCheckoutPage = pathname?.startsWith("/checkout");

  if (isCheckoutPage) {
    return null;
  }

  return <Navbar />;
}
