import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { Building2, Plus, Edit2, Trash2, Search, RotateCcw, AlertCircle } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../components/ui/dialog';
import { useDistricts, useDeleteDistrict } from '../hooks/useDistricts';
import { DISTRICT_TYPE_OPTIONS, getDistrictTypeLabel } from '../types/district.types';
import { formatDate } from '../utils/formatters';
import ConfirmDialog from '@/features/lots/components/modals/ConfirmDialog';
import DistrictForm from '../features/districts/components/DistrictForm';

export default function DistrictsPage() {
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [filters, setFilters] = useState({
        search: '',
        type: '',
    });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [districtToDelete, setDistrictToDelete] = useState<any | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDistrict, setEditingDistrict] = useState<any | null>(null);

    const debouncedSearch = useDebounce(filters.search, 500);

    const { data, isLoading, error } = useDistricts({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        type: filters.type || undefined,
    });

    const deleteQuery = useDeleteDistrict();

    const handleDelete = (district: any) => {
        setDistrictToDelete(district);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!districtToDelete) return;
        try {
            await deleteQuery.mutateAsync(districtToDelete.id);
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const handleCreate = () => {
        setEditingDistrict(null);
        setIsModalOpen(true);
    };

    const handleEdit = (district: any) => {
        setEditingDistrict(district);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDistrict(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white shadow-md">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Building2 className="w-8 h-8" />
                            <h1 className="text-3xl font-bold">Tumanlarni boshqarish</h1>
                        </div>
                        <p className="text-green-100 max-w-2xl">
                            Ma'muriy tumanlar va shaharlarni boshqaring. Tuman ma'lumotlari, hokim ma'lumotlari va qabulxona ma'lumotlarini nazorat qiling.
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-red-900">Tumanlarni yuklashda xatolik</h3>
                        <p className="text-sm text-red-700 mt-1">{error.message}</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg border p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5 text-green-600" />
                    Filtrlar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Input
                        placeholder="Tumanlarni qidirish..."
                        value={filters.search}
                        onChange={(e) => {
                            setFilters({ ...filters, search: e.target.value });
                            setPagination({ page: 1, limit: 10 });
                        }}
                        className="focus:ring-green-500"
                    />

                    <Select
                        value={filters.type || 'all'}
                        onValueChange={(val) => {
                            setFilters({ ...filters, type: val === 'all' ? '' : val });
                            setPagination({ page: 1, limit: 10 });
                        }}
                    >
                        <SelectTrigger className="focus:ring-green-500">
                            <SelectValue placeholder="Barcha turlar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Barcha turlar</SelectItem>
                            {DISTRICT_TYPE_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        onClick={() => {
                            setFilters({ search: '', type: '' });
                            setPagination({ page: 1, limit: 10 });
                        }}
                        className="gap-2 col-span-2 md:col-span-1"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Tozalash
                    </Button>
                </div>
            </div>

            {/* Create Button */}
            <div className="flex justify-end">
                <Button 
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    Tuman yaratish
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                        <TableRow>
                            <TableHead className="px-4 py-3 text-left font-semibold text-gray-700">
                                Nomi
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold text-gray-700">
                                Turi
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold text-gray-700">
                                Hokim
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold text-gray-700">
                                Telefon
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold text-gray-700">
                                Email
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold text-gray-700">
                                Yaratilgan
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold text-gray-700">
                                Amallar
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data && data.data.length > 0 ? (
                            data.data.map((district) => (
                                <TableRow
                                    key={district.id}
                                    className="border-b hover:bg-green-50 transition-colors"
                                >
                                    <TableCell className="px-4 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900">{district.nameUz}</span>
                                            <span className="text-xs text-gray-500">{district.nameEn}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                            {getDistrictTypeLabel(district.type)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <span className="text-sm text-gray-900">{district.hokimNameUz}</span>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <span className="text-sm text-gray-600 font-mono">{district.phone}</span>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <span className="text-sm text-gray-600">{district.email}</span>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <span className="text-sm text-gray-600">
                                            {formatDate(district.createdAt)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-4">
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(district)}
                                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(district)}
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
                                <TableCell colSpan={7} className="text-center py-8">
                                    <span className="text-gray-500">Tumanlar topilmadi</span>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            
            {/* Pagination */}
            {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-white border border-t-0 rounded-b-lg shadow-sm">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <Button
                            variant="outline"
                            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                            disabled={pagination.page === 1}
                        >
                            Oldingi
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.page + 1, data.totalPages) }))}
                            disabled={pagination.page === data.totalPages}
                        >
                            Keyingi
                        </Button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                <span className="font-medium">{data.total}</span> ta natijadan <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> dan{' '}
                                <span className="font-medium">
                                    {Math.min(pagination.page * pagination.limit, data.total)}
                                </span> gachasi ko'rsatilmoqda
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                                disabled={pagination.page === 1}
                                className="gap-2"
                            >
                                ← Oldingi
                            </Button>
                            <div className="flex items-center px-4">
                                <span className="text-sm font-medium">
                                    Sahifa {pagination.page} / {data.totalPages}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.page + 1, data.totalPages) }))}
                                disabled={pagination.page === data.totalPages}
                                className="gap-2"
                            >
                                Keyingi →
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title="Tumanni o'chirish?"
                description={
                    districtToDelete
                        ? `Haqiqatan ham "${districtToDelete.nameUz}" tumanini butunlay o'chirmoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi.`
                        : 'Ishonchingiz komilmi?'
                }
                destructive={true}
                confirmText="Butunlay o'chirish"
                cancelText="Bekor qilish"
                loading={deleteQuery.isPending}
                onConfirm={handleConfirmDelete}
                icon="warning"
            />

            {/* Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingDistrict ? 'Tumanni tahrirlash' : 'Tuman yaratish'}
                        </DialogTitle>
                    </DialogHeader>
                    <DistrictForm
                        initialData={editingDistrict || undefined}
                        onSuccess={handleCloseModal}
                        onCancel={handleCloseModal}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}