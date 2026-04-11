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
    LayoutDashboard,
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
        <nav className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm transition-colors duration-300">
            {/* Left Section */}
            <div className="flex items-center gap-4 flex-1">
                {/* Mobile Menu Toggle & Brand */}
                <div className="flex items-center gap-3 lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-300"
                    >
                        <Menu className="w-5.5 h-5.5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                            <LayoutDashboard className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-[17px] font-black tracking-wide text-slate-800 dark:text-white">TOSHVIL</h1>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex flex-1 max-w-md ml-0 lg:ml-0">
                    <form onSubmit={handleSearch} className="w-full">
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                type="text"
                                placeholder="Qidirish..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-10 w-full bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl transition-all duration-200 shadow-sm text-sm dark:text-slate-200"
                            />
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 lg:gap-4">
                {/* Notifications */}
                <div className="relative group/notif hidden sm:block">
                    <button className="relative p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                    </button>

                    {/* Notification Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-gray-100 dark:border-slate-700 opacity-0 invisible group-hover/notif:opacity-100 group-hover/notif:visible transition-all duration-200 transform origin-top-right z-50">
                        <div className="p-4 border-b border-gray-100 dark:border-slate-700">
                            <h3 className="font-bold text-slate-900 dark:text-white">Bildirishnomalar</h3>
                        </div>
                        <div className="max-h-80 overflow-y-auto scrollbar-thin">
                            {[1, 2, 3].map((notification) => (
                                <div
                                    key={notification}
                                    className="px-4 py-3.5 border-b border-gray-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors"
                                >
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        Yangi lot yaratildi
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                                        5 daqiqa oldin
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 border-t border-gray-100 dark:border-slate-700 text-center bg-slate-50 dark:bg-slate-800/80 rounded-b-2xl">
                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                                Barcha bildirishnomalarni ko'rish
                            </button>
                        </div>
                    </div>
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-blue-400"
                    title="Mavzuni o'zgartirish"
                >
                    {isDarkMode ? (
                        <Sun className="w-5 h-5" />
                    ) : (
                        <Moon className="w-5 h-5" />
                    )}
                </button>

                {/* Settings */}
                <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 transition-colors hidden sm:flex items-center justify-center">
                    <Settings className="w-5 h-5" />
                </button>

                <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

                {/* User Menu */}
                <div className="relative group/user">
                    <button className="flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full lg:rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full shadow-sm text-white font-bold text-sm">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="hidden lg:flex flex-col items-start min-w-[80px]">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                {user?.email?.split('@')[0] || 'Admin'}
                            </p>
                            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-0.5">{user?.role}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400 hidden lg:flex ml-1 transition-transform group-hover/user:rotate-180" />
                    </button>

                    {/* User Dropdown */}
                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-gray-100 dark:border-slate-700 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200 transform origin-top-right z-50">
                        <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 shadow-md">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate w-full">{user?.email}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mt-1">{user?.role}</p>
                        </div>
                        <div className="p-2 space-y-1">
                            <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-3">
                                <User className="w-4 h-4" />
                                Mening profilim
                            </button>
                            <button className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-3">
                                <Settings className="w-4 h-4" />
                                Sozlamalar
                            </button>
                            <div className="h-[1px] bg-slate-100 dark:bg-slate-700 my-1"></div>
                            <button
                                onClick={handleLogout}
                                disabled={logoutMutation.isPending}
                                className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-3"
                            >
                                <LogOut className="w-4 h-4" />
                                {logoutMutation.isPending ? 'Chiqilmoqda...' : 'Tizimdan chiqish'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}