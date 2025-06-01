'use client';

import { useCart } from 'app/context/cartContext';
import { Suspense, useState } from 'react';

// Interface for PerfumeImage to match MongoDB schema
interface PerfumeImage {
    url: string;
    alt: string;
    isPrimary: boolean;
}

// Interface for Perfume to match MongoDB schema
interface Perfume {
    _id: string;
    name: string;
    brand: string;
    description: string;
    price: number;
    discountPrice?: number;
    volume: string;
    stock: number;
    gender: 'Male' | 'Female' | 'Unisex';
    images: PerfumeImage[];
    isNew: boolean;
    isBestseller: boolean;
    isFeatured: boolean;
    averageRating: number;
    totalReviews: number;
    collections?: string[];
}

// Client component that uses the useCart hook
export default function ProductClient({ product }: { product: Perfume }) {
    return (
        <Suspense fallback={<div className="w-full h-64 animate-pulse bg-gray-50" />}>
            <ProductDescription product={product} />
        </Suspense>
    );
}

function ProductDescription({ product }: { product: Perfume }) {
    // Volume options - you might want to fetch these from an API or config
    const volumeOptions = ['30ml', '50ml', '100ml'];

    // Selected volume state (initialize with product's volume)
    const [selectedVolume, setSelectedVolume] = useState(product.volume);

    // Cart functionality
    const { addToCart } = useCart();

    // Calculate discount percentage if discounted
    const discountPercentage = product.discountPrice
        ? Math.round((1 - (product.discountPrice / product.price)) * 100)
        : 0;

    return (
        <div className="flex flex-col gap-6">
            {/* Product Title and Brand */}
            <div>
                <p className="text-sm uppercase tracking-wider text-gray-500 mb-1 font-medium">{product.brand}</p>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">{product.name}</h1>

                {/* Price with potential discount */}
                <div className="mt-3 flex items-center gap-2">
                    {product.discountPrice ? (
                        <>
                            <p className="text-xl font-medium text-red-600">${product.discountPrice.toFixed(2)}</p>
                            <p className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</p>
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                                {discountPercentage}% OFF
                            </span>
                        </>
                    ) : (
                        <p className="text-xl font-medium text-gray-900">${product.price.toFixed(2)}</p>
                    )}
                </div>
            </div>

            {/* Rating and Stock Status */}
            <div className="flex items-center justify-between">
                {/* Rating display */}
                {product.totalReviews > 0 && (
                    <div className="flex items-center">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-4 w-4 ${i < Math.floor(product.averageRating) ? 'text-yellow-400' : 'text-gray-200'}`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="ml-1 text-sm text-gray-600">{product.averageRating.toFixed(1)}</span>
                        <span className="ml-1 text-sm text-gray-500">({product.totalReviews} reviews)</span>
                    </div>
                )}

                {/* Stock status */}
                <div className="text-sm">
                    {product.stock > 10 ? (
                        <span className="text-green-600 font-medium">In Stock</span>
                    ) : product.stock > 0 ? (
                        <span className="text-amber-600 font-medium">Low Stock ({product.stock} left)</span>
                    ) : (
                        <span className="text-red-600 font-medium">Out of Stock</span>
                    )}
                </div>
            </div>

            {/* Product Tags */}
            <div className="flex flex-wrap gap-2">
                {/* Gender tag */}
                <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-medium uppercase tracking-wider">
                    {product.gender}
                </span>

                {/* Status tags */}
                <div className="flex gap-2">
                    {product.isBestseller && (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-medium uppercase tracking-wider">
                            Bestseller
                        </span>
                    )}
                    {product.isNew && (
                        <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium uppercase tracking-wider">
                            New
                        </span>
                    )}
                    {product.isFeatured && (
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium uppercase tracking-wider">
                            Featured
                        </span>
                    )}
                </div>
            </div>

            {/* Volume Options */}
            <div>
                <label className="block text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">Volume</label>
                <div className="flex flex-wrap gap-2">
                    {volumeOptions.map((vol) => (
                        <button
                            key={vol}
                            onClick={() => setSelectedVolume(vol)}
                            className={`border ${vol === selectedVolume ? 'border-black bg-gray-100' : 'border-gray-300'} 
                            px-4 py-2 hover:border-black transition-colors text-sm`}
                        >
                            {vol}
                        </button>
                    ))}
                </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-2">
                <button
                    className={`w-full py-3.5 font-medium tracking-wide ${product.stock > 0
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        } transition-colors`}
                    onClick={() => product.stock > 0 && addToCart(product)}
                    disabled={product.stock === 0}
                >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none mt-4 border-t border-gray-100 pt-6">
                <h3 className="font-medium text-gray-900 uppercase tracking-wider text-sm mb-3">Description</h3>
                <div className="text-sm text-gray-600 leading-relaxed">
                    {product.description}
                </div>
            </div>

            {/* Collections (if available) */}
            {product.collections && product.collections.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-2">Collections</h3>
                    <div className="flex flex-wrap gap-2">
                        {product.collections.map((collection) => (
                            <span key={collection} className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-800 text-xs">
                                {collection}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Additional Information */}
            <div className="text-xs text-gray-500 mt-2">
                <p>Free shipping on orders over $50</p>
                <p className="mt-1">30-day returns</p>
            </div>
        </div>
    );
}