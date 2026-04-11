export const formatDate = (date: string | Date): string => {
    try {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    } catch {
        return 'Invalid date';
    }
};

export const formatDateOnly = (date: string | Date): string => {
    try {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(date));
    } catch {
        return 'Invalid date';
    }
};

export const formatTimeOnly = (date: string | Date): string => {
    try {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(new Date(date));
    } catch {
        return 'Invalid time';
    }
};

export const formatCurrency = (amount: number, currency = 'UZS'): string => {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return amount.toString();
    }
};

export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
};

export const formatArea = (area: number): string => {
    return `${formatNumber(area)} ga`;
};

export const truncate = (text: string, length: number): string => {
    return text.length > length ? text.substring(0, length) + '...' : text;
};

export const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const toTitleCase = (str: string): string => {
    return str
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const getFileUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    
    // Get the base URL from the API URL (e.g., http://localhost:3000/api -> http://localhost:3000)
    const apiUrl = import.meta.env.VITE_API_URL as string;
    const baseUrl = apiUrl?.replace(/\/api\/?$/, '') || '';
    
    // Ensure accurate path joining
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
};