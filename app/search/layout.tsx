'use client';

import axios from 'axios';
import { Perfume } from 'lib/interfaces/data.type';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import FilterSidebar from './[collection]/filterSidebar';
import PerfumeGrid from './[collection]/perfumeGrid';
import PerfumeHeader from './[collection]/perfumeHeader';

// Define the type for the filters state
interface Filters {
  brand: string[];
  gender: string[];
  price: { min: number; max: number };
  rating: number;
  onlyNew: boolean;
  onlyBestseller: boolean;
}

export default function Perfumes() {
  const [filters, setFilters] = useState<Filters>({
    brand: [],
    gender: [],
    price: { min: 0, max: 150 },
    rating: 0,
    onlyNew: false,
    onlyBestseller: false,
  });

  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [filteredPerfumes, setFilteredPerfumes] = useState<Perfume[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>('recommended');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch perfumes from API
  useEffect(() => {
    setLoading(true);
    axios.get('/api/perfumes')
      .then(res => {
        console.log('Fetched perfumes:', res.data);
        setPerfumes(res.data.perfumes || []);
        setFilteredPerfumes(res.data.perfumes || []);
      })
      .catch(err => {
        setPerfumes([]);
        setFilteredPerfumes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // First useEffect - handle filtering
  useEffect(() => {
    let result = [...perfumes];

    // Filtering logic
    if (filters.brand.length)
      result = result.filter(p => filters.brand.includes(p.brand));
    if (filters.gender.length)
      result = result.filter(p => filters.gender.includes(p.gender));
    result = result.filter(
      p =>
        p.price >= filters.price.min &&
        p.price <= filters.price.max &&
        p.averageRating >= filters.rating
    );
    if (filters.onlyNew) result = result.filter(p => p.isNew);
    if (filters.onlyBestseller) result = result.filter(p => p.isBestseller);

    // Store filtered results in a separate state that doesn't trigger the sort effect
    setFilteredPerfumes(result);
  }, [filters, perfumes]);


  const toggleFilter = (type: keyof Filters, value: string) => {
    setFilters(prev => {
      const prevArray = prev[type] as string[];
      if (Array.isArray(prevArray)) {
        const newValues = prevArray.includes(value)
          ? prevArray.filter(item => item !== value)
          : [...prevArray, value];
        return { ...prev, [type]: newValues };
      }
      return prev;
    });
  };

  const updatePriceRange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      price: { min, max }
    }));
  };

  const updateRating = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      rating
    }));
  };

  const toggleBooleanFilter = (type: 'onlyNew' | 'onlyBestseller') => {
    setFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    console.log('Selected sort option:', e.target.value);
    // sort the perfumes based on the selected option
    // let sortedPerfumes = [...filteredPerfumes];
    // if (e.target.value === 'price-low') {
    //   sortedPerfumes.sort((a, b) => a.price - b.price);
    // } else if (e.target.value === 'price-high') {
    //   sortedPerfumes.sort((a, b) => b.price - a.price);
    // } else if (e.target.value === 'rating') {
    //   sortedPerfumes.sort((a, b) => b.rating - a.rating);
    // } else {
    //   sortedPerfumes = [...PERFUMES]; // Reset to original order
    // }

    // update the filtered perfumes
    // setFilteredPerfumes(sortedPerfumes);s
  };

  const toggleMobileFilters = () => {
    setShowFilters(prev => !prev);
  };

  const resetFilters = () => {
    setFilters({
      brand: [],
      gender: [],
      price: { min: 0, max: 150 },
      rating: 0,
      onlyNew: false,
      onlyBestseller: false,
    });
  };

  // Get unique categories, brands, genders from perfumes

  const brands = [...new Set(perfumes?.map(perfume => perfume.brand))];
  const genders = [...new Set(perfumes?.map(perfume => perfume.gender))];

  return (
    <>
      <Head>
        <title>Luxury Perfumes Collection</title>
        <meta name="description" content="Explore our exclusive collection of luxury perfumes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PerfumeHeader
        toggleMobileFiltersAction={toggleMobileFilters}
        showFilters={showFilters}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar
            showFilters={showFilters}
            filters={filters}
            brands={brands}
            genders={genders}
            toggleFilter={toggleFilter}
            updatePriceRange={updatePriceRange}
            updateRating={updateRating}
            toggleBooleanFilter={toggleBooleanFilter}
            resetFilters={resetFilters}
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
        </div>
      </main>
    </>
  );
}

// Simple skeleton component for loading state
function PerfumeGridSkeleton() {
  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-64" />
      ))}
    </div>
  );
}
