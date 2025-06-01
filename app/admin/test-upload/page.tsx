'use client';

import { useState } from 'react';

export default function TestUpload() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData(e.currentTarget);

            const response = await fetch('/api/perfumes', {
                method: 'POST',
                body: formData,
                // Don't set Content-Type - browser will set it with boundary for FormData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create perfume');
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Test Perfume Upload API</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Name:</label>
                    <input name="name" required className="border p-2 w-full" />
                </div>

                <div>
                    <label className="block mb-1">Brand:</label>
                    <input name="brand" required className="border p-2 w-full" />
                </div>

                <div>
                    <label className="block mb-1">Description:</label>
                    <textarea name="description" required className="border p-2 w-full" rows={3}></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">Price:</label>
                        <input name="price" type="number" step="0.01" min="0" required className="border p-2 w-full" />
                    </div>

                    <div>
                        <label className="block mb-1">Discount Price (optional):</label>
                        <input name="discountPrice" type="number" step="0.01" min="0" className="border p-2 w-full" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">Volume:</label>
                        <input name="volume" required className="border p-2 w-full" placeholder="e.g. 50ml" />
                    </div>

                    <div>
                        <label className="block mb-1">Stock:</label>
                        <input name="stock" type="number" min="0" required className="border p-2 w-full" />
                    </div>
                </div>

                <div>
                    <label className="block mb-1">Gender:</label>
                    <select name="gender" required className="border p-2 w-full">
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Unisex">Unisex</option>
                    </select>
                </div>

                <div className="flex gap-4">
                    <div>
                        <input name="isNew" type="checkbox" id="isNew" />
                        <label htmlFor="isNew" className="ml-2">Is New</label>
                    </div>

                    <div>
                        <input name="isBestseller" type="checkbox" id="isBestseller" />
                        <label htmlFor="isBestseller" className="ml-2">Is Bestseller</label>
                    </div>

                    <div>
                        <input name="isFeatured" type="checkbox" id="isFeatured" />
                        <label htmlFor="isFeatured" className="ml-2">Is Featured</label>
                    </div>
                </div>

                <div>
                    <label className="block mb-1">Images (max 5):</label>
                    <input
                        name="images"
                        type="file"
                        accept="image/*"
                        multiple
                        className="border p-2 w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">Select up to 5 images (JPG, PNG)</p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                    {loading ? 'Uploading...' : 'Create Perfume'}
                </button>
            </form>

            {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-700 rounded">
                    <h2 className="font-bold">Error:</h2>
                    <p>{error}</p>
                </div>
            )}

            {result && (
                <div className="mt-6">
                    <h2 className="font-bold">Success! Perfume Created:</h2>
                    <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>

                    {result.images?.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-bold">Uploaded Images:</h3>
                            <div className="flex gap-4 mt-2 overflow-x-auto">
                                {result.images.map((img: any, i: number) => (
                                    <div key={i} className="min-w-[200px]">
                                        <img
                                            src={img.url}
                                            alt={img.alt}
                                            className="w-full h-auto border rounded"
                                        />
                                        <p className="text-xs mt-1 text-center">{img.isPrimary ? 'Primary' : 'Additional'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}