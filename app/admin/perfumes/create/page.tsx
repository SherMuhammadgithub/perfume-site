'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Collection {
    _id: string;
    name: string;
}

interface PerfumeFormData {
    name: string;
    description: string;
    price: number;
    discountPrice: number | '';
    volume: string;
    stock: number;
    gender: string;
    isNew: boolean;
    isBestseller: boolean;
    isFeatured: boolean;
    collections: string[];
}

export default function CreatePerfumePage() {
    const router = useRouter();
    const [formData, setFormData] = useState<PerfumeFormData>({
        name: '',
        description: '',
        price: 0,
        discountPrice: '',
        volume: '',
        stock: 0,
        gender: '',
        isNew: false,
        isBestseller: false,
        isFeatured: false,
        collections: [],
    });

    const [images, setImages] = useState<File[]>([]);
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loadingCollections, setLoadingCollections] = useState(true);

    // Fetch collections for the dropdown
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await axios.get('/api/collections?limit=100');
                setCollections(response.data.collections);
            } catch (error) {
                console.error('Error fetching collections:', error);
                toast.error('Failed to load collections');
            } finally {
                setLoadingCollections(false);
            }
        };

        fetchCollections();
    }, []);

    // Handle image change
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const selectedFiles = Array.from(e.target.files);
        const newImages = [...images, ...selectedFiles].slice(0, 5); // Limit to 5 images
        setImages(newImages);

        // Generate previews
        const newPreviews = newImages.map(file => URL.createObjectURL(file));
        setImagePreview(newPreviews);
    };

    // Remove an image
    const handleRemoveImage = (index: number) => {
        const newImages = [...images];
        const newPreviews = [...imagePreview];

        // Revoke URL to prevent memory leaks
        if (newPreviews[index]) {
            URL.revokeObjectURL(newPreviews[index] as string);
        }

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setImages(newImages);
        setImagePreview(newPreviews);
    };

    // Handle input change for text/number/checkbox fields
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'price' || name === 'stock') {
            // Parse as number for price and stock
            setFormData(prev => ({
                ...prev,
                [name]: value === '' ? 0 : parseFloat(value)
            }));
        } else if (name === 'discountPrice') {
            // Allow empty discount price
            setFormData(prev => ({
                ...prev,
                [name]: value === '' ? '' : parseFloat(value)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle collection selection change
    const handleCollectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({
            ...prev,
            collections: selectedOptions
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Validate form data
        if (!formData.name.trim()) {
            setError('Perfume name is required');
            setLoading(false);
            return;
        }

        if (!formData.description.trim()) {
            setError('Description is required');
            setLoading(false);
            return;
        }

        if (!formData.volume.trim()) {
            setError('Volume is required');
            setLoading(false);
            return;
        }

        if (formData.price <= 0) {
            setError('Price must be greater than 0');
            setLoading(false);
            return;
        }

        if (formData.discountPrice !== '' && formData.discountPrice >= formData.price) {
            setError('Discount price must be less than the regular price');
            setLoading(false);
            return;
        }

        if (!formData.gender) {
            setError('Please select a gender category');
            setLoading(false);
            return;
        }

        if (images.length === 0) {
            setError('Please upload at least one image');
            setLoading(false);
            return;
        }

        // Collection validation - require at least one collection
        if (formData.collections.length === 0) {
            setError('Please select at least one collection');
            setLoading(false);
            return;
        }

        try {
            // Create FormData for the API request
            const perfumeFormData = new FormData();

            // Add text fields
            perfumeFormData.append('name', formData.name);
            perfumeFormData.append('description', formData.description);
            perfumeFormData.append('price', formData.price.toString());
            perfumeFormData.append('volume', formData.volume);
            perfumeFormData.append('stock', formData.stock.toString());
            perfumeFormData.append('gender', formData.gender);

            if (formData.discountPrice !== '') {
                perfumeFormData.append('discountPrice', formData.discountPrice.toString());
            }

            // Add boolean flags
            perfumeFormData.append('isNew', formData.isNew.toString());
            perfumeFormData.append('isBestseller', formData.isBestseller.toString());
            perfumeFormData.append('isFeatured', formData.isFeatured.toString());

            // Add collections
            formData.collections.forEach(collectionId => {
                perfumeFormData.append('collections', collectionId);
            });

            // Add images
            images.forEach((image, index) => {
                perfumeFormData.append(`image${index}`, image);
            });

            // Submit the form data
            const response = await axios.post('/api/perfumes', perfumeFormData);

            toast.success('Perfume created successfully!');
            router.push('/admin/perfumes');
        } catch (error: any) {
            console.error('Error creating perfume:', error);
            setError(error.response?.data?.error || 'Failed to create perfume');
            toast.error(error.response?.data?.error || 'Failed to create perfume');
        } finally {
            setLoading(false);
        }
    };

    // Clean up image preview URLs when component unmounts
    useEffect(() => {
        return () => {
            imagePreview.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Add New Perfume</h1>
                <p className="text-gray-600">Create a new perfume product</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold mb-4">Basic Information</h2>

                    {/* Name - Now as a single field since Brand is removed */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="e.g. Chanel No. 5"
                        />
                    </div>

                    {/* Description */}
                    <div className="mt-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={6}
                            required
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Enter a detailed description of the perfume..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        {/* Price */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                Price ($) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                required
                                min="0.01"
                                step="0.01"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="e.g. 99.99"
                            />
                        </div>

                        {/* Discount Price */}
                        <div>
                            <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                Discount Price ($)
                            </label>
                            <input
                                type="number"
                                id="discountPrice"
                                name="discountPrice"
                                min="0"
                                step="0.01"
                                value={formData.discountPrice}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Optional"
                            />
                        </div>

                        {/* Volume */}
                        <div>
                            <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">
                                Volume <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="volume"
                                name="volume"
                                required
                                value={formData.volume}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="e.g. 100ml"
                            />
                        </div>
                    </div>
                </div>

                {/* Inventory & Categorization */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold mb-4">Inventory & Categorization</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Stock */}
                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                                Stock Quantity
                            </label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                min="0"
                                value={formData.stock}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="e.g. 50"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                required
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Men</option>
                                <option value="Female">Women</option>
                                <option value="Unisex">Unisex</option>
                            </select>
                        </div>
                    </div>

                    {/* Collections - Now required and more prominent */}
                    <div className="mt-4">
                        <label htmlFor="collections" className="block text-sm font-medium text-gray-700 mb-1">
                            Collections <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                            Select collections this perfume belongs to (including brand collections)
                        </p>
                        {loadingCollections ? (
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                                <span className="text-sm text-gray-500">Loading collections...</span>
                            </div>
                        ) : (
                            <select
                                id="collections"
                                name="collections"
                                multiple
                                required
                                value={formData.collections}
                                onChange={handleCollectionChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                size={4}
                            >
                                {collections.map(collection => (
                                    <option key={collection._id} value={collection._id}>
                                        {collection.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Hold Ctrl (or Cmd on Mac) to select multiple collections
                        </p>
                    </div>

                    {/* Feature flags */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isNew"
                                name="isNew"
                                checked={formData.isNew}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                            />
                            <label htmlFor="isNew" className="ml-2 block text-sm text-gray-700">
                                Mark as New
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isBestseller"
                                name="isBestseller"
                                checked={formData.isBestseller}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                            />
                            <label htmlFor="isBestseller" className="ml-2 block text-sm text-gray-700">
                                Mark as Bestseller
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isFeatured"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                            />
                            <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                                Feature on Homepage
                            </label>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold mb-4">Product Images</h2>
                    <p className="text-sm text-gray-600 mb-4">Upload up to 5 images. First image will be the main product image.</p>

                    {/* Image preview */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        {imagePreview.map((preview, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="h-32 w-full object-cover rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                    &times;
                                </button>
                                {index === 0 && (
                                    <span className="absolute bottom-1 left-1 bg-black text-white text-xs px-2 py-1 rounded">
                                        Main
                                    </span>
                                )}
                            </div>
                        ))}

                        {imagePreview.length < 5 && (
                            <label className="h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                <span className="mt-2 text-sm text-gray-500">Add Image</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                    </div>

                    {/* Upload button */}
                    {imagePreview.length === 0 && (
                        <div className="flex justify-center">
                            <label className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 cursor-pointer flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                Upload Images
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 flex items-center"
                    >
                        {loading && (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        Create Perfume
                    </button>
                </div>
            </form>
        </div>
    );
}