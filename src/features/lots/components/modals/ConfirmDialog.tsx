import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    destructive?: boolean;
    loading?: boolean;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
    icon?: 'warning' | 'alert' | 'none';
}

export default function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    destructive = false,
    loading = false,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    icon = 'warning',
}: ConfirmDialogProps) {
    const handleConfirm = async () => {
        try {
            await onConfirm();
            onOpenChange(false);
        } catch (error) {
            console.error('Confirmation error:', error);
        }
    };

    const handleCancel = () => {
        onCancel?.();
        onOpenChange(false);
    };

    const IconComponent = icon === 'warning' ? AlertTriangle : icon === 'alert' ? AlertCircle : null;
    const iconColor = destructive ? 'text-red-600' : 'text-amber-600';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        {IconComponent && (
                            <div className={`flex-shrink-0 mt-1 ${iconColor}`}>
                                <IconComponent className="h-6 w-6" />
                            </div>
                        )}
                        <div className="flex-1">
                            <DialogTitle className={destructive ? 'text-red-600' : ''}>
                                {title}
                            </DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                {description && (
                    <DialogDescription className="text-gray-600 pl-10">
                        {description}
                    </DialogDescription>
                )}

                <DialogFooter className="gap-2 sm:gap-0 pl-10">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={loading}
                        className={
                            destructive
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }
                    >
                        {loading ? 'Processing...' : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}