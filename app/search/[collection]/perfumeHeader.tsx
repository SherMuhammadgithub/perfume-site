'use client';

interface PerfumeHeaderProps {
    toggleMobileFiltersAction: () => void;
    showFilters: boolean;
}

export default function PerfumeHeader({ toggleMobileFiltersAction, showFilters }: PerfumeHeaderProps) {
    return (
        <>
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Luxury Perfumes</h1>
                    <p className="mt-2 text-gray-600">Discover your signature scent from our exquisite collection</p>
                </div>
            </header>

            {/* Mobile Filter Toggle Button - Only visible on small screens */}
            <div className="md:hidden sticky top-0 z-10 bg-white shadow-md p-4">
                <button
                    onClick={toggleMobileFiltersAction}
                    className="w-full py-2 px-4 bg-gray-800 text-white rounded-md flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 6a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm4 6a1 1 0 011-1h6a1 1 0 010 2h-6a1 1 0 01-1-1z" />
                    </svg>
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>
        </>
    );
}