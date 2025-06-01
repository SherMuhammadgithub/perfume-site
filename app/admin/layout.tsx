'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '../context/authContext';

const sidebarItems = [
    { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { name: 'Products', href: '/admin/products', icon: 'inventory' },
    { name: 'Orders', href: '/admin/orders', icon: 'shopping_cart' },
    { name: 'Customers', href: '/admin/customers', icon: 'people' },
    { name: 'Settings', href: '/admin/settings', icon: 'settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">


                {/* Main content */}
                <div className=" flex flex-col flex-1">
                    {/* Top navigation */}
                    <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
                        <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                    <main className="flex-1">
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}