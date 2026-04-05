import { useState } from 'react';
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
import { useDistricts, useDeleteDistrict } from '../features/districts/api/hooks';
import { DISTRICT_TYPE_OPTIONS, getDistrictTypeLabel } from '../features/districts/schemas/schema';
import { formatDate } from '../utils/formatters';
import ConfirmDialog from '@/features/lots/components/modals/ConfirmDialog';

export default function DistrictsPage() {
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [filters, setFilters] = useState({
        search: '',
        type: '',
    });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [districtToDelete, setDistrictToDelete] = useState<any | null>(null);

    const { data, isLoading, error } = useDistricts({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white shadow-md">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Building2 className="w-8 h-8" />
                            <h1 className="text-3xl font-bold">Districts Management</h1>
                        </div>
                        <p className="text-green-100 max-w-2xl">
                            Manage administrative districts and cities. Control district information, hokim details, and reception information.
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-red-900">Error loading districts</h3>
                        <p className="text-sm text-red-700 mt-1">{error.message}</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg border p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5 text-green-600" />
                    Filters
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Input
                        placeholder="Search districts..."
                        value={filters.search}
                        onChange={(e) => {
                            setFilters({ ...filters, search: e.target.value });
                            setPagination({ page: 1, limit: 10 });
                        }}
                        className="focus:ring-green-500"
                    />

                    <Select
                        value={filters.type}
                        onValueChange={(val) => {
                            setFilters({ ...filters, type: val });
                            setPagination({ page: 1, limit: 10 });
                        }}
                    >
                        <SelectTrigger className="focus:ring-green-500">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Types</SelectItem>
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
                        Reset
                    </Button>
                </div>
            </div>

            {/* Create Button */}
            <div className="flex justify-end">
                <Button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md">
                    <Plus className="w-5 h-5" />
                    Create District
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                        <TableRow>
                            <TableHead className="px-4 py-3 text-left font-semibold text-gray-700">
                                Name
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold text-gray-700">
                                Type
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold text-gray-700">
                                Hokim
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold text-gray-700">
                                Phone
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold text-gray-700">
                                Email
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold text-gray-700">
                                Created
                            </TableHead>
                            <TableHead className="px-4 py-3 text-left font-semibold text-gray-700">
                                Actions
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
                                    <span className="text-gray-500">No districts found</span>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title="Delete District?"
                description={
                    districtToDelete
                        ? `Are you sure you want to permanently delete the district "${districtToDelete.nameUz}"? This action cannot be undone.`
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