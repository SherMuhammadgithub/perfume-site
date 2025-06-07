"use client";

import BestsellerPerfumes from "components/bestsellers";
import FeaturedPerfumes from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import PerfumeBanner from "components/hero-banner";
import Footer from "components/layout/footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HomePage() {
  // Reference for the entire page for scroll animations
  const pageRef = useRef(null);

  // Get scroll progress for various effects
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });

  // Transform values for parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [1, 1, 0.5, 0]
  );

  // Stagger animation variants for sections
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.1,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
      },
    },
  };

  // Background decorative elements
  const backgroundElements = (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-amber-100/20 to-rose-100/20 blur-3xl"
        style={{ y: backgroundY, x: "30%" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.5 }}
      />

      <motion.div
        className="absolute bottom-1/4 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-100/10 to-purple-100/10 blur-3xl"
        style={{
          y: useTransform(scrollYProgress, [0, 1], ["0%", "15%"]),
          x: "-20%",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />
    </div>
  );

  return (
    <motion.div
      ref={pageRef}
      className="relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {backgroundElements}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <motion.div variants={sectionVariants} className="relative z-10">
          <PerfumeBanner />
        </motion.div>

        <motion.div
          variants={sectionVariants}
          viewport={{ once: true, margin: "-100px" }}
        >
          <ThreeItemGrid />
        </motion.div>

        <motion.div
          variants={sectionVariants}
          viewport={{ once: true, margin: "-100px" }}
        >
          <FeaturedPerfumes />
        </motion.div>

        <motion.div
          variants={sectionVariants}
          viewport={{ once: true, margin: "-100px" }}
        >
          <BestsellerPerfumes />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <Footer />
      </motion.div>

      {/* Scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
    </motion.div>
  );
}
