import { useState } from 'react';
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
} from '../../../components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select';
import {
    Edit2,
    Trash2,
    Plus,
    AlertCircle,
    Search,
    RotateCcw,
    Eye,
    MapPin,
    DollarSign,
    Zap,
} from 'lucide-react';
import { useLots, useDeleteLot } from '../api/hooks';
import {
    type Lot,
    STATUS_OPTIONS,
    TRADE_TYPE_OPTIONS,
    PAYMENT_TYPE_OPTIONS,
    getStatusColor,
    getTradeTypeLabel,
    getPaymentTypeLabel,
} from '../schemas/schemas';
import LotModal from './LotModal';
import { formatDate, formatArea } from '../../../utils/formatters';
import ConfirmDialog from './modals/ConfirmDialog';

export default function LotsTable() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        paymentType: '',
        tradeType: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLot, setEditingLot] = useState<Lot | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [lotToDelete, setLotToDelete] = useState<Lot | null>(null);

    const { data, isLoading, error } = useLots({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: filters.search || undefined,
        status: filters.status || undefined,
        paymentType: filters.paymentType || undefined,
        tradeType: filters.tradeType || undefined,
    });

    const deleteQuery = useDeleteLot();

    const handleEdit = (lot: Lot) => {
        setEditingLot(lot);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (lot: Lot) => {
        setLotToDelete(lot);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!lotToDelete) return;
        try {
            await deleteQuery.mutateAsync(lotToDelete.id);
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingLot(null);
    };

    const handleResetFilters = () => {
        setFilters({
            search: '',
            status: '',
            paymentType: '',
            tradeType: '',
        });
        setPagination({ pageIndex: 0, pageSize: 10 });
    };

    const columns: ColumnDef<Lot>[] = [
        {
            accessorKey: 'lotNumber',
            header: 'Lot #',
            size: 80,
            cell: ({ row }) => (
                <span className="font-bold text-blue-600 text-lg">#{row.getValue('lotNumber')}</span>
            ),
        },
        {
            accessorKey: 'titleUz',
            header: 'Title',
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-gray-900 line-clamp-2">
                        {row.getValue('titleUz')}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{row.original.lotCode}</span>
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                const statusOption = STATUS_OPTIONS.find((opt) => opt.value === status);
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
                        {statusOption?.label}
                    </span>
                );
            },
        },
        {
            accessorKey: 'tradeType',
            header: 'Trade Type',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">
                        {getTradeTypeLabel(row.getValue('tradeType') as string)}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'paymentType',
            header: 'Payment',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">
                        {getPaymentTypeLabel(row.getValue('paymentType') as string)}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'landArea',
            header: 'Area',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">
                        {formatArea(parseFloat(String(row.getValue('landArea'))))}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Created',
            cell: ({ row }) => (
                <span className="text-sm text-gray-600">
                    {formatDate(row.getValue('createdAt') as string)}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Actions',
            size: 100,
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(row.original)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        title="Edit lot"
                    >
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(row.original)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        disabled={deleteQuery.isPending}
                        title="Delete lot"
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
                        <h3 className="font-semibold text-red-900">Error loading lots</h3>
                        <p className="text-sm text-red-700 mt-1">{error.message}</p>
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
                        placeholder="Search by title or code..."
                        value={filters.search}
                        onChange={(e) => {
                            setFilters({ ...filters, search: e.target.value });
                            setPagination({ pageIndex: 0, pageSize: 10 });
                        }}
                        className="focus:ring-blue-500"
                    />

                    <Select
                        value={filters.status || "all"}
                        onValueChange={(val) => {
                            setFilters({ ...filters, status: val === "all" ? "" : val });
                            setPagination({ pageIndex: 0, pageSize: 10 });
                        }}
                    >
                        <SelectTrigger className="focus:ring-blue-500">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {STATUS_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.paymentType || "all"}
                        onValueChange={(val) => {
                            setFilters({ ...filters, paymentType: val === "all" ? "" : val });
                            setPagination({ pageIndex: 0, pageSize: 10 });
                        }}
                    >
                        <SelectTrigger className="focus:ring-blue-500">
                            <SelectValue placeholder="Payment Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {PAYMENT_TYPE_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.tradeType || "all"}
                        onValueChange={(val) => {
                            setFilters({ ...filters, tradeType: val === "all" ? "" : val });
                            setPagination({ pageIndex: 0, pageSize: 10 });
                        }}
                    >
                        <SelectTrigger className="focus:ring-blue-500">
                            <SelectValue placeholder="Trade Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {TRADE_TYPE_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        onClick={handleResetFilters}
                        className="gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </Button>
                </div>
            </div>

            {/* Create Button */}
            <div className="flex justify-end">
                <Button
                    onClick={() => {
                        setEditingLot(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    Create New Lot
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="px-4 py-3 text-left font-semibold text-gray-700"
                                    >
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
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <span className="text-gray-600 font-medium">Loading lots...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-12">
                                    <div className="flex flex-col items-center gap-3">
                                        <Eye className="h-12 w-12 text-gray-300" />
                                        <span className="text-gray-500 font-medium text-lg">No lots found</span>
                                        <span className="text-sm text-gray-400">
                                            {Object.values(filters).some((val) => val)
                                                ? 'Try adjusting your filters'
                                                : 'Start by creating a new lot'}
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="border-b hover:bg-blue-50 transition-colors duration-150"
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
                <div className="flex items-center justify-between bg-white rounded-lg border p-4 shadow-sm">
                    <div className="text-sm text-gray-600">
                        <span className="font-semibold">{data.total}</span> total lots •{' '}
                        <span className="font-semibold">
                            {pagination.pageIndex + 1}
                        </span>{' '}
                        of{' '}
                        <span className="font-semibold">
                            {Math.ceil(data.total / pagination.pageSize)}
                        </span>{' '}
                        pages
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="gap-2"
                        >
                            ← Previous
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="gap-2"
                        >
                            Next →
                        </Button>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[1600px] w-[95vw] max-h-[95vh] overflow-y-auto p-0">
                    <DialogHeader className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-lg">
                        <DialogTitle className="text-xl">
                            {editingLot ? `Edit Lot #${editingLot.lotNumber}` : 'Create New Lot'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-6 py-4">
                        <LotModal lot={editingLot || undefined} onClose={handleCloseModal} />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title="Delete Lot?"
                description={
                    lotToDelete
                        ? `Are you sure you want to permanently delete lot #${lotToDelete.lotNumber} "${lotToDelete.titleUz}"? This action cannot be undone and all associated data will be lost.`
                        : 'Are you sure?'
                }
                destructive={true}
                confirmText="Delete Permanently"
                cancelText="Keep It"
                loading={deleteQuery.isPending}
                onConfirm={handleConfirmDelete}
                icon="warning"
            />
        </div>
    );
}