'use client';

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Collection {
    _id: string;
    name: string;
    description: string;
    image: string;
    isFeatured: boolean;
    displayOrder: number;
    isStatic: boolean;
    filters: {
        brands: string[];
        categories: string[];
        genders: string[];
        priceRange: {
            min: number;
            max: number;
        }
    };
    createdAt: string;
    updatedAt: string;
}

interface PaginationData {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export default function CollectionsPage() {
    const router = useRouter();
    const [collections, setCollections] = useState<Collection[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        featured: '',
        static: ''
    });

    // Fetch collections
    useEffect(() => {
        fetchCollections();
    }, [pagination.page, filters]);

    const fetchCollections = async () => {
        setLoading(true);
        try {
            // Build query string
            const params = new URLSearchParams();
            params.append('page', pagination.page.toString());
            params.append('limit', pagination.limit.toString());

            if (filters.featured) {
                params.append('featured', filters.featured);
            }

            if (filters.static) {
                params.append('static', filters.static);
            }

            const response = await axios.get(`/api/collections?${params.toString()}`);
            setCollections(response.data.collections);
            setPagination(response.data.pagination);
        } catch (error: any) {
            console.error('Error fetching collections:', error);
            setError(error.response?.data?.error || 'Failed to fetch collections');
            toast.error('Failed to load collections');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this collection?')) {
            return;
        }

        try {
            await axios.delete(`/api/collections/${id}`);
            toast.success('Collection deleted successfully');
            fetchCollections(); // Refresh the list
        } catch (error: any) {
            console.error('Error deleting collection:', error);
            toast.error(error.response?.data?.error || 'Failed to delete collection');
        }
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        // Reset to first page when filtering
        setPagination(prev => ({
            ...prev,
            page: 1
        }));
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Collections</h1>
                    <p className="text-gray-600">Manage your product collections</p>
                </div>
                <Link
                    href="/admin/collections/create"
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center"
                >
                    <span className="material-symbols-outlined mr-1">add</span>
                    New Collection
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="flex flex-wrap gap-4">
                    <div>
                        <label htmlFor="featured" className="block text-sm font-medium text-gray-700 mb-1">
                            Featured
                        </label>
                        <select
                            id="featured"
                            name="featured"
                            value={filters.featured}
                            onChange={handleFilterChange}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        >
                            <option value="">All</option>
                            <option value="true">Featured Only</option>
                            <option value="false">Non-Featured Only</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="static" className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <select
                            id="static"
                            name="static"
                            value={filters.static}
                            onChange={handleFilterChange}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        >
                            <option value="">All</option>
                            <option value="true">Static</option>
                            <option value="false">Dynamic</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Collections table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Image
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Featured
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : collections.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center">
                                        No collections found
                                    </td>
                                </tr>
                            ) : (
                                collections.map((collection) => (
                                    <tr key={collection._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {collection.image ? (
                                                <img
                                                    src={collection.image}
                                                    alt={collection.name}
                                                    className="h-12 w-12 object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-gray-400">collections</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{collection.name}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {collection.description || 'No description'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${collection.isStatic ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                {collection.isStatic ? 'Static' : 'Dynamic'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${collection.isFeatured ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {collection.isFeatured ? 'Featured' : 'Standard'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{collection.displayOrder}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/admin/collections/edit/${collection._id}`}
                                                className="text-black hover:text-gray-600 mr-4"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(collection._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${pagination.page <= 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page >= pagination.pages}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${pagination.page >= pagination.pages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing{' '}
                                    <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span>
                                    {' '}to{' '}
                                    <span className="font-medium">
                                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                                    </span>
                                    {' '}of{' '}
                                    <span className="font-medium">{pagination.total}</span>
                                    {' '}results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page <= 1}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${pagination.page <= 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                                    </button>
                                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                                        .filter(page =>
                                            page === 1 ||
                                            page === pagination.pages ||
                                            Math.abs(page - pagination.page) <= 1
                                        )
                                        .map((page, index, array) => {
                                            // Add ellipsis if needed
                                            if (index > 0 && array[index - 1] !== undefined && page - array[index - 1]! > 1) {
                                                return (
                                                    <span
                                                        key={`ellipsis-${page}`}
                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                                    >
                                                        ...
                                                    </span>
                                                );
                                            }

                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.page === page
                                                        ? 'bg-black text-white border-black'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })
                                    }
                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page >= pagination.pages}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${pagination.page >= pagination.pages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="sr-only">Next</span>
                                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}