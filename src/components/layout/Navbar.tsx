import React, { useState } from 'react';
import {
    Bell,
    Settings,
    User,
    Search,
    Menu,
    Moon,
    Sun,
    LogOut,
    ChevronDown,
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../features/auth/api/hooks';
import { Input } from '../ui/input';
import { toast } from '../../utils/toast';

export default function Navbar() {
    const { toggleTheme, isDarkMode, setSidebarOpen } = useUIStore();
    const { user } = useAuthStore();
    const logoutMutation = useLogout();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
        } catch (error: any) {
            toast.error('Chiqishda xatolik yuz berdi');
            console.error('Logout error:', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Search:', searchQuery);
        toast.info(`Qidirilmoqda: ${searchQuery}`);
    };

    return (
        <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
            {/* Left Section */}
            <div className="flex items-center gap-4 flex-1">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6 text-gray-600" />
                </button>

                {/* Search Bar */}
                <div className="hidden md:flex flex-1 max-w-md">
                    <form onSubmit={handleSearch} className="w-full">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Qidirish..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                            />
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 lg:gap-6">
                {/* Notifications */}
                <div className="relative group">
                    <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
                    </button>

                    {/* Notification Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900">Bildirishnomalar</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {[1, 2, 3].map((notification) => (
                                <div
                                    key={notification}
                                    className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <p className="text-sm font-medium text-gray-900">
                                        Yangi lot yaratildi
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        5 daqiqa oldin
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-200">
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Barcha bildirishnomalarni ko'rish
                            </button>
                        </div>
                    </div>
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:flex items-center justify-center"
                    title="Mavzuni o'zgartirish"
                >
                    {isDarkMode ? (
                        <Sun className="w-5 h-5 text-gray-600" />
                    ) : (
                        <Moon className="w-5 h-5 text-gray-600" />
                    )}
                </button>

                {/* Settings */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:flex items-center justify-center">
                    <Settings className="w-5 h-5 text-gray-600" />
                </button>

                {/* User Menu */}
                <div className="relative group">
                    <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden lg:flex flex-col items-start">
                            <p className="text-sm font-medium text-gray-900">
                                {user?.email?.split('@')[0] || 'Foydalanuvchi'}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-600 hidden lg:flex" />
                    </button>

                    {/* User Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                        <div className="p-4 border-b border-gray-200">
                            <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                            <p className="text-xs text-gray-500 capitalize mt-1">{user?.role}</p>
                        </div>
                        <div className="p-2 space-y-1">
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Profil
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center gap-2">
                                <Settings className="w-4 h-4" />
                                Sozlamalar
                            </button>
                            <hr className="my-1" />
                            <button
                                onClick={handleLogout}
                                disabled={logoutMutation.isPending}
                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                {logoutMutation.isPending ? 'Chiqilmoqda...' : 'Chiqish'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}