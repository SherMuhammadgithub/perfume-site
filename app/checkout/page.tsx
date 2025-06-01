'use client';

import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '../context/cartContext';

export default function CheckoutPage() {
    const { cart, subtotal, clearCart } = useCart();
    const router = useRouter();

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Shipping cost calculation - free for orders over $100
    const shippingCost = subtotal > 100 ? 0 : 5.99;
    const tax = +(subtotal * 0.08).toFixed(2);
    const total = +(subtotal + shippingCost + tax).toFixed(2);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const orderData = {
                customer: {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                },
                shippingAddress: {
                    address: form.address,
                    city: form.city,
                    postalCode: form.postalCode,
                    country: form.country,
                },
                items: cart.map(item => ({
                    perfume: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
                subtotal,
                shippingCost,
                tax,
                total,
                paymentMethod: 'Cash on Delivery',
            };

            const response = await axios.post('/api/orders', orderData);

            // Store order info in sessionStorage for confirmation page
            sessionStorage.setItem('lastOrder', JSON.stringify({
                orderNumber: response.data.orderNumber,
                ...orderData
            }));

            clearCart();
            router.push('/checkout/confirmation');
        } catch (err: any) {
            console.error('Order submission error:', err);
            setError(err?.response?.data?.error || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <p className="mb-6">Add some products to your cart before checkout.</p>
                <Link href="/perfumes" className="bg-black text-white px-6 py-2 rounded">
                    Shop Perfumes
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-serif font-bold mb-8 text-center">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Customer & Shipping Information Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6 pb-2 border-b">Customer Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold mb-6 pb-2 border-b mt-8">Shipping Address</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    required
                                    value={form.address}
                                    onChange={handleChange}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        required
                                        value={form.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                                    <input
                                        id="postalCode"
                                        name="postalCode"
                                        type="text"
                                        required
                                        value={form.postalCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                                    <input
                                        id="country"
                                        name="country"
                                        type="text"
                                        required
                                        value={form.country}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                        <h2 className="text-xl font-bold mb-6 pb-2 border-b">Order Summary</h2>

                        <div className="max-h-80 overflow-y-auto mb-4">
                            {cart.map((item) => (
                                <div key={`${item._id}-${item.volume}`} className="flex py-4 border-b">
                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        {item.image && (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={80}
                                                height={80}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        )}
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col">
                                        <div>
                                            <div className="flex justify-between text-sm font-medium text-gray-900">
                                                <h3>{item.name}</h3>
                                                <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {item.volume} · Qty {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Shipping</span>
                                <span>
                                    {shippingCost === 0
                                        ? 'Free'
                                        : `$${shippingCost.toFixed(2)}`
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Tax (8%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-base font-medium pt-2 border-t">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="rounded-md bg-gray-50 p-4 mb-4">
                                <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-900">Payment Method:</span>
                                    <span className="ml-2 text-sm text-gray-700">Cash on Delivery</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                            >
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>

                            {error && (
                                <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}