import { useState, useCallback } from 'react';
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type PaginationState,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Edit2,
    Trash2,
    Plus,
    AlertCircle,
    Search,
} from 'lucide-react';
import {
    useCategories,
    useDeleteCategory,
} from '@/hooks/useCategory';
import { type Category } from '@/types/category.types';
import CategoryForm from './CategoryForm';
import ConfirmDialog from '@/features/lots/components/modals/ConfirmDialog';
import { useDebounce } from '@/hooks/useDebounce';

export default function CategoryTable() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    const { data, isLoading, error } = useCategories({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch || undefined,
    });

    const deleteQuery = useDeleteCategory();

    const handleEdit = useCallback((category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    }, []);

    const handleDeleteClick = useCallback((category: Category) => {
        setCategoryToDelete(category);
        setDeleteConfirmOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!categoryToDelete?.id) return;
        try {
            await deleteQuery.mutateAsync(categoryToDelete.id);
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setDeleteConfirmOpen(false);
        }
    }, [categoryToDelete, deleteQuery]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingCategory(null);
    }, []);

    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: 'nameUz',
            header: 'Nomi (UZ)',
        },
        {
            accessorKey: 'nameRu',
            header: 'Nomi (RU)',
        },
        {
            accessorKey: 'nameEn',
            header: 'Nomi (EN)',
        },
        {
            id: 'actions',
            header: 'Amallar',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(row.original)}
                        className="text-blue-600"
                    >
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(row.original)}
                        className="text-red-600"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: data?.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        rowCount: data?.total || 0,
    });

    return (
        <div className="space-y-4">
            {/* Error Alert */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-red-900">Kategoriyalarni yuklashda xatolik</h3>
                        <p className="text-sm text-red-700 mt-1">
                            {error instanceof Error ? error.message : 'Unknown error'}
                        </p>
                    </div>
                </div>
            )}

            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        placeholder="Kategoriyalarni qidirish..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPagination({ pageIndex: 0, pageSize: 10 });
                        }}
                        className="pl-10"
                    />
                </div>
                <Button
                    onClick={() => {
                        setEditingCategory(null);
                        setIsModalOpen(true);
                    }}
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <Plus className="w-5 h-5" />
                    Kategoriya yaratish
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50 border-b">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="px-4 py-3">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-12">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-8">
                                    <span className="text-gray-500">Kategoriyalar topilmadi</span>
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="border-b hover:bg-gray-50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4 py-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {data && data.total > 0 && (
                <div className="flex items-center justify-between bg-white rounded-lg border p-4">
                    <span className="text-sm text-gray-600">
                        Jami {data.total} ta kategoriya • Sahifa {pagination.pageIndex + 1} / {data.totalPages}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Bekor qilish
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory ? 'Kategoriyani tahrirlash' : 'Kategoriya yaratish'}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            {editingCategory ? 'Edit the category.' : 'Create a new category.'}
                        </DialogDescription>
                    </DialogHeader>
                    <CategoryForm
                        initialData={editingCategory || undefined}
                        onSuccess={handleCloseModal}
                        onCancel={handleCloseModal}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title="Kategoriyani o'chirish?"
                description={
                    categoryToDelete
                        ? `Haqiqatan ham "${categoryToDelete.nameUz}" kategoriyasini butunlay o'chirib tashlamoqchimisiz?`
                        : ''
                }
                confirmText="O'chirish"
                cancelText="Bekor qilish"
                onConfirm={handleConfirmDelete}
                loading={deleteQuery.isPending}
                destructive
            />
        </div>
    );
}
