'use client';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
function CollectionCard({ _id, name, description, image, isFeatured, displayOrder, isStatic, filters }: CollectionCardProps) {
  return (
    <div className="card group relative overflow-hidden rounded-lg shadow-lg h-80 transition-transform duration-500 hover:shadow-xl hover:-translate-y-1">
      <div className="relative w-full h-full">
        <Image
          src={image || '/images/placeholder.png'}
          alt={name}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="absolute inset-0 card-overlay bg-black bg-opacity-30"></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
        <span className="card-label bg-white bg-opacity-90 px-6 py-3 font-sans text-sm tracking-widest uppercase font-medium">
          {name}
        </span>
        <Link href={`/collections/${_id}`} className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className={`${isFeatured ? 'bg-amber-500' : 'bg-gray-500'} text-white px-5 py-2 rounded-full text-xs uppercase tracking-wider font-medium hover:bg-opacity-90`}
          >
            {isFeatured ? 'Featured' : 'View Collection'}
          </button>
        </Link>
      </div>
    </div>
  );
}

export function ThreeItemGrid() {
  // Collection data with styling information

  const [collections, setCollections] = useState<CollectionCardProps[]>([]);

  async function fetchCollections() {
    // use axios to fetch collections from the API
    const response = await axios.get('/api/collections');
    return response.data;
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCollections();
      setCollections(data);
    };
    fetchData();
  }, []);

  // Fragrance types for the buttons at the bottom
  const fragranceTypes = ['Floral', 'Woody', 'Oriental', 'Fresh', 'Citrus'];

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="font-serif text-4xl md:text-5xl tracking-wider mb-3">OUR PRODUCT COLLECTIONS</h2>
        <div className="w-24 h-0.5 bg-amber-700 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-sans max-w-2xl mx-auto">
          Discover our exquisite range of fragrances crafted with the finest ingredients to elevate your personal essence.
        </p>
      </div>

      {/* Collection Cards - 4 column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map((collection, index) => (
          <CollectionCard
            key={index}
            _id={collection._id}
            name={collection.name}
            description={collection.description}
            image={collection.image}
            isFeatured={collection.isFeatured}
            displayOrder={collection.displayOrder}
            isStatic={collection.isStatic}
            filters={collection.filters}
          />
        ))}
      </div>

      {/* Additional Feature - Featured Fragrances */}
      <div className="mt-16 text-center">
        <h3 className="font-serif text-2xl mb-6">Featured Fragrances</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {fragranceTypes.map((type, index) => (
            <Link
              key={index}
              href={`/fragrances/${type.toLowerCase()}`}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:bg-gray-50 hover:border-amber-600 transition-colors cursor-pointer"
            >
              {type}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ThreeItemGrid;