import { useState, useCallback } from 'react';
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type PaginationState,
    type RowSelectionState,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Edit2,
    Trash2,
    Plus,
    AlertCircle,
    Search,
    RotateCcw,
    Eye,
    EyeOff,
    Calendar,
    Tag,
} from 'lucide-react';
import {
    useNewsList,
    useDeleteNews,
    useToggleNewsPublish,
    useBulkDeleteNews,
} from '@/hooks/useNewsQueries';
import {
    type News,
    type NewsQueryParams,
    NewsCategoryEnum,
    type NewsFilterState,
} from '@/types/news.types';
import NewsForm from './NewsForm';
import ConfirmDialog from '@/features/lots/components/modals/ConfirmDialog';
import { useDebounce } from '@/hooks/useDebounce';

const NEWS_CATEGORIES = [
    { value: NewsCategoryEnum.ANNOUNCEMENTS, label: 'Announcements' },
    { value: NewsCategoryEnum.EVENTS, label: 'Events' },
    { value: NewsCategoryEnum.TECHNOLOGY, label: 'Technology' },
    { value: NewsCategoryEnum.PRESS_RELEASE, label: 'Press Release' },
    { value: NewsCategoryEnum.OTHER, label: 'Other' },
];

const CATEGORY_COLORS: Record<NewsCategoryEnum, string> = {
    [NewsCategoryEnum.ANNOUNCEMENTS]: 'bg-blue-100 text-blue-800',
    [NewsCategoryEnum.EVENTS]: 'bg-purple-100 text-purple-800',
    [NewsCategoryEnum.TECHNOLOGY]: 'bg-cyan-100 text-cyan-800',
    [NewsCategoryEnum.PRESS_RELEASE]: 'bg-red-100 text-red-800',
    [NewsCategoryEnum.OTHER]: 'bg-gray-100 text-gray-800',
};

export default function NewsTable() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const [filters, setFilters] = useState<NewsFilterState>({
        search: '',
        category: '',
        isPublished: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<News | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState<News | null>(null);
    const [publishingId, setPublishingId] = useState<string | null>(null);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const debouncedSearch = useDebounce(filters.search, 500);

    const queryParams: NewsQueryParams = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch || undefined,
        category: filters.category ? (filters.category as NewsCategoryEnum) : undefined,
        isPublished:
            filters.isPublished === 'true'
                ? true
                : filters.isPublished === 'false'
                    ? false
                    : undefined,
    };

    const { data, isLoading, error } = useNewsList(queryParams);
    const deleteQuery = useDeleteNews();
    const publishQuery = useToggleNewsPublish(publishingId || '');
    const bulkDeleteQuery = useBulkDeleteNews();

    const handleEdit = useCallback((news: News) => {
        setEditingNews(news);
        setIsModalOpen(true);
    }, []);

    const handleDeleteClick = useCallback((news: News) => {
        setNewsToDelete(news);
        setDeleteConfirmOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!newsToDelete) return;
        try {
            await deleteQuery.mutateAsync(newsToDelete.id);
        } catch (error) {
            console.error('Delete error:', error);
        }
    }, [newsToDelete, deleteQuery]);

    const handleTogglePublish = useCallback(
        async (news: News) => {
            try {
                setPublishingId(news.id);
                await publishQuery.mutateAsync(!news.isPublished);
            } catch (error) {
                console.error('Publish error:', error);
            } finally {
                setPublishingId(null);
            }
        },
        [publishQuery]
    );

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingNews(null);
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters({
            search: '',
            category: '',
            isPublished: '',
        });
        setPagination({ pageIndex: 0, pageSize: 10 });
    }, []);

    const columns: ColumnDef<News>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                />
            ),
        },
        {
            accessorKey: 'titleUz',
            header: 'Title',
            cell: ({ row }) => {
                const news = row.original;
                return (
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 line-clamp-2">
                            {news.titleUz}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {news.shortDescriptionUz}
                        </p>
                    </div>
                );
            },
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }) => {
                const category = row.getValue('category') as NewsCategoryEnum;
                return (
                    <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[category]
                                }`}
                        >
                            {NEWS_CATEGORIES.find((c) => c.value === category)?.label}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'isPublished',
            header: 'Status',
            cell: ({ row }) => {
                const isPublished = row.getValue('isPublished') as boolean;
                return (
                    <div className="flex items-center gap-2">
                        {isPublished ? (
                            <>
                                <Eye className="w-4 h-4 text-green-600" />
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                    Published
                                </span>
                            </>
                        ) : (
                            <>
                                <EyeOff className="w-4 h-4 text-gray-400" />
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                    Draft
                                </span>
                            </>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'createdAt',
            header: 'Created',
            cell: ({ row }) => {
                const date = new Date(row.getValue('createdAt') as string);
                return (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                            {date.toLocaleDateString()} {date.toLocaleTimeString()}
                        </span>
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublish(row.original)}
                        disabled={publishingId === row.original.id}
                        title={row.original.isPublished ? 'Unpublish' : 'Publish'}
                    >
                        {publishingId === row.original.id ? (
                            <span className="w-4 h-4 animate-spin">⟳</span>
                        ) : row.original.isPublished ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
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
            rowSelection,
        },
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        rowCount: data?.total || 0,
    });

    const selectedRows = table.getSelectedRowModel().rows;

    return (
        <div className="space-y-4">
            {/* Error Alert */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-red-900">Error loading news</h3>
                        <p className="text-sm text-red-700 mt-1">
                            {error instanceof Error ? error.message : 'Unknown error'}
                        </p>
                    </div>
                </div>
            )}

            {/* Filters Card */}
            <div className="bg-white rounded-lg border p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-600" />
                    Filters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <Input
                        placeholder="Search by title..."
                        value={filters.search}
                        onChange={(e) => {
                            setFilters({ ...filters, search: e.target.value });
                            setPagination({ pageIndex: 0, pageSize: 10 });
                        }}
                    />

                    <Select
                        value={filters.category || "all"}
                        onValueChange={(val) => {
                            setFilters({ ...filters, category: val === "all" ? '' : val as NewsCategoryEnum | '' });
                            setPagination({ pageIndex: 0, pageSize: 10 });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {NEWS_CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.isPublished || "all"}
                        onValueChange={(val) => {
                            setFilters({ ...filters, isPublished: val === "all" ? '' : val as '' | 'true' | 'false' });
                            setPagination({ pageIndex: 0, pageSize: 10 });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="true">Published</SelectItem>
                            <SelectItem value="false">Draft</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        onClick={handleResetFilters}
                        className="gap-2 col-span-2 md:col-span-1"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </Button>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedRows.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">
                        {selectedRows.length} item{selectedRows.length !== 1 ? 's' : ''} selected
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                                const ids = selectedRows.map((row) => row.original.id);
                                try {
                                    await bulkDeleteQuery.mutateAsync(ids);
                                    setRowSelection({});
                                } catch (error) {
                                    console.error('Bulk delete error:', error);
                                }
                            }}
                            disabled={bulkDeleteQuery.isPending}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Selected
                        </Button>
                    </div>
                </div>
            )}

            {/* Create Button */}
            <div className="flex justify-end">
                <Button
                    onClick={() => {
                        setEditingNews(null);
                        setIsModalOpen(true);
                    }}
                    className="gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Create News
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
                                    <span className="text-gray-500">No news found</span>
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
                        {data.total} total news • Page {pagination.pageIndex + 1} of{' '}
                        {Math.ceil(data.total / pagination.pageSize)}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
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
                <DialogContent className="max-w-[95vw] sm:max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingNews ? 'Edit News' : 'Create News'}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            {editingNews ? 'Edit the details of the selected news item.' : 'Fill in the details to create a new news item.'}
                        </DialogDescription>
                    </DialogHeader>
                    <NewsForm
                        initialData={editingNews || undefined}
                        onSuccess={handleCloseModal}
                        onCancel={handleCloseModal}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title="Delete News?"
                description={
                    newsToDelete
                        ? `Are you sure you want to permanently delete "${newsToDelete.titleUz}"? This action cannot be undone.`
                        : ''
                }
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirmDelete}
                loading={deleteQuery.isPending}
                destructive
            />
        </div>
    );
}