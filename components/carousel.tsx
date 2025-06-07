"use client";
import { useCart } from "app/context/cartContext";
import axios from "axios";
import useEmblaCarousel from "embla-carousel-react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Perfume } from "lib/interfaces/data.type";
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export function FeaturedPerfumes() {
  const router = useRouter();
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Embla carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
    },
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Parallax effect for section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const goToProductPage = (id: string) => {
    router.push(`/product/${id}`);
  };

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    const fetchFeaturedPerfumes = async () => {
      try {
        const response = await axios.get("/api/perfumes/featured");
        setPerfumes(response.data || []);
      } catch (error) {
        console.error("Error fetching featured perfumes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPerfumes();
  }, []);

  if (!loading && !perfumes.length) return null;

  const handleAddToCart = (perfume: Perfume, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(perfume);

    // Visual feedback for adding to cart
    setAddedToCart((prev) => ({ ...prev, [perfume._id]: true }));
    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [perfume._id]: false }));
    }, 2000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Decorative background elements
  const backgroundElements = (
    <>
      <div className="absolute top-0 left-0 w-full overflow-hidden -z-10 opacity-30 dark:opacity-10">
        <motion.div
          className="w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-200 to-amber-50 blur-3xl -translate-x-1/2 -translate-y-1/2"
          style={{ y: backgroundY }}
        />
      </div>
      <div className="absolute top-0 right-0 w-full overflow-hidden -z-10 opacity-30 dark:opacity-10">
        <motion.div
          className="w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-rose-100 to-amber-100 blur-3xl translate-x-1/2 -translate-y-1/4"
          style={{ y: backgroundY }}
        />
      </div>
    </>
  );

  return (
    <section
      ref={sectionRef}
      className="py-8 relative bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800 overflow-hidden"
    >
      {backgroundElements}

      <div className="container mx-auto px-4 max-w-7xl">
        {/* HEADER SECTION WITH ANIMATIONS */}
        <motion.div
          className="text-center mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={headerVariants}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative inline-block"
          >
            <span className="absolute -inset-1 rounded-full blur opacity-30 bg-amber-200 dark:bg-amber-700"></span>
            <h2 className="relative text-4xl md:text-5xl tracking-wider mb-3 font-playfair font-medium">
              Featured Perfumes
            </h2>
          </motion.div>

          <motion.div
            className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          />

          <motion.p
            className="mt-6 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Discover our curated collection of featured perfumes—unique,
            popular, and exclusive scents for every style and occasion.
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            // Enhanced skeleton loader with animation for carousel
            <div className="max-w-6xl mx-auto relative">
              <div className="overflow-hidden">
                <div className="flex gap-4 sm:gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="min-w-[280px] sm:min-w-[320px] md:min-w-[380px] h-[380px] rounded-lg bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden flex-shrink-0"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 dark:via-gray-500"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "linear",
                        }}
                      />

                      {/* Skeleton content */}
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-white dark:bg-gray-800 p-4">
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded-full w-2/3 mb-4"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded-full w-1/3 mb-4"></div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
                          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Embla Carousel implementation
            <div className="max-w-6xl mx-auto relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <motion.div
                  className="flex"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  viewport={{ once: true }}
                >
                  {perfumes.map((perfume, index) => {
                    const image =
                      perfume.images?.find((img: any) => img.isPrimary) ||
                      perfume.images?.[0];
                    const discount = perfume.discountPrice
                      ? Math.round(
                          ((perfume.price - perfume.discountPrice) /
                            perfume.price) *
                            100
                        )
                      : 0;

                    // Extract all unique brands from collections
                    const collectionBrands = new Set<string>();
                    perfume.collections?.forEach((collection: any) => {
                      collection.filters?.brands?.forEach((brand: any) => {
                        collectionBrands.add(brand);
                      });
                    });

                    // Convert to array and add primary brand if not already included
                    const allBrands = [...collectionBrands];
                    if (perfume.brand && !allBrands.includes(perfume.brand)) {
                      allBrands.unshift(perfume.brand); // Add main brand at beginning if not in collections
                    }

                    const isHovered = hoveredCard === perfume._id;

                    return (
                      <motion.div
                        key={perfume._id}
                        className="flex-shrink-0 flex-grow-0 min-w-[280px] sm:min-w-[320px] md:min-w-[380px] px-2 sm:px-3 group flex flex-col transform transition-all duration-300"
                        variants={cardVariants}
                        onHoverStart={() => setHoveredCard(perfume._id)}
                        onHoverEnd={() => setHoveredCard(null)}
                        custom={index}
                      >
                        <motion.div
                          className="h-64 sm:h-80 md:h-[340px] overflow-hidden rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-300 relative"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          style={{
                            boxShadow: isHovered
                              ? "0 20px 30px -15px rgba(0,0,0,0.2)"
                              : "0 10px 30px -15px rgba(0,0,0,0.1)",
                          }}
                        >
                          <motion.div
                            onClick={() => goToProductPage(perfume._id)}
                            className="block h-full w-full"
                          >
                            <div className="relative h-full w-full bg-gray-100">
                              <Image
                                alt={image?.alt || perfume.name}
                                src={
                                  image?.url ||
                                  "/images/perfume-placeholder.jpg"
                                }
                                fill
                                sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 380px"
                                className="object-cover rounded-2xl transition-transform duration-700 ease-out group-hover:scale-110"
                                priority={index < 3}
                                style={{
                                  opacity: 1,
                                }}
                              />

                              {/* Enhanced gradient overlay with dynamic opacity */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-2xl"
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: isHovered ? 0.7 : 0.5 }}
                                transition={{ duration: 0.3 }}
                              />

                              {/* Brand badges with animation */}
                              <div className="absolute top-3 left-3 flex flex-col gap-2">
                                {allBrands.slice(0, 1).map((brand, idx) => (
                                  <motion.span
                                    key={idx}
                                    className="bg-black/70 backdrop-blur-md text-white text-xs uppercase 
                                          tracking-wider px-3 py-1 rounded-full font-medium"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 + idx * 0.1 }}
                                    whileHover={{
                                      backgroundColor: "rgba(0,0,0,0.9)",
                                      scale: 1.05,
                                    }}
                                  >
                                    {brand}
                                  </motion.span>
                                ))}
                              </div>

                              {/* Enhanced sale badge with animation */}
                              {perfume.discountPrice && (
                                <motion.div
                                  className="absolute bottom-3 left-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold px-3 py-1 
                                        rounded-full flex items-center justify-center shadow-lg"
                                  initial={{ scale: 0, rotate: -15 }}
                                  animate={{ scale: 1, rotate: -12 }}
                                  transition={{
                                    delay: 0.3 + index * 0.1,
                                    type: "spring",
                                    stiffness: 400,
                                  }}
                                  whileHover={{
                                    scale: 1.1,
                                    rotate: -5,
                                    transition: { duration: 0.2 },
                                  }}
                                >
                                  <motion.span
                                    animate={{
                                      scale: [1, 1.15, 1],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      repeatDelay: 3,
                                    }}
                                    className="text-sm flex items-center gap-1"
                                  >
                                    <Sparkles
                                      size={12}
                                      className="text-yellow-200"
                                    />
                                    -{discount}%
                                  </motion.span>
                                </motion.div>
                              )}

                              {/* Action buttons container - Removed wishlist button */}
                              <div className="absolute right-3 bottom-3">
                                {/* Add to cart button with success animation */}
                                <motion.button
                                  onClick={(e) => handleAddToCart(perfume, e)}
                                  className={`${
                                    addedToCart[perfume._id]
                                      ? "bg-green-500"
                                      : "bg-amber-500 hover:bg-amber-600"
                                  } cursor-pointer rounded-full p-2.5 shadow-lg transition-colors duration-300`}
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.5 + index * 0.1 }}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="Add to cart"
                                >
                                  <ShoppingBag
                                    size={16}
                                    className="text-white"
                                  />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>

                        {/* Enhanced product details with animations and glass effect */}
                        <motion.div
                          className="mt-4 px-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <motion.h3
                            className="font-playfair font-medium text-sm sm:text-base lg:text-lg text-gray-900 
                                dark:text-gray-100 line-clamp-1"
                            whileHover={{ x: 3 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <motion.div
                              onClick={() => goToProductPage(perfume._id)}
                            >
                              {perfume.name}
                            </motion.div>
                          </motion.h3>

                          {/* Additional product info */}
                          <motion.p
                            className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.8 }}
                            transition={{ delay: 0.35 + index * 0.1 }}
                          >
                            {perfume.category || "Eau de Parfum"} ·{" "}
                            {perfume.volume || "50ml"}
                          </motion.p>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-baseline gap-2">
                              {perfume.discountPrice ? (
                                <>
                                  <motion.span
                                    className="text-amber-600 dark:text-amber-500 font-semibold text-sm sm:text-base lg:text-lg"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    whileHover={{
                                      scale: 1.05,
                                      color: "#d97706", // amber-600 darker
                                      transition: { duration: 0.2 },
                                    }}
                                  >
                                    PKR{perfume.discountPrice.toFixed(2)}
                                  </motion.span>
                                  <motion.span
                                    className="text-gray-500 text-xs sm:text-sm line-through"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.7 }}
                                    transition={{ delay: 0.45 + index * 0.1 }}
                                  >
                                    PKR{perfume.price.toFixed(2)}
                                  </motion.span>
                                </>
                              ) : (
                                <motion.span
                                  className="text-gray-900 dark:text-gray-100 font-semibold text-sm sm:text-base lg:text-lg"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.4 + index * 0.1 }}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  PKR{perfume.price.toFixed(2)}
                                </motion.span>
                              )}
                            </div>

                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <motion.a
                                onClick={() => goToProductPage(perfume._id)}
                                className="text-xs sm:text-sm text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 transition-colors 
                                    border-b border-transparent hover:border-amber-600 dark:hover:border-amber-500"
                              >
                                View Details
                              </motion.a>
                            </motion.div>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-center mt-8 gap-4">
                <motion.button
                  onClick={scrollPrev}
                  disabled={prevBtnDisabled}
                  className={`p-3 rounded-full bg-white dark:bg-gray-800 shadow-md ${prevBtnDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                  whileHover={!prevBtnDisabled ? { scale: 1.1 } : {}}
                  whileTap={!prevBtnDisabled ? { scale: 0.95 } : {}}
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </motion.button>

                <motion.button
                  onClick={scrollNext}
                  disabled={nextBtnDisabled}
                  className={`p-3 rounded-full bg-white dark:bg-gray-800 shadow-md ${nextBtnDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                  whileHover={!nextBtnDisabled ? { scale: 1.1 } : {}}
                  whileTap={!nextBtnDisabled ? { scale: 0.95 } : {}}
                >
                  <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </motion.button>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Action buttons with improved styling and animations */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="relative inline-block"
          >
            <motion.span
              className="absolute -inset-1 rounded-full blur bg-gradient-to-r from-amber-300/40 to-amber-600/40 dark:from-amber-700/40 dark:to-amber-500/40 opacity-70"
              animate={{
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 3,
              }}
            />
            <Link
              href="/search"
              prefetch={true}
              className="relative inline-flex items-center gap-2 px-8 py-3 bg-black dark:bg-white dark:text-black text-white 
                        font-medium text-sm sm:text-base rounded-full transition-all duration-300 
                        shadow-sm hover:shadow-md"
            >
              <span>Explore All Perfumes</span>
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
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        .group {
          opacity: 1 !important;
        }
        .group img {
          opacity: 1 !important;
        }
        .group * {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}

export default FeaturedPerfumes;
