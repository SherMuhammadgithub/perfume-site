
'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalCustomers: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardStats() {
            try {
                // In a real app, you'd have an API endpoint for this
                // For now we'll just simulate it with setTimeout and hardcoded data
                setTimeout(() => {
                    setStats({
                        totalOrders: 28,
                        totalRevenue: 4289.45,
                        totalProducts: 52,
                        totalCustomers: 76,
                    });
                    setLoading(false);
                }, 500);
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
                setLoading(false);
            }
        }

        fetchDashboardStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Orders"
                            value={stats.totalOrders}
                            icon="shopping_cart"
                            color="bg-blue-500"
                        />
                        <StatCard
                            title="Total Revenue"
                            value={`$${stats.totalRevenue.toLocaleString()}`}
                            icon="attach_money"
                            color="bg-green-500"
                        />
                        <StatCard
                            title="Total Products"
                            value={stats.totalProducts}
                            icon="inventory_2"
                            color="bg-purple-500"
                        />
                        <StatCard
                            title="Total Customers"
                            value={stats.totalCustomers}
                            icon="people"
                            color="bg-orange-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-lg font-medium mb-4">Recent Orders</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#1243</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Doe</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Delivered
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$134.99</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#1242</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jane Smith</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    Processing
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$89.99</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-lg font-medium mb-4">Popular Products</h2>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 bg-gray-100 rounded-md mr-4"></div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium">Chanel No. 5</h3>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
                                            <span className="ml-1">4.8 rating</span>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium">246 sold</div>
                                </div>

                                <div className="flex items-center">
                                    <div className="h-10 w-10 bg-gray-100 rounded-md mr-4"></div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium">Dior Sauvage</h3>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
                                            <span className="ml-1">4.7 rating</span>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium">198 sold</div>
                                </div>

                                <div className="flex items-center">
                                    <div className="h-10 w-10 bg-gray-100 rounded-md mr-4"></div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium">Versace Eros</h3>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
                                            <span className="ml-1">4.5 rating</span>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium">187 sold</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
                <div className={`${color} text-white p-3 rounded-full`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <div className="text-2xl font-semibold">{value}</div>
                </div>
            </div>
        </div>
    );
}