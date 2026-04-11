import { useState } from 'react';
import { Edit2, Trash2, Search, RotateCcw, Plus } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useDepartments, useDeleteDepartment } from '@/hooks/useDepartments';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/utils/formatters';
import ConfirmDialog from '@/features/lots/components/modals/ConfirmDialog';
import DepartmentForm from './DepartmentForm';
import type { Department } from '@/types/department.types';

export default function DepartmentTable() {
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [search, setSearch] = useState('');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Department | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Department | null>(null);

    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading } = useDepartments({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
    });

    const deleteQuery = useDeleteDepartment();

    const handleDelete = (item: Department) => {
        setItemToDelete(item);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteQuery.mutateAsync(itemToDelete.id);
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const handleCreate = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: Department) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Bo'limlarni qidirish..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPagination({ ...pagination, page: 1 });
                        }}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearch('');
                            setPagination({ ...pagination, page: 1 });
                        }}
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Tozalash
                    </Button>
                    <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                        <Plus className="w-4 h-4 mr-2" />
                        Yangi bo'lim
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50 border-b">
                        <TableRow>
                            <TableHead className="font-semibold text-gray-700">Nomi (UZ)</TableHead>
                            <TableHead className="font-semibold text-gray-700">Nomi (RU)</TableHead>
                            <TableHead className="font-semibold text-gray-700">Nomi (EN)</TableHead>
                            <TableHead className="font-semibold text-gray-700">Yaratilgan</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-right">Amallar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data?.data && data.data.length > 0 ? (
                            data.data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-blue-50/50 transition-colors">
                                    <TableCell className="font-medium text-gray-900">{item.nameUz}</TableCell>
                                    <TableCell className="text-gray-600">{item.nameRu}</TableCell>
                                    <TableCell className="text-gray-600">{item.nameEn}</TableCell>
                                    <TableCell className="text-gray-500 text-sm">{formatDate(item.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(item)}
                                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(item)}
                                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    Ma'lumotlar topilmadi
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {data?.totalPages && data.totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
                        <div className="text-sm text-gray-700">
                            Jami: <span className="font-medium">{data?.total}</span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1}
                            >
                                Oldingi
                            </Button>
                            <div className="flex items-center px-4 text-sm font-medium">
                                {pagination.page} / {data?.totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page === data?.totalPages}
                            >
                                Keyingi
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title="Bo'limni o'chirish?"
                description={`Haqiqatan ham "${itemToDelete?.nameUz}" bo'limini o'chirib tashlamoqchimisiz?`}
                destructive={true}
                confirmText="O'chirish"
                cancelText="Bekor qilish"
                loading={deleteQuery.isPending}
                onConfirm={handleConfirmDelete}
            />

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem ? 'Bo\'limni tahrirlash' : 'Yangi bo\'lim yaratish'}
                        </DialogTitle>
                    </DialogHeader>
                    <DepartmentForm
                        initialData={editingItem || undefined}
                        onSuccess={handleCloseModal}
                        onCancel={handleCloseModal}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
