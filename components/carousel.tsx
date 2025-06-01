"use client";

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GridTileImage } from './grid/tile';

interface Perfume {
  _id: string;
  name: string;
  brand: string;
  price: number;
  discountPrice?: number;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  isFeatured: boolean;
}

export function FeaturedPerfumes() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPerfumes = async () => {
      try {
        // Using axios to fetch featured perfumes
        const response = await axios.get('/api/perfumes/featured');
        setPerfumes(response.data || []);
      } catch (error) {
        console.error('Error fetching featured perfumes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPerfumes();
  }, []);

  // If there are no perfumes and not loading, don't render anything
  if (!loading && !perfumes.length) return null;

  // Remove duplication - use original perfumes array
  const carouselPerfumes = perfumes;

  return (
    <section className="py-16 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl tracking-wider mb-3">FEATURED FRAGRANCES</h2>
          <div className="w-24 h-0.5 bg-amber-700 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-sans max-w-2xl mx-auto">
            Discover our most coveted scents, handpicked for their exceptional quality and allure.
          </p>
        </div>

        {loading ? (
          // Skeleton loader
          <div className="w-full overflow-x-auto pb-6 pt-1">
            <ul className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <li
                  key={i}
                  className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"
                />
              ))}
            </ul>
          </div>
        ) : (
          // Actual carousel
          <div className="w-full overflow-x-auto pb-6 pt-1">
            <ul className="flex gap-4">
              {carouselPerfumes.map((perfume) => {
                // Get the primary image or the first image
                const image = perfume.images?.find(img => img.isPrimary) || perfume.images?.[0];

                return (
                  <li
                    key={perfume._id}
                    className="relative aspect-square h-[40vh] max-h-[350px] w-2/3 max-w-[475px] flex-none md:w-1/3"
                  >
                    <Link href={`/product/${perfume._id}`} className="relative h-full w-full group">
                      <GridTileImage
                        alt={image?.alt || perfume.name}
                        label={{
                          title: perfume.name,
                          amount: perfume.discountPrice?.toString() || perfume.price.toString(),
                          currencyCode: 'USD',
                        }}
                        src={image?.url || '/images/perfume-placeholder.jpg'}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                        className="rounded-lg object-cover shadow-md transition-transform duration-300 group-hover:scale-105"
                      />
                      {perfume.discountPrice && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          SALE
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/collections/featured" className="inline-block px-6 py-3 bg-amber-500 text-white font-medium rounded-full hover:bg-amber-600 transition-colors">
            View All Featured Fragrances
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedPerfumes;