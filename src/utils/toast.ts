import { toast as hotToast } from 'react-hot-toast';

export const toast = {
    success: (message: string) => {
        hotToast.success(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#10b981',
                color: 'white',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
            },
            icon: '✓',
        });
    },

    error: (message: string) => {
        hotToast.error(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#ef4444',
                color: 'white',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
            },
            icon: '✗',
        });
    },

    info: (message: string) => {
        hotToast(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#3b82f6',
                color: 'white',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
            },
            icon: 'ℹ',
        });
    },

    loading: (message: string) => {
        return hotToast.loading(message, {
            position: 'top-right',
            style: {
                background: '#f59e0b',
                color: 'white',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
            },
        });
    },

    promise: async <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) => {
        return hotToast.promise(promise, messages, {
            position: 'top-right',
            style: {
                borderRadius: '8px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
            },
        });
    },

    dismiss: (toastId?: string) => {
        if (toastId) {
            hotToast.dismiss(toastId);
        } else {
            hotToast.dismiss();
        }
    },
};