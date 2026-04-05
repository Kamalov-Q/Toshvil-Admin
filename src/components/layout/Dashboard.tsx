import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
    const { setSidebarOpen } = useUIStore();

    // Close sidebar on small screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setSidebarOpen]);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Navbar */}
                <Navbar />

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <div className="p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}