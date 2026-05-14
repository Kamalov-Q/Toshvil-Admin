import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    MapPin,
    Newspaper,
    MessageSquare,
    Settings,
    LogOut,
    X,
    LayoutDashboard,
    ChevronDown,
    Users,
    BarChart3,
    HelpCircle,
    FolderTree,
    FileStack,
    PanelLeftClose,
    PanelLeftOpen,
    Gavel,
    Factory,
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../features/auth/api/hooks';
import { Button } from '../ui/button';
import { toast } from '../../utils/toast';
import { useNewsList } from '../../hooks/useNewsQueries';
import { useDistricts } from '../../hooks/useDistricts';
import { useLots } from '../../features/lots/api/hooks';
import { useIndustries } from '../../hooks/useIndustries';

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
        icon: <Home className="w-[22px] h-[22px]" />,
        label: 'Boshqaruv paneli',
        path: '/dashboard',
    },
    {
        icon: <MapPin className="w-[22px] h-[22px]" />,
        label: 'Lotlar',
        path: '/lots',
        badge: 12,
    },
    {
        icon: <LayoutDashboard className="w-[22px] h-[22px]" />,
        label: 'Tumanlar',
        path: '/districts',
    },
    {
        icon: <Factory className="w-[22px] h-[22px]" />,
        label: 'Sanoat zonalari',
        path: '/industries',
    },

    {
        icon: <Gavel className="w-[22px] h-[22px]" />,
        label: 'Auksionlar',
        path: '/auctions',
    },
    {
        icon: <Newspaper className="w-[22px] h-[22px]" />,
        label: 'Yangiliklar',
        path: '/news',
        badge: 3,
    },
    {
        icon: <MessageSquare className="w-[22px] h-[22px]" />,
        label: 'Izohlar',
        path: '/comments',
    },
    {
        icon: <FolderTree className="w-[22px] h-[22px]" />,
        label: 'Kategoriyalar',
        path: '/categories',
    },
    {
        icon: <FileStack className="w-[22px] h-[22px]" />,
        label: 'Hujjatlar',
        path: '/docs',
    },
    {
        icon: <Users className="w-[22px] h-[22px]" />,
        label: 'Rahbariyat',
        path: '/management',
        subItems: [
            { label: 'Bo\'limlar', path: '/management/departments' },
            { label: 'Lavozimlar', path: '/management/positions' },
            { label: 'Rahbariyat', path: '/management/leadership' },
            { label: 'Mas\'ullar', path: '/management/managers' },
        ],
    },
    {
        icon: <Users className="w-[22px] h-[22px]" />,
        label: 'Foydalanuvchilar',
        path: '/users',
        subItems: [
            { label: 'Barcha foydalanuvchilar', path: '/users' },
            { label: 'Rollar', path: '/users/roles' },
            { label: 'Huquqlar', path: '/users/permissions' },
        ],
    },
    {
        icon: <BarChart3 className="w-[22px] h-[22px]" />,
        label: 'Analitika',
        path: '/analytics',
    },
];

const settingsItems: MenuItem[] = [
    {
        icon: <Settings className="w-[22px] h-[22px]" />,
        label: 'Sozlamalar',
        path: '/settings',
    },
    {
        icon: <HelpCircle className="w-[22px] h-[22px]" />,
        label: 'Yordam va ko\'mak',
        path: '/help',
    },
];

export default function Sidebar() {
    const location = useLocation();
    const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
    const { user } = useAuthStore();
    const logoutMutation = useLogout();
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

    const { data: newsData } = useNewsList({ limit: 1 });
    const totalNews = newsData?.total || 0;

    const { data: districtsData } = useDistricts({ limit: 1 });
    const totalDistricts = districtsData?.total || 0;

    const { data: lotsData } = useLots({ limit: 1 });
    const totalLots = lotsData?.total || 0;

    const { data: industriesData } = useIndustries();
    const totalIndustries = industriesData?.length || 0;

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
        } catch (error: any) {
            toast.error('Chiqishda xatolik yuz berdi');
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
            {/* Sidebar Overlay for Mobile */}

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-[2px] lg:hidden z-40 transition-opacity"
                    /* onClick removed to prevent auto-close */
                />
            )}

            {/* Main Sidebar Container */}
            <aside
                className={`
                    fixed lg:relative top-0 left-0 h-screen z-50 lg:z-0
                    bg-white dark:bg-[#0f172a]
                    border-r border-gray-200 dark:border-slate-800/80
                    flex flex-col transition-all duration-300 ease-in-out
                    shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]
                    ${sidebarOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full lg:translate-x-0 lg:w-[88px]'}
                `}
            >
                {/* Brand Header */}
                <div className="h-16 lg:h-20 flex items-center justify-between px-6 border-b border-gray-100 dark:border-slate-800/80 pt-4 lg:pt-0 flex-shrink-0">
                    <div className={`flex items-center gap-3 overflow-hidden ${sidebarOpen ? 'w-full' : 'lg:w-full lg:justify-center'}`}>
                        <div className="w-10 h-10 min-w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <div className={`flex flex-col transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'lg:hidden'}`}>
                            <h2 className="text-[17px] font-black tracking-wide text-slate-800 dark:text-white">TOSHVIL</h2>
                            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">Admin Panel</p>
                        </div>
                    </div>
                    
                    {/* Expand/Collapse Toggle Desktop */}
                    <button
                        onClick={toggleSidebar}
                        className="hidden lg:flex absolute -right-4 bottom-8 w-8 h-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full items-center justify-center text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm hover:shadow transition-all z-50 focus:outline-none"
                    >
                        {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                    </button>

                    {/* Close Button Mobile */}
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none py-6 flex flex-col gap-6">
                    
                    {/* User Profile Mini */}
                    <div className={`px-4 transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'lg:hidden'}`}>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
                                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user?.email}</p>
                                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-0.5">{user?.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Menu Component */}
                    <nav className="px-3 space-y-1.5">
                        <p className={`px-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'lg:opacity-0 lg:h-0 lg:mb-0 lg:overflow-hidden'}`}>
                            Asosiy Menyu
                        </p>
                        {menuItems.map((item) => {
                            const isActive = isMenuActive(item.path);
                            
                            // Determine the badge content 
                            let displayBadge = item.badge;
                            if (item.path === '/news' && totalNews > 0) displayBadge = totalNews;
                            if (item.path === '/districts' && totalDistricts > 0) displayBadge = totalDistricts;
                            if (item.path === '/lots' && totalLots > 0) displayBadge = totalLots;
                            if (item.path === '/industries' && totalIndustries > 0) displayBadge = totalIndustries;


                            return (
                                <div key={item.label} className="relative group">
                                    {item.subItems ? (
                                        <>
                                            <button
                                                onClick={() => toggleSubMenu(item.label)}
                                                className={`
                                                    w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition-all duration-200 outline-none
                                                    ${isActive 
                                                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold' 
                                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
                                                    }
                                                `}
                                                title={!sidebarOpen ? item.label : undefined}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                                                        {item.icon}
                                                    </div>
                                                    <span className={`text-[15px] whitespace-nowrap transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'lg:opacity-0 lg:hidden'}`}>
                                                        {item.label}
                                                    </span>
                                                </div>
                                                <ChevronDown
                                                    className={`w-4 h-4 transition-transform duration-300 ${expandedMenu === item.label ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''} ${sidebarOpen ? 'opacity-100' : 'lg:hidden'}`}
                                                />
                                            </button>
                                            
                                            {/* SubItems */}
                                            {expandedMenu === item.label && sidebarOpen && (
                                                <div className="ml-[26px] mt-1 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 pl-3">
                                                    {item.subItems.map((subItem) => {
                                                        const isSubActive = isMenuActive(subItem.path);
                                                        return (
                                                            <Link
                                                                key={subItem.path}
                                                                to={subItem.path}
                                                                /* onClick removed to keep sidebar open */
                                                                className={`
                                                                    block px-4 py-2.5 rounded-lg text-sm transition-all duration-200
                                                                    ${isSubActive 
                                                                        ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-600/20' 
                                                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                                    }
                                                                `}
                                                            >
                                                                {subItem.label}
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            to={item.path}
                                            /* onClick removed to keep sidebar open on navigation */
                                            className={`
                                                flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative overflow-hidden outline-none
                                                ${isActive 
                                                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/25' 
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
                                                }
                                            `}
                                            title={!sidebarOpen ? item.label : undefined}
                                        >
                                            {/* Active Indicator Line for collapsed mode (only shows if active but not blue background) */}
                                            {!sidebarOpen && isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full hidden lg:block" />
                                            )}

                                            <div className="flex items-center gap-3">
                                                <div className={`${isActive ? 'text-white' : ''}`}>
                                                    {item.icon}
                                                </div>
                                                <span className={`text-[15px] whitespace-nowrap transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'lg:opacity-0 lg:hidden'}`}>
                                                    {item.label}
                                                </span>
                                            </div>

                                            {/* Badge */}
                                            {displayBadge ? (
                                                <span className={`
                                                    font-bold rounded-full px-2 py-0.5 border text-[10px]
                                                    transition-opacity duration-300
                                                    ${sidebarOpen ? 'opacity-100' : 'lg:opacity-0 lg:hidden'}
                                                    ${isActive 
                                                        ? 'bg-white/20 text-white border-white/30' 
                                                        : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                                                    }
                                                `}>
                                                    {displayBadge}
                                                </span>
                                            ) : null}

                                            {/* Tooltip for Collapsed Sidebar */}
                                            {!sidebarOpen && (
                                                <div className="fixed left-[96px] bg-slate-900 text-white text-xs px-3 py-2 rounded-lg font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl">
                                                    {item.label}
                                                </div>
                                            )}
                                        </Link>
                                    )}
                                </div>
                            )
                        })}
                    </nav>

                    {/* Settings Menu Component */}
                    <div className="px-3 mt-auto">
                        <p className={`px-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 pt-6 border-t border-slate-100 dark:border-slate-800 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'lg:opacity-0 lg:h-0 lg:mb-0 lg:pt-0 lg:border-t-0 lg:overflow-hidden'}`}>
                            Sozlamalar
                        </p>
                        <nav className="space-y-1.5">
                            {settingsItems.map((item) => {
                                const isActive = isMenuActive(item.path);
                                return (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 outline-none group relative
                                            ${isActive 
                                                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/25' 
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
                                            }
                                        `}
                                    >
                                        <div className={`${isActive ? 'text-white' : ''}`}>
                                            {item.icon}
                                        </div>
                                        <span className={`text-[15px] whitespace-nowrap transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'lg:opacity-0 lg:hidden'}`}>
                                            {item.label}
                                        </span>
                                        {!sidebarOpen && (
                                            <div className="fixed left-[96px] bg-slate-900 text-white text-xs px-3 py-2 rounded-lg font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl">
                                                {item.label}
                                            </div>
                                        )}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </div>

                {/* Sidebar Footer Component */}
                <div className={`p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900 transition-all duration-300 ${sidebarOpen ? '' : 'lg:p-3 lg:flex lg:justify-center'}`}>
                    <Button
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        variant="ghost"
                        className={`
                            hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 text-slate-600 dark:text-slate-400 transition-colors
                            ${sidebarOpen ? 'w-full justify-start gap-3' : 'w-12 h-12 p-0 justify-center'}
                        `}
                        title={!sidebarOpen ? 'Chiqish' : undefined}
                    >
                        <LogOut className="w-[22px] h-[22px]" />
                        <span className={`font-semibold transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'lg:hidden lg:opacity-0'}`}>
                            {logoutMutation.isPending ? 'Chiqilmoqda...' : 'Chiqish'}
                        </span>
                    </Button>
                </div>
            </aside>
        </>
    );
}