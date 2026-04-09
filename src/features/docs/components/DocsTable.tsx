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
    ExternalLink,
    Eye,
} from 'lucide-react';
import { useDocs, useDeleteDoc } from '@/hooks/useDocs';
import { type Doc } from '@/types/docs.types';
import DocsForm from './DocsForm';
import ConfirmDialog from '@/features/lots/components/modals/ConfirmDialog';
import DocViewerModal from './DocViewerModal';
import { useDebounce } from '@/hooks/useDebounce';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategory';
import { getFileUrl } from '@/utils/formatters';

export default function DocsTable() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState<string>('');
    const debouncedSearch = useDebounce(search, 500);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<Doc | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [docToDelete, setDocToDelete] = useState<Doc | null>(null);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewingDoc, setViewingDoc] = useState<Doc | null>(null);

    const { data: categoriesData } = useCategories({ page: 1, limit: 100 });
    const categories = categoriesData?.data || [];

    const { data, isLoading, error } = useDocs({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch || undefined,
        categoryId: categoryId === 'all' ? undefined : categoryId || undefined,
    });

    const deleteQuery = useDeleteDoc();

    const handleEdit = useCallback((doc: Doc) => {
        setEditingDoc(doc);
        setIsModalOpen(true);
    }, []);

    const handleDeleteClick = useCallback((doc: Doc) => {
        setDocToDelete(doc);
        setDeleteConfirmOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!docToDelete?.id) return;
        try {
            await deleteQuery.mutateAsync(docToDelete.id);
        } catch (error) {
            console.error('Delete error:', error);
        } finally {
            setDeleteConfirmOpen(false);
        }
    }, [docToDelete, deleteQuery]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingDoc(null);
    }, []);

    const columns: ColumnDef<Doc>[] = [
        {
            accessorKey: 'titleUz',
            header: 'Sarlavha (UZ)',
            cell: ({ row }) => (
                <div className="font-medium text-gray-900">{row.original.titleUz}</div>
            ),
        },
        {
            accessorKey: 'category',
            header: 'Kategoriya',
            cell: ({ row }) => {
                const catInfo = row.original.category || categories.find(c => c.id === row.original.categoryId);
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {catInfo ? catInfo.nameUz : 'Noma\'lum'}
                    </span>
                );
            },
        },
        {
            accessorKey: 'url',
            header: 'Fayl',
            cell: ({ row }) => (
                <a
                    href={getFileUrl(row.original.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Faylni ochish
                </a>
            ),
        },
        {
            id: 'actions',
            header: 'Amallar',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setViewingDoc(row.original);
                            setViewerOpen(true);
                        }}
                        className="text-emerald-600"
                        title="Ko'rish"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
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
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-red-900">Hujjatlarni yuklashda xatolik</h3>
                        <p className="text-sm text-red-700 mt-1">
                            {error instanceof Error ? error.message : 'Unknown error'}
                        </p>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <div className="relative max-w-sm w-full sm:w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Hujjatlarni qidirish..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPagination({ pageIndex: 0, pageSize: 10 });
                            }}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={categoryId || "all"}
                        onValueChange={(val) => {
                            setCategoryId(val === "all" ? '' : val);
                            setPagination({ pageIndex: 0, pageSize: 10 });
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Barcha kategoriyalar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Barcha kategoriyalar</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id!}>
                                    {cat.nameUz}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    onClick={() => {
                        setEditingDoc(null);
                        setIsModalOpen(true);
                    }}
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <Plus className="w-5 h-5" />
                    Hujjat yaratish
                </Button>
            </div>

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
                                    <span className="text-gray-500">Hujjatlar topilmadi</span>
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

            {data && data.total > 0 && (
                <div className="flex items-center justify-between bg-white rounded-lg border p-4">
                    <span className="text-sm text-gray-600">
                        Jami {data.total} ta hujjat • Sahifa {pagination.pageIndex + 1} / {data.totalPages}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Oldingi
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Keyingi
                        </Button>
                    </div>
                </div>
            )}

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-[95vw] sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingDoc ? 'Hujjatni tahrirlash' : 'Hujjat yaratish'}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            {editingDoc ? 'Edit the document attributes.' : 'Create a new document.'}
                        </DialogDescription>
                    </DialogHeader>
                    <DocsForm
                        initialData={editingDoc || undefined}
                        onSuccess={handleCloseModal}
                        onCancel={handleCloseModal}
                    />
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title="Hujjatni o'chirish?"
                description={
                    docToDelete
                        ? `Haqiqatan ham "${docToDelete.titleUz}" hujjatini butunlay o'chirib tashlamoqchimisiz?`
                        : ''
                }
                confirmText="O'chirish"
                cancelText="Bekor qilish"
                onConfirm={handleConfirmDelete}
                loading={deleteQuery.isPending}
                destructive
            />

            {viewingDoc && (
                <DocViewerModal
                    open={viewerOpen}
                    onOpenChange={setViewerOpen}
                    doc={viewingDoc}
                />
            )}
        </div>
    );
}
