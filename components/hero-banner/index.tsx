"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LogoBanner() {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if mobile and set state
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Animation variants - adjust timing for mobile
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.1 : 0.2,
        delayChildren: 0.3,
        duration: 1.2,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
      },
    },
  };

  const decorationVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.8,
      },
    },
  };

  const stemVariants = {
    hidden: { opacity: 0, scaleX: 0 },
    visible: {
      opacity: 1,
      scaleX: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 1,
      },
    },
  };

  const flourishVariants = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: {
      opacity: 1,
      pathLength: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut",
        delay: 1.2,
      },
    },
  };

  if (!isClient) {
    return null; // Prevents hydration mismatch
  }

  // Split CENTILUXE into individual characters for letter-by-letter animation
  const brandLetters = "CENTILUXE".split("");

  return (
    <motion.div
      className="bg-black w-full py-10 sm:py-16 md:py-24 flex items-center justify-center overflow-hidden"
      initial={{ backgroundColor: "#000000" }}
      animate={{ backgroundColor: "#000000" }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="logo-container relative px-3 sm:px-6 md:px-8 transform"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <motion.h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-gray-200 tracking-wider font-light whitespace-nowrap font-playfair mx-auto text-center">
          {/* S with decoration for desktop */}
          <span className="relative hidden sm:inline-block">
            {/* Animated floral decoration */}
            <motion.span
              className="absolute"
              variants={decorationVariants}
              style={{
                top: "-10px",
                left: "-10px",
                width: "30px",
                height: "30px",
                border: "0.5px solid #9b9b9b",
                borderRadius: "50% 0 50% 50%",
                borderRight: "none",
                transform: "rotate(45deg)",
              }}
              whileHover={{
                rotate: 90,
                borderColor: "#ffffff",
                transition: { duration: 0.3 },
              }}
            />

            {/* Animated stem */}
            <motion.span
              className="absolute"
              variants={stemVariants}
              style={{
                top: "5px",
                left: "20px",
                width: "15px",
                height: "0.5px",
                backgroundColor: "#9b9b9b",
                originX: 0,
              }}
              whileHover={{
                backgroundColor: "#ffffff",
                transition: { duration: 0.3 },
              }}
            />

            <motion.span
              variants={letterVariants}
              className="inline-block"
              whileHover={{
                color: "#ffffff",
                y: -5,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              S
            </motion.span>
          </span>

          {/* S with simpler decoration for mobile */}
          <span className="relative sm:hidden">
            <motion.span
              variants={letterVariants}
              className="inline-block"
              whileHover={{
                color: "#ffffff",
                y: -3,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              S
            </motion.span>
          </span>

          {/* Animate each letter of CENTILUXE */}
          {brandLetters.map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="inline-block"
              whileHover={{
                color: "#ffffff",
                y: -5,
                transition: { type: "spring", stiffness: 300 },
              }}
              custom={index}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        {/* Animated flourish - only on larger screens */}
        <motion.div
          className="absolute hidden sm:block"
          variants={flourishVariants}
          style={{
            bottom: "-20px",
            right: "-100px",
            width: "150px",
            height: "50px",
            borderBottom: "0.5px solid #9b9b9b",
            borderRadius: "0 0 0 100%",
            originX: 1,
            originY: 1,
          }}
          whileHover={{
            borderColor: "#ffffff",
            scale: 1.1,
            transition: { duration: 0.5, type: "spring" },
          }}
        />

        {/* Simple flourish for mobile */}
        <motion.div
          className="w-16 h-0.5 bg-gray-400 mx-auto mt-4 sm:hidden"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        />
      </motion.div>

      {/* Optional tagline for mobile */}
      <motion.p
        className="absolute bottom-2 text-gray-400 text-xs sm:hidden tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        LUXURY FRAGRANCES
      </motion.p>

      <style jsx>{`
        @media (max-width: 640px) {
          .logo-container {
            transform-origin: center;
          }
        }
      `}</style>
    </motion.div>
  );
}
