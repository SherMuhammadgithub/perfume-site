"use client";

import { motion } from "framer-motion";
import Head from "next/head";
import { ReactNode } from "react";

export default function SearchLayout({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Head>
        <title>Luxury Perfumes Collection</title>
        <meta
          name="description"
          content="Explore our exclusive collection of luxury perfumes"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </motion.div>
  );
}
