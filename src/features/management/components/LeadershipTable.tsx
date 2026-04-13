import { useState } from 'react';
import { Edit2, Trash2, Search, RotateCcw, Plus, Mail, Phone, MapPin } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { useLeaderships, useDeleteLeadership } from '@/hooks/useManagement';
import { useDistricts } from '@/hooks/useDistricts';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';
import { useDebounce } from '@/hooks/useDebounce';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import ConfirmDialog from '@/features/lots/components/modals/ConfirmDialog';
import LeadershipForm from './LeadershipForm';
import type { Leadership } from '@/types/management.types';

export default function LeadershipTable() {
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        districtId: '',
        departmentId: '',
        positionId: '',
    });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Leadership | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Leadership | null>(null);

    const debouncedSearch = useDebounce(search, 500);

    const { data, isLoading } = useLeaderships({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        districtId: filters.districtId || undefined,
        departmentId: filters.departmentId || undefined,
        positionId: filters.positionId || undefined,
    });

    const { data: districtsData } = useDistricts({ limit: 100 });
    const { data: departmentsData } = useDepartments();
    const { data: positionsData } = usePositions();

    const deleteQuery = useDeleteLeadership();

    const handleDelete = (item: Leadership) => {
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

    const handleEdit = (item: Leadership) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    return (
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Rahbarlarni qidirish..."
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
                                setFilters({ districtId: '', departmentId: '', positionId: '' });
                                setPagination({ ...pagination, page: 1 });
                            }}
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Tozalash
                        </Button>
                        <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700 text-white shadow-md">
                            <Plus className="w-4 h-4 mr-2" />
                            Yangi rahbar
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t">
                    <Select
                        value={filters.districtId || 'all'}
                        onValueChange={(val) => {
                            setFilters({ ...filters, districtId: val === 'all' ? '' : val });
                            setPagination({ ...pagination, page: 1 });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Barcha tumanlar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Barcha tumanlar</SelectItem>
                            {districtsData?.data?.map((d) => (
                                <SelectItem key={d.id} value={d.id}>
                                    {d.nameUz}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.departmentId || 'all'}
                        onValueChange={(val) => {
                            setFilters({ ...filters, departmentId: val === 'all' ? '' : val });
                            setPagination({ ...pagination, page: 1 });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Barcha bo'limlar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Barcha bo'limlar</SelectItem>
                            {departmentsData?.data?.map((d) => (
                                <SelectItem key={d.id} value={d.id}>
                                    {d.nameUz}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.positionId || 'all'}
                        onValueChange={(val) => {
                            setFilters({ ...filters, positionId: val === 'all' ? '' : val });
                            setPagination({ ...pagination, page: 1 });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Barcha lavozimlar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Barcha lavozimlar</SelectItem>
                            {positionsData?.data?.map((d) => (
                                <SelectItem key={d.id} value={d.id}>
                                    {d.nameUz}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50 border-b">
                        <TableRow>
                            <TableHead className="w-[80px]">Rasm</TableHead>
                            <TableHead className="min-w-[200px]">F.I.O. / Lavozim</TableHead>
                            <TableHead>Kontaktlar</TableHead>
                            <TableHead>Tumanlar</TableHead>
                            <TableHead className="text-right">Amallar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data?.data && data.data.length > 0 ? (
                            data.data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <TableCell>
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                            {item.image ? (
                                                <img src={item.image} alt={item.nameUz} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Search className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 leading-tight">{item.nameUz}</span>
                                            <span className="text-sm text-blue-600 font-medium">
                                                {item.position?.nameUz}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {item.department?.nameUz}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {item.phone && (
                                                <div className="flex items-center text-xs text-gray-600">
                                                    <Phone className="w-3 h-3 mr-1.5 text-gray-400" />
                                                    {item.phone}
                                                </div>
                                            )}
                                            {item.email && (
                                                <div className="flex items-center text-xs text-gray-600">
                                                    <Mail className="w-3 h-3 mr-1.5 text-gray-400" />
                                                    {item.email}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {item.districts?.map((d) => (
                                                <Badge key={d.id} variant="outline" className="text-[10px] bg-slate-50 border-slate-200 font-normal">
                                                    <MapPin className="w-2.5 h-2.5 mr-1 text-slate-400" />
                                                    {d.nameUz}
                                                </Badge>
                                            ))}
                                            {(!item.districts || item.districts.length === 0) && (
                                                <span className="text-xs text-gray-400 italic">Biriktirilmagan</span>
                                            )}
                                        </div>
                                    </TableCell>
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
                                <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                                    Ma'lumotlar topilmadi
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {data && data.totalPages > 1 && (
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
                title="Rahbarni o'chirish?"
                description={`Haqiqatan ham "${itemToDelete?.nameUz}" nomli rahbar ma'lumotlarini o'chirib tashlamoqchimisiz?`}
                destructive={true}
                confirmText="O'chirish"
                cancelText="Bekor qilish"
                loading={deleteQuery.isPending}
                onConfirm={handleConfirmDelete}
            />

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem ? 'Rahbar ma\'lumotlarini tahrirlash' : 'Yangi rahbar qo\'shish'}
                        </DialogTitle>
                    </DialogHeader>
                    <LeadershipForm
                        initialData={editingItem || undefined}
                        onSuccess={handleCloseModal}
                        onCancel={handleCloseModal}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
