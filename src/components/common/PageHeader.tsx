import React, { type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export interface PageHeaderAction {
    id: string;
    label: string;
    icon?: ReactNode;
    onClick: () => void | Promise<void>;
    variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost';
    loading?: boolean;
    disabled?: boolean;
}

export interface PageHeaderStats {
    label: string;
    value: string | number;
    change?: number;
    isPositive?: boolean;
}

interface PageHeaderProps {
    /**
     * Page title
     */
    title?: string;

    /**
     * Page description/subtitle
     */
    description?: string;

    /**
     * Icon to display next to title
     */
    icon?: ReactNode;

    /**
     * Background color variant
     */
    variant?: 'default' | 'blue' | 'green' | 'purple' | 'orange' | 'red';

    /**
     * Action buttons
     */
    actions?: PageHeaderAction[];

    /**
     * Stats to display
     */
    stats?: PageHeaderStats[];

    /**
     * Show breadcrumb navigation
     */
    showBreadcrumb?: boolean;

    /**
     * Custom breadcrumb items
     */
    breadcrumbs?: Array<{
        label: string;
        href?: string;
    }>;

    /**
     * Additional className
     */
    className?: string;

    /**
     * Children for custom layout
     */
    children?: ReactNode;

    /**
     * Show background decoration
     */
    showDecoration?: boolean;
}

const variantStyles = {
    default: 'from-blue-600 to-blue-700',
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    orange: 'from-orange-600 to-orange-700',
    red: 'from-red-600 to-red-700',
};

export default function PageHeader({
    title,
    description,
    icon,
    variant = 'default',
    actions,
    stats,
    showBreadcrumb = true,
    breadcrumbs,
    className,
    children,
    showDecoration = true,
}: PageHeaderProps) {
    const location = useLocation();

    /**
     * Generate default page title from route if not provided
     */
    const getPageTitle = (): string => {
        if (title) return title;

        const path = location.pathname.split('/')[1];
        if (!path) return 'Dashboard';

        return path
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    /**
     * Generate breadcrumbs from route
     */
    const generateBreadcrumbs = () => {
        if (breadcrumbs) return breadcrumbs;

        const paths = location.pathname.split('/').filter((p) => p);
        const crumbs: Array<{ label: string; href?: string }> = [{ label: 'Dashboard', href: '/dashboard' }];

        paths.forEach((path, index) => {
            const label = path
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            const isLast = index === paths.length - 1;
            crumbs.push({
                label,
                href: isLast ? undefined : '/' + paths.slice(0, index + 1).join('/'),
            });
        });

        return crumbs;
    };

    const currentBreadcrumbs = generateBreadcrumbs();
    const currentTitle = getPageTitle();

    return (
        <div className={cn('space-y-6', className)}>
            {/* Breadcrumb Navigation */}
            {showBreadcrumb && (
                <nav className="flex items-center gap-2 text-sm">
                    {currentBreadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                            {crumb.href ? (
                                <a
                                    href={crumb.href}
                                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                            {crumb.label}
                        </a>
                    ) : (
                    <span className="text-gray-900 font-medium">{crumb.label}</span>
              )}
                </React.Fragment>
            ))}
        </nav>
    )
}

{/* Header Section */ }
<div
    className={cn(
        'relative rounded-xl overflow-hidden shadow-lg p-8 text-white',
        `bg-gradient-to-r ${variantStyles[variant]}`
    )}
>
    {/* Background Decoration */}
    {showDecoration && (
        <>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full -ml-30 -mb-30"></div>
        </>
    )}

    {/* Content */}
    <div className="relative z-10">
        <div className="flex items-start justify-between gap-6">
            {/* Left Section */}
            <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                    {icon && (
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                            {icon}
                        </div>
                    )}
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-bold">
                            {currentTitle}
                        </h1>
                    </div>
                </div>

                {description && (
                    <p className="text-white/80 text-lg max-w-2xl">
                        {description}
                    </p>
                )}
            </div>

            {/* Right Section - Actions */}
            {actions && actions.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                    {actions.map((action) => (
                        <Button
                            key={action.id}
                            onClick={action.onClick}
                            variant={action.variant || 'default'}
                            disabled={action.disabled || action.loading}
                            className={cn(
                                'gap-2 whitespace-nowrap',
                                action.variant === 'default' &&
                                'bg-white text-blue-600 hover:bg-blue-50'
                            )}
                        >
                            {action.loading ? (
                                <svg
                                    className="w-4 h-4 animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            ) : (
                                action.icon
                            )}
                            {action.label}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    </div>
</div>

{/* Stats Section */ }
{
    stats && stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
                >
                    <p className="text-sm font-medium text-gray-600 mb-2">
                        {stat.label}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-gray-900">
                            {stat.value}
                        </h3>
                        {stat.change !== undefined && (
                            <span
                                className={cn(
                                    'text-sm font-semibold',
                                    stat.isPositive ? 'text-green-600' : 'text-red-600'
                                )}
                            >
                                {stat.isPositive ? '+' : '-'}
                                {Math.abs(stat.change)}%
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

{/* Children */ }
{ children && <div>{children}</div> }
    </div >
  );
}