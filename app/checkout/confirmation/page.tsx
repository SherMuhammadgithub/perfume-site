'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OrderItem {
    name: string;
    price: number;
    quantity: number;
}

interface OrderSummary {
    orderNumber: string;
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    paymentMethod: string;
}

export default function OrderConfirmation() {
    const router = useRouter();
    const [order, setOrder] = useState<OrderSummary | null>(null);

    useEffect(() => {
        const lastOrder = sessionStorage.getItem('lastOrder');

        if (!lastOrder) {
            // No order found, redirect to home
            router.push('/');
            return;
        }

        try {
            setOrder(JSON.parse(lastOrder));
        } catch (error) {
            console.error('Error parsing order data:', error);
            router.push('/');
        }
    }, [router]);

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 my-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center mb-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
                    <h1 className="text-3xl font-serif font-bold">Thank You For Your Order!</h1>
                    <p className="text-gray-500 mt-2">
                        Your order has been received and is being processed.
                    </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between mb-4 pb-4 border-b">
                        <div>
                            <h2 className="text-lg font-medium">Order #{order.orderNumber}</h2>
                            <p className="text-gray-500 text-sm mt-1">Date: {new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
                                Processing
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 uppercase mb-2">Shipping To</h3>
                            <p className="text-sm text-gray-700">{order.customer.name}</p>
                            <p className="text-sm text-gray-700 mt-1">{order.shippingAddress.address}</p>
                            <p className="text-sm text-gray-700">
                                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                            </p>
                            <p className="text-sm text-gray-700">{order.shippingAddress.country}</p>
                            <p className="text-sm text-gray-700 mt-2">Phone: {order.customer.phone}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-900 uppercase mb-2">Payment Method</h3>
                            <p className="text-sm text-gray-700">{order.paymentMethod}</p>
                            <p className="text-sm text-gray-500 mt-1">Payment will be collected upon delivery</p>

                            <h3 className="text-sm font-medium text-gray-900 uppercase mb-2 mt-4">Contact Info</h3>
                            <p className="text-sm text-gray-700">{order.customer.email}</p>
                        </div>
                    </div>
                </div>

                <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                <div className="border rounded-lg overflow-hidden mb-6">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Qty
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {order.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                        ${item.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                        {item.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col sm:flex-row justify-between">
                    <div className="sm:w-1/2"></div>
                    <div className="w-full sm:w-1/2 bg-gray-50 rounded p-4">
                        <div className="flex justify-between py-1">
                            <span className="text-sm text-gray-700">Subtotal</span>
                            <span className="text-sm font-medium">${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-sm text-gray-700">Shipping</span>
                            <span className="text-sm font-medium">
                                {order.shippingCost === 0 ? "Free" : `$${order.shippingCost.toFixed(2)}`}
                            </span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-sm text-gray-700">Tax</span>
                            <span className="text-sm font-medium">${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-t mt-2">
                            <span className="text-base font-medium">Total</span>
                            <span className="text-base font-medium">${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500 mb-4">
                        If you have any questions about your order, please contact our customer support.
                    </p>
                    <Link href="/" className="inline-block bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}