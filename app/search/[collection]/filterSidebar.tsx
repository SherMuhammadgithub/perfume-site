'use client';

interface FilterSidebarProps {
    showFilters: boolean;
    filters: {
        brand: string[];
        gender: string[];
        price: { min: number; max: number };
        rating: number;
        onlyNew: boolean;
        onlyBestseller: boolean;
    };
    brands: string[];
    genders: string[];
    toggleFilter: (type: 'brand' | 'gender', value: string) => void;
    updatePriceRange: (min: number, max: number) => void;
    updateRating: (rating: number) => void;
    toggleBooleanFilter: (type: 'onlyNew' | 'onlyBestseller') => void;
    resetFilters: () => void;
}

export default function FilterSidebar({
    showFilters,
    filters,
    brands,
    genders,
    toggleFilter,
    updatePriceRange,
    updateRating,
    toggleBooleanFilter,
    resetFilters
}: FilterSidebarProps) {
    return (
        <aside
            className={`
                ${showFilters ? 'block' : 'hidden'} 
                md:block 
                md:sticky 
                md:top-4 
                md:self-start 
                md:w-64 
                bg-white 
                rounded-lg 
                shadow-md 
                p-6
            `}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                    <button
                        onClick={resetFilters}
                        className="text-sm text-black hover:text-gray-800"
                    >
                        Clear All
                    </button>
                </div>



                {/* Brand Filter */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Brand</h3>
                    <div className="space-y-2">
                        {brands.map(brand => (
                            <div key={brand} className="flex items-center">
                                <input
                                    id={`brand-${brand}`}
                                    name={`brand-${brand}`}
                                    type="checkbox"
                                    className="h-4 w-4 text-black focus:ring-gray-500 border-gray-300 rounded"
                                    checked={filters.brand.includes(brand)}
                                    onChange={() => toggleFilter('brand', brand)}
                                />
                                <label htmlFor={`brand-${brand}`} className="ml-3 text-sm text-gray-600">
                                    {brand}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gender Filter */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Gender</h3>
                    <div className="space-y-2">
                        {genders.map(gender => (
                            <div key={gender} className="flex items-center">
                                <input
                                    id={`gender-${gender}`}
                                    name={`gender-${gender}`}
                                    type="checkbox"
                                    className="h-4 w-4 text-black focus:ring-gray-500 border-gray-300 rounded"
                                    checked={filters.gender.includes(gender)}
                                    onChange={() => toggleFilter('gender', gender)}
                                />
                                <label htmlFor={`gender-${gender}`} className="ml-3 text-sm text-gray-600">
                                    {gender}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Range Filter */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Price Range</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">${filters.price.min}</span>
                            <span className="text-sm text-gray-500">${filters.price.max}</span>
                        </div>
                        <div className="flex space-x-2">
                            <input
                                type="range"
                                min="0"
                                max="150"
                                step="10"
                                value={filters.price.min}
                                onChange={(e) => updatePriceRange(parseInt(e.target.value), filters.price.max)}
                                className="w-full"
                            />
                            <input
                                type="range"
                                min="0"
                                max="150"
                                step="10"
                                value={filters.price.max}
                                onChange={(e) => updatePriceRange(filters.price.min, parseInt(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Rating Filter */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Minimum Rating</h3>
                    <div className="flex items-center space-x-1">
                        {[0, 1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => updateRating(star)}
                                className={`h-8 w-8 flex items-center justify-center ${filters.rating >= star && star > 0 ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                            >
                                {star === 0 ? (
                                    <span className="text-sm text-gray-500">Any</span>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Special Filters */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Special</h3>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                id="new-arrivals"
                                name="new-arrivals"
                                type="checkbox"
                                className="h-4 w-4 text-black focus:ring-gray-500 border-gray-300 rounded"
                                checked={filters.onlyNew}
                                onChange={() => toggleBooleanFilter('onlyNew')}
                            />
                            <label htmlFor="new-arrivals" className="ml-3 text-sm text-gray-600">
                                New Arrivals
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="bestsellers"
                                name="bestsellers"
                                type="checkbox"
                                className="h-4 w-4 text-black focus:ring-gray-500 border-gray-300 rounded"
                                checked={filters.onlyBestseller}
                                onChange={() => toggleBooleanFilter('onlyBestseller')}
                            />
                            <label htmlFor="bestsellers" className="ml-3 text-sm text-gray-600">
                                Bestsellers
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
