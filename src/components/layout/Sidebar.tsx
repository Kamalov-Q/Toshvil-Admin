import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    MapPin,
    Newspaper,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
    LayoutDashboard,
    ChevronDown,
    Users,
    BarChart3,
    HelpCircle,
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../features/auth/api/hooks';
import { Button } from '../ui/button';
import { toast } from '../../utils/toast';
import { useNewsList } from '../../hooks/useNewsQueries';

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    path: string;
    badge?: number;
    subItems?: Array<{
        label: string;
        path: string;
    }>;
}

const menuItems: MenuItem[] = [
    {
        icon: <Home className="w-5 h-5" />,
        label: 'Dashboard',
        path: '/dashboard',
    },
    {
        icon: <MapPin className="w-5 h-5" />,
        label: 'Lots',
        path: '/lots',
        badge: 12,
    },
    {
        icon: <LayoutDashboard className="w-5 h-5" />,
        label: 'Districts',
        path: '/districts',
    },
    {
        icon: <Newspaper className="w-5 h-5" />,
        label: 'News',
        path: '/news',
        badge: 3,
    },
    {
        icon: <MessageSquare className="w-5 h-5" />,
        label: 'Comments',
        path: '/comments',
    },
    {
        icon: <Users className="w-5 h-5" />,
        label: 'Users',
        path: '/users',
        subItems: [
            { label: 'All Users', path: '/users' },
            { label: 'Roles', path: '/users/roles' },
            { label: 'Permissions', path: '/users/permissions' },
        ],
    },
    {
        icon: <BarChart3 className="w-5 h-5" />,
        label: 'Analytics',
        path: '/analytics',
    },
];

const settingsItems: MenuItem[] = [
    {
        icon: <Settings className="w-5 h-5" />,
        label: 'Settings',
        path: '/settings',
    },
    {
        icon: <HelpCircle className="w-5 h-5" />,
        label: 'Help & Support',
        path: '/help',
    },
];

export default function Sidebar() {
    const location = useLocation();
    const { sidebarOpen, setSidebarOpen } = useUIStore();
    const { user } = useAuthStore();
    const logoutMutation = useLogout();
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

    const { data: newsData } = useNewsList({ limit: 1 });
    const totalNews = newsData?.total || 0;

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
        } catch (error: any) {
            toast.error('Logout failed');
            console.error('Logout error:', error);
        }
    };

    const isMenuActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path);
    };

    const toggleSubMenu = (label: string) => {
        setExpandedMenu(expandedMenu === label ? null : label);
    };

    return (
        <>
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-4 z-40">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {sidebarOpen ? (
                        <X className="w-6 h-6 text-gray-600" />
                    ) : (
                        <Menu className="w-6 h-6 text-gray-600" />
                    )}
                </button>
                <h1 className="ml-4 text-lg font-bold text-gray-900">Admin Panel</h1>
            </div>

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:relative left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white
          transition-transform duration-300 ease-in-out z-50 lg:z-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Sidebar Header */}
                <div className="h-16 lg:h-20 flex items-center justify-between px-6 border-b border-gray-700 pt-4 lg:pt-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                            <LayoutDashboard className="w-6 h-6 text-white" />
                        </div>
                        <div className="hidden lg:block">
                            <h2 className="text-lg font-bold">Admin</h2>
                            <p className="text-xs text-gray-400">Panel</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1 hover:bg-gray-700 rounded transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* User Info */}
                    <div className="px-6 py-6 border-b border-gray-700">
                        <div className="bg-gray-700/50 rounded-lg p-4 backdrop-blur">
                            <p className="text-xs text-gray-400 mb-1">Logged in as</p>
                            <p className="font-semibold text-sm truncate">{user?.email}</p>
                            <p className="text-xs text-blue-400 mt-2 uppercase tracking-wider font-medium">
                                {user?.role}
                            </p>
                        </div>
                    </div>

                    {/* Main Menu */}
                    <nav className="px-3 py-6 space-y-1">
                        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                            Main Menu
                        </p>
                        {menuItems.map((item) => (
                            <div key={item.label}>
                                {item.subItems ? (
                                    <>
                                        <button
                                            onClick={() => toggleSubMenu(item.label)}
                                            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isMenuActive(item.path)
                                                    ? 'bg-blue-600 text-white shadow-lg'
                                                    : 'text-gray-300 hover:bg-gray-700/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {item.icon}
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </div>
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform duration-200 ${expandedMenu === item.label ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        {expandedMenu === item.label && (
                                            <div className="ml-4 mt-1 space-y-1 border-l border-gray-600 pl-4">
                                                {item.subItems.map((subItem) => (
                                                    <Link
                                                        key={subItem.path}
                                                        to={subItem.path}
                                                        onClick={() => setSidebarOpen(false)}
                                                        className={`block px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${isMenuActive(subItem.path)
                                                                ? 'bg-blue-600 text-white'
                                                                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'
                                                            }`}
                                                    >
                                                        {subItem.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isMenuActive(item.path)
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'text-gray-300 hover:bg-gray-700/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </div>
                                        {item.path === '/news' ? (
                                            totalNews > 0 && (
                                                <span className="bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-0.5 group-hover:bg-blue-700">
                                                    {totalNews}
                                                </span>
                                            )
                                        ) : item.badge && (
                                            <span className="bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 group-hover:bg-red-700">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Settings Menu */}
                    <div className="px-3 py-6 border-t border-gray-700">
                        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                            Settings
                        </p>
                        <nav className="space-y-1">
                            {settingsItems.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isMenuActive(item.path)
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-gray-300 hover:bg-gray-700/50'
                                        }`}
                                >
                                    {item.icon}
                                    <span className="text-sm font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Sidebar Footer */}
                <div className="px-3 py-6 border-t border-gray-700 space-y-3">
                    {/* Storage Info */}
                    <div className="px-4 py-3 bg-gray-700/50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-xs text-gray-400">Storage</p>
                            <p className="text-xs font-semibold text-white">65%</p>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full w-[65%]"></div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <Button
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="w-full justify-start gap-3 bg-red-600 hover:bg-red-700 text-white"
                    >
                        <LogOut className="w-5 h-5" />
                        {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                    </Button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 lg:hidden z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    );
}