'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner';

// Interface for form data
interface CollectionFormData {
    name: string;
    description: string;
    isFeatured: boolean;
    displayOrder: number;
    isStatic: boolean;
    brands: string[];
    categories: string[];
    genders: string[];
    minPrice: number;
    maxPrice: number;
}

export default function CreateCollectionPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<CollectionFormData>({
        name: '',
        description: '',
        isFeatured: false,
        displayOrder: 0,
        isStatic: true,
        brands: [],
        categories: [],
        genders: [],
        minPrice: 0,
        maxPrice: 1000
    });

    const [brandInput, setBrandInput] = useState('');
    const [categoryInput, setCategoryInput] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle image change
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setImage(selectedFile);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    // Handle input change for text/number/checkbox fields
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle adding brands to the array
    const handleAddBrand = () => {
        if (brandInput.trim() && !formData.brands.includes(brandInput.trim())) {
            setFormData(prev => ({
                ...prev,
                brands: [...prev.brands, brandInput.trim()]
            }));
            setBrandInput('');
        }
    };

    // Handle removing a brand
    const handleRemoveBrand = (brand: string) => {
        setFormData(prev => ({
            ...prev,
            brands: prev.brands.filter(b => b !== brand)
        }));
    };

    // Handle adding categories to the array
    const handleAddCategory = () => {
        if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
            setFormData(prev => ({
                ...prev,
                categories: [...prev.categories, categoryInput.trim()]
            }));
            setCategoryInput('');
        }
    };

    // Handle removing a category
    const handleRemoveCategory = (category: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c !== category)
        }));
    };

    // Handle gender selection
    const handleGenderChange = (gender: string) => {
        if (formData.genders.includes(gender)) {
            setFormData(prev => ({
                ...prev,
                genders: prev.genders.filter(g => g !== gender)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                genders: [...prev.genders, gender]
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Create FormData for the API request
            const collectionFormData = new FormData();

            // Add text fields
            collectionFormData.append('name', formData.name);
            collectionFormData.append('description', formData.description);
            collectionFormData.append('isFeatured', formData.isFeatured.toString());
            collectionFormData.append('displayOrder', formData.displayOrder.toString());
            collectionFormData.append('isStatic', formData.isStatic.toString());

            // Add arrays
            formData.brands.forEach(brand => {
                collectionFormData.append('brands', brand);
            });

            formData.categories.forEach(category => {
                collectionFormData.append('categories', category);
            });

            formData.genders.forEach(gender => {
                collectionFormData.append('genders', gender);
            });

            // Add price range
            collectionFormData.append('minPrice', formData.minPrice.toString());
            collectionFormData.append('maxPrice', formData.maxPrice.toString());

            // Add image if present
            if (image) {
                collectionFormData.append('image', image);
            }

            // Submit the form data
            const response = await axios.post('/api/collections', collectionFormData);

            toast.success('Collection created successfully!');
            router.push('/admin/collections');
        } catch (error: any) {
            console.error('Error creating collection:', error);
            setError(error.response?.data?.error || 'Failed to create collection');
            toast.error(error.response?.data?.error || 'Failed to create collection');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Create New Collection</h1>
                <p className="text-gray-600">Add a new collection to showcase your products</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
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
                            />
                        </div>

                        {/* Display Order */}
                        <div>
                            <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-1">
                                Display Order
                            </label>
                            <input
                                type="number"
                                id="displayOrder"
                                name="displayOrder"
                                value={formData.displayOrder}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <p className="text-xs text-gray-500 mt-1">Lower numbers will be displayed first</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    {/* Feature flags */}
                    <div className="mt-4 flex flex-wrap gap-6">
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
                                Featured Collection
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isStatic"
                                name="isStatic"
                                checked={formData.isStatic}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                            />
                            <label htmlFor="isStatic" className="ml-2 block text-sm text-gray-700">
                                Static Collection
                            </label>
                            <span className="ml-1 text-xs text-gray-500">(vs. dynamic like "New Arrivals")</span>
                        </div>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold mb-4">Collection Image</h2>

                    <div className="mt-2 flex flex-col items-center">
                        {imagePreview ? (
                            <div className="mb-4">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-w-xs h-auto rounded-md"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center mb-4">
                                <p className="text-gray-500">No image selected</p>
                            </div>
                        )}

                        <label className="w-full flex flex-col items-center px-4 py-2 bg-white text-black rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-gray-100">
                            <svg className="w-6 h-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                            </svg>
                            <span className="mt-2 text-base">Upload Image</span>
                            <input
                                type='file'
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                </div>

                {/* Filter Settings */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold mb-4">Collection Filters</h2>

                    {/* Brands */}
                    <div className="mb-6">
                        <h3 className="text-md font-medium mb-2">Brands</h3>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={brandInput}
                                onChange={(e) => setBrandInput(e.target.value)}
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Add a brand"
                            />
                            <button
                                type="button"
                                onClick={handleAddBrand}
                                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                            >
                                Add
                            </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {formData.brands.map((brand, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
                                >
                                    <span>{brand}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveBrand(brand)}
                                        className="ml-2 text-gray-500 hover:text-red-500"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="mb-6">
                        <h3 className="text-md font-medium mb-2">Categories</h3>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={categoryInput}
                                onChange={(e) => setCategoryInput(e.target.value)}
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Add a category"
                            />
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                            >
                                Add
                            </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {formData.categories.map((category, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
                                >
                                    <span>{category}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCategory(category)}
                                        className="ml-2 text-gray-500 hover:text-red-500"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="mb-6">
                        <h3 className="text-md font-medium mb-2">Genders</h3>
                        <div className="flex space-x-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="gender-men"
                                    checked={formData.genders.includes('men')}
                                    onChange={() => handleGenderChange('men')}
                                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                                />
                                <label htmlFor="gender-men" className="ml-2 block text-sm text-gray-700">
                                    Men
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="gender-women"
                                    checked={formData.genders.includes('women')}
                                    onChange={() => handleGenderChange('women')}
                                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                                />
                                <label htmlFor="gender-women" className="ml-2 block text-sm text-gray-700">
                                    Women
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="gender-unisex"
                                    checked={formData.genders.includes('unisex')}
                                    onChange={() => handleGenderChange('unisex')}
                                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                                />
                                <label htmlFor="gender-unisex" className="ml-2 block text-sm text-gray-700">
                                    Unisex
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h3 className="text-md font-medium mb-2">Price Range</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="minPrice" className="block text-sm text-gray-700 mb-1">
                                    Min Price ($)
                                </label>
                                <input
                                    type="number"
                                    id="minPrice"
                                    name="minPrice"
                                    value={formData.minPrice}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label htmlFor="maxPrice" className="block text-sm text-gray-700 mb-1">
                                    Max Price ($)
                                </label>
                                <input
                                    type="number"
                                    id="maxPrice"
                                    name="maxPrice"
                                    value={formData.maxPrice}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                    min={formData.minPrice}
                                />
                            </div>
                        </div>
                    </div>
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
                        Create Collection
                    </button>
                </div>
            </form>
        </div>
    );
}