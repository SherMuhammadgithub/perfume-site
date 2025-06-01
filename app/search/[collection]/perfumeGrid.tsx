'use client';

import { useCart } from "app/context/cartContext";
import { Perfume } from "lib/interfaces/data.type";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface PerfumeGridProps {
    filteredPerfumes: Perfume[];
    sortOption: string;
    handleSortChangeAction: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    resetFiltersAction: () => void;
}

export default function PerfumeGrid({
    filteredPerfumes,
    sortOption,
    handleSortChangeAction,
    resetFiltersAction
}: PerfumeGridProps) {
    const { addToCart } = useCart();
    const router = useRouter();

    const goToProductPage = (id: string) => {
        router.push(`/product/${id}`);
    };

    return (
        <div className="flex-1">
            {/* Sort and Results Count */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <p className="text-sm text-gray-500 mb-2 sm:mb-0">
                    Showing <span className="font-medium">{filteredPerfumes.length}</span> products
                </p>

            </div>

            {/* Products Grid */}
            {filteredPerfumes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                    {filteredPerfumes?.map((perfume) => (
                        <div key={perfume._id} className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div
                                className="aspect-w-4 aspect-h-5 relative"
                                onClick={() => goToProductPage(perfume._id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="h-64 relative bg-gray-50">
                                    {perfume.images && perfume.images.length > 0 ? (
                                        <Image
                                            src={perfume.images[0]?.url || "/placeholder.png"}
                                            alt={perfume.images[0]?.alt || perfume.name}
                                            fill
                                            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                                            className="object-contain object-center p-2" // Added padding for a bit of space
                                            priority={false}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gray-200 bg-gradient-to-b from-transparent to-gray-100 flex items-center justify-center">
                                            <span className="text-2xl font-light text-gray-500">{perfume.name}</span>
                                        </div>
                                    )}

                                    {/* Badges */}
                                    <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
                                        {perfume.isNew && (
                                            <span className="bg-black text-center text-white text-xs px-2 py-1 rounded-full">New</span>
                                        )}
                                        {perfume.isBestseller && (
                                            <span className="bg-amber-500 text-center text-white text-xs px-2 py-1 rounded-full">Bestseller</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-medium text-gray-900">{perfume.name}</h3>
                                <p className="text-sm text-gray-500">{perfume.brand}</p>
                                <div className="mt-2 flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-4 w-4 ${i < Math.floor(perfume.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="ml-1 text-xs text-gray-500">{perfume.averageRating}</span>
                                </div>
                                <div className="mt-2 flex justify-between items-center">
                                    <p className="text-lg font-medium text-gray-900">${perfume.price.toFixed(2)}</p>
                                    <p className="text-sm text-gray-500">{perfume.volume}</p>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {perfume.category}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {perfume.gender}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <button
                                        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
                                        onClick={() => addToCart(perfume)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                    <button
                        onClick={resetFiltersAction}
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );
}