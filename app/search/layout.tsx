"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { Perfume } from "lib/interfaces/data.type";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FilterSidebar from "./[collection]/filterSidebar";
import PerfumeGrid from "./[collection]/perfumeGrid";
import PerfumeHeader from "./[collection]/perfumeHeader";

// Updated - Changed brand to collection
interface Filters {
  collection: string[];
  gender: string[];
  price: { min: number; max: number };
  rating: number;
  onlyNew: boolean;
  onlyBestseller: boolean;
}

// Helper function to get effective price (discount or regular)
const getEffectivePrice = (perfume: any): number => {
  if (
    perfume.discountPrice !== undefined &&
    perfume.discountPrice !== null &&
    perfume.discountPrice !== ""
  ) {
    return typeof perfume.discountPrice === "number"
      ? perfume.discountPrice
      : parseFloat(String(perfume.discountPrice));
  }
  return typeof perfume.price === "number"
    ? perfume.price
    : parseFloat(String(perfume.price || 0));
};

export default function Perfumes() {
  // Get search params to read collection query
  const searchParams = useSearchParams();
  const collectionQuery = searchParams.get("q");

  // Add state for price range boundaries
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 200,
  });

  const [filters, setFilters] = useState<Filters>({
    collection: [], // Changed from brand to collection
    gender: [],
    price: { min: 0, max: 200 },
    rating: 0,
    onlyNew: false,
    onlyBestseller: false,
  });

  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [filteredPerfumes, setFilteredPerfumes] = useState<Perfume[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>("recommended");
  const [loading, setLoading] = useState<boolean>(true);
  const [collectionsLoaded, setCollectionsLoaded] = useState<boolean>(false);
  const [perfumesLoaded, setPerfumesLoaded] = useState<boolean>(false);
  const [collections, setCollections] = useState<
    { id: string; name: string }[]
  >([]); // Changed from brands to collections

  // Fetch perfumes from API
  useEffect(() => {
    axios
      .get("/api/perfumes")
      .then((res) => {
        const perfumesData = res.data.perfumes || [];
        setPerfumes(perfumesData);

        // Don't set filtered perfumes yet if we have a collection query
        // Only set them if there's no query, to avoid the flicker
        if (!collectionQuery) {
          setFilteredPerfumes(perfumesData);
        }

        // Calculate dynamic price range using the helper function
        if (perfumesData.length > 0) {
          const prices = perfumesData.map((p: any) => getEffectivePrice(p));

          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));

          // Set the dynamic price range
          setPriceRange({ min: minPrice, max: maxPrice });

          // Update filters with the dynamic price range
          setFilters((prev) => ({
            ...prev,
            price: { min: minPrice, max: maxPrice },
          }));
        }

        setPerfumesLoaded(true);
      })
      .catch((err) => {
        console.error("Error fetching perfumes:", err);
        setPerfumes([]);
        setFilteredPerfumes([]);
        setPerfumesLoaded(true); // Still mark as loaded even on error
      });
  }, [collectionQuery]);

  // Fetch collections
  useEffect(() => {
    axios
      .get("/api/collections")
      .then((res) => {
        const collectionData =
          res.data.collections?.map((collection: any) => ({
            id: collection._id,
            name: collection.name,
          })) || [];

        setCollections(collectionData);
        setCollectionsLoaded(true);
      })
      .catch((err) => {
        console.error("Error fetching collections:", err);
        setCollectionsLoaded(true); // Still mark as loaded even on error
      });
  }, []);

  // Set initial collection filter from query parameter
  useEffect(() => {
    // Only proceed if both collections and perfumes are loaded
    if (!collectionsLoaded || !perfumesLoaded) return;

    if (collectionQuery && collections.length > 0) {
      // Find the collection that matches the query parameter
      const matchingCollection = collections.find(
        (c) =>
          c.name.toLowerCase() ===
          decodeURIComponent(collectionQuery).toLowerCase()
      );

      if (matchingCollection) {
        console.log(`Auto-selecting collection: ${matchingCollection.name}`);
        // Set the collection in filters
        setFilters((prev) => ({
          ...prev,
          collection: [matchingCollection.name],
        }));
      }
    }

    // Turn off loading after both data sources are loaded and initial filtering is set
    setLoading(false);
  }, [collectionQuery, collections, collectionsLoaded, perfumesLoaded]);

  // Apply filters whenever they change
  useEffect(() => {
    // Skip filtering during initial load to prevent flicker
    if (loading) return;

    console.log("Applying filters:", filters);
    console.log("Available collections:", collections);

    let result = [...perfumes];

    // Apply all filters
    if (filters.collection.length) {
      // More robust collection filtering
      result = perfumes.filter((p) => {
        if (
          !p.collections ||
          !Array.isArray(p.collections) ||
          p.collections.length === 0
        ) {
          return false;
        }

        return p.collections.some((collection) => {
          // If collection is a string (ID)
          if (typeof collection === "string") {
            // Find matching collection by ID
            const collectionObj = collections.find((c) => c.id === collection);
            return (
              collectionObj && filters.collection.includes(collectionObj.name)
            );
          }
          // If collection is an object with name
          else if (
            typeof collection === "object" &&
            collection !== null &&
            "name" in collection &&
            typeof (collection as { name: string }).name === "string"
          ) {
            return filters.collection.includes(
              (collection as { name: string }).name
            );
          }
          return false;
        });
      });

      console.log(
        `Filtered to ${result.length} perfumes matching collections:`,
        filters.collection
      );
    }

    if (filters.gender.length) {
      result = result.filter((p) => filters.gender.includes(p.gender));
    }

    result = result.filter((p) => {
      const effectivePrice = getEffectivePrice(p);
      const rating = typeof p.averageRating === "number" ? p.averageRating : 0;
      return (
        effectivePrice >= filters.price.min &&
        effectivePrice <= filters.price.max &&
        rating >= filters.rating
      );
    });

    if (filters.onlyNew) result = result.filter((p) => p.isNew);
    if (filters.onlyBestseller) result = result.filter((p) => p.isBestseller);

    // Apply current sort option to filtered results
    applySorting(result, sortOption);
  }, [filters, perfumes, sortOption, loading, collections]); // Added collections dependency

  // Apply sorting without re-filtering, using helper function
  const applySorting = (perfumesToSort: Perfume[], option: string) => {
    console.log(`Sorting ${perfumesToSort.length} perfumes by: ${option}`);

    // If there are no results to sort, don't get stuck in an empty state
    if (perfumesToSort.length === 0) {
      console.log("No perfumes to sort, setting empty array");
      setFilteredPerfumes([]);
      return;
    }

    let sortedResults = [...perfumesToSort];

    if (option === "price-low") {
      sortedResults.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    } else if (option === "price-high") {
      sortedResults.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    } else if (option === "rating") {
      sortedResults.sort((a, b) => b.averageRating - a.averageRating);
    }

    console.log(`Setting ${sortedResults.length} sorted perfumes to state`);
    setFilteredPerfumes(sortedResults);
  };

  const toggleFilter = (type: keyof Filters, value: string) => {
    setFilters((prev) => {
      const prevArray = prev[type] as string[];
      if (Array.isArray(prevArray)) {
        const newValues = prevArray.includes(value)
          ? prevArray.filter((item) => item !== value)
          : [...prevArray, value];
        return { ...prev, [type]: newValues };
      }
      return prev;
    });
  };

  const updatePriceRange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      price: { min, max },
    }));
  };

  const updateRating = (rating: number) => {
    setFilters((prev) => ({
      ...prev,
      rating,
    }));
  };

  const toggleBooleanFilter = (type: "onlyNew" | "onlyBestseller") => {
    setFilters((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);

    // Apply sorting to current filtered perfumes without re-filtering
    applySorting([...filteredPerfumes], newSortOption);
  };

  const toggleMobileFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const resetFilters = () => {
    setFilters({
      collection: [],
      gender: [],
      price: { min: priceRange.min, max: priceRange.max },
      rating: 0,
      onlyNew: false,
      onlyBestseller: false,
    });

    setSortOption("recommended");
    // Reset to all perfumes with default sort
    applySorting([...perfumes], "recommended");
  };

  // Get unique gender list for the filter sidebar
  const genders = [...new Set(perfumes?.map((perfume) => perfume.gender))];

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

      <PerfumeHeader
        toggleMobileFiltersAction={toggleMobileFilters}
        showFilters={showFilters}
      />

      <motion.main
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.div className="flex flex-col md:flex-row gap-8" layout>
          <FilterSidebar
            showFilters={showFilters}
            filters={filters}
            collections={collections}
            genders={genders}
            toggleFilter={toggleFilter}
            updatePriceRange={updatePriceRange}
            updateRating={updateRating}
            toggleBooleanFilter={toggleBooleanFilter}
            resetFilters={resetFilters}
            priceRange={priceRange}
          />

          {loading ? (
            <PerfumeGridSkeleton />
          ) : (
            <PerfumeGrid
              filteredPerfumes={filteredPerfumes}
              sortOption={sortOption}
              handleSortChangeAction={handleSortChange}
              resetFiltersAction={resetFilters}
            />
          )}
        </motion.div>
      </motion.main>
    </motion.div>
  );
}

// Enhanced skeleton component with animations
function PerfumeGridSkeleton() {
  return (
    <motion.div
      className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="animate-pulse bg-gray-100 rounded-lg h-64"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        />
      ))}
    </motion.div>
  );
}
