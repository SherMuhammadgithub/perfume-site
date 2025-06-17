"use client";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define a type for our collection card
type CollectionCardProps = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  isFeatured: boolean;
  displayOrder: number;
  isStatic: boolean;
  filters?: {
    brands?: string[];
    categories?: string[];
    genders?: string[];
    priceRange?: {
      min: number;
      max: number;
    };
  };
};

// Collection Card Component
function CollectionCard({
  _id,
  name,
  description,
  image,
  isFeatured,
  displayOrder,
  isStatic,
  filters,
  index,
}: CollectionCardProps & { index: number }) {
  // Encode collection name for URL
  const encodedName = encodeURIComponent(name);
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.2 + index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        onClick={() => router.push(`/search?q=${encodedName}`)}
        className="card relative overflow-hidden rounded-xl shadow-lg dark:shadow-gray-800/30 h-72 sm:h-80 md:h-96 cursor-pointer"
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        {/* Image container */}
        <div className="relative w-full h-full">
          {image ? (
            <motion.div className="w-full h-full">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 90vw, (max-width: 768px) 40vw, 33vw"
                priority
              />
              <motion.div
                className="absolute inset-0 bg-black dark:bg-black/50"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.2 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500 text-lg sm:text-2xl font-playfair italic">
                No Image
              </span>
            </div>
          )}
        </div>

        {/* Overlay with gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent dark:from-black/90 dark:via-black/50"></div>

        {/* Content layer */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center z-10 p-6">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.h3
              className="text-white text-center font-playfair text-xl sm:text-2xl font-medium mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {name}
            </motion.h3>

            {description && (
              <motion.p
                className="text-gray-200 text-sm text-center mb-4 line-clamp-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.8 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                {description}
              </motion.p>
            )}

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.button
                className={`${
                  isFeatured
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                } ${isFeatured ? "text-white" : "text-black dark:text-white"} px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium shadow-md`}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {isFeatured ? "Featured Collection" : "Explore Collection"}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Special badge for featured collections */}
        {isFeatured && (
          <motion.div
            className="absolute top-4 right-4 bg-amber-500 text-white text-xs px-3 py-1 rounded-full tracking-wide shadow-md"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.6 + index * 0.1,
              type: "spring",
              stiffness: 300,
            }}
          >
            Featured
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Skeleton Card Component for loading state
function SkeletonCard({ delay = 0 }) {
  return (
    <motion.div
      className="rounded-xl shadow-md h-72 sm:h-80 md:h-96 bg-gray-100 dark:bg-gray-800 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="w-full h-full relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 1.5,
            ease: "linear",
          }}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="space-y-3">
          <motion.div
            className="h-6 w-3/4 mx-auto bg-white dark:bg-gray-600 bg-opacity-70 dark:bg-opacity-50 rounded"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="h-4 w-5/6 mx-auto bg-white dark:bg-gray-600 bg-opacity-60 dark:bg-opacity-40 rounded"
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              delay: 0.2,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="h-10 w-40 mx-auto bg-white dark:bg-gray-500 bg-opacity-80 dark:bg-opacity-60 rounded-full mt-4"
            animate={{ opacity: [0.6, 0.9, 0.6] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              delay: 0.3,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function ThreeItemGrid() {
  const [collections, setCollections] = useState<CollectionCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function fetchCollections() {
    try {
      const response = await axios.get(
        "/api/collections?featured=true&limit=3"
      );
      return response.data.collections;
    } catch (error) {
      console.error("Error fetching collections:", error);
      return [];
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchCollections();
      setCollections(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-7xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Section Header */}
      <motion.div
        className="text-center mb-12 sm:mb-16"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl tracking-wider mb-4 font-playfair font-medium text-gray-900 dark:text-gray-100"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Our Collection
        </motion.h2>

        <motion.div
          className="w-28 h-0.5 bg-amber-700 dark:bg-amber-600 mx-auto"
          initial={{ width: 0 }}
          whileInView={{ width: 112 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        />

        <motion.p
          className="mt-5 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Discover our exquisite range of fragrances crafted with the finest
          ingredients to elevate your personal essence. Each collection tells a
          unique olfactory story.
        </motion.p>
      </motion.div>

      {/* Collection Cards */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {loading ? (
            // Skeleton loading state - shows 3 skeleton cards
            <>
              <SkeletonCard delay={0} />
              <SkeletonCard delay={0.1} />
              <SkeletonCard delay={0.2} />
            </>
          ) : (
            // Actual collection cards
            collections.map((collection, index) => (
              <CollectionCard
                key={collection._id}
                _id={collection._id}
                name={collection.name}
                description={collection.description}
                image={collection.image}
                isFeatured={collection.isFeatured}
                displayOrder={collection.displayOrder}
                isStatic={collection.isStatic}
                filters={collection.filters}
                index={index}
              />
            ))
          )}
        </div>
      </div>

      {/* View All Collections Button */}
      <motion.div
        className="flex justify-center mt-12 sm:mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.div
          onClick={() => router.push("/search")}
          className="relative inline-flex items-center gap-2 px-8 py-3 bg-black dark:bg-white dark:text-black text-white 
                        font-medium text-sm sm:text-base rounded-full transition-all duration-300 
                        shadow-sm hover:shadow-md cursor-pointer"
        >
          <span>Explore All Collections</span>
          <motion.span
            animate={{
              x: [0, 4, 0],
            }}
            transition={{
              repeat: Infinity,
              repeatDelay: 1.5,
              duration: 1,
            }}
          >
            →
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default ThreeItemGrid;
