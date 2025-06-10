"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function WelcomeToast() {
  useEffect(() => {
    // ignore if screen height is too small
    if (window.innerHeight < 650) return;
    if (!document.cookie.includes("welcome-toast=2")) {
      toast("🛍️ Welcome to SCENTILUXE perfumes!", {
        id: "welcome-toast",
        duration: Infinity,
        onDismiss: () => {
          document.cookie = "welcome-toast=2; max-age=31536000; path=/";
        },
        description: (
          <>
            <span className="font-semibold">Scentiluxe</span> is your
            destination for discovering luxurious perfumes. Explore our curated
            collection and enjoy a seamless shopping experience powered by
            Next.js.
          </>
        ),
      });
    }
  }, []);

  return null;
}
