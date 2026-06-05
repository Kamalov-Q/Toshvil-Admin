import { useState } from 'react';
import { Factory, Plus, Edit2, Trash2, Search, MapPin, ExternalLink, RotateCcw } from 'lucide-react';
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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../components/ui/dialog';
import { useIndustries, useDeleteIndustry } from '../hooks/useIndustries';
import { useDistricts } from '../hooks/useDistricts';
import type { Industry } from '../types/industry.types';
import ConfirmDialog from '@/features/lots/components/modals/ConfirmDialog';
import IndustryForm from '../features/industries/components/IndustryForm';
import { useDebounce } from '../hooks/useDebounce';

export default function IndustriesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [industryToDelete, setIndustryToDelete] = useState<Industry | null>(null);

    const debouncedSearch = useDebounce(searchQuery, 500);

    const { data: industriesData, isLoading } = useIndustries({
        page: pagination.page,
        limit: pagination.limit,
        name: debouncedSearch || undefined,
    });
    const { data: districts } = useDistricts({ limit: 100 });
    const deleteMutation = useDeleteIndustry();

    const getDistrictName = (id: string) => {
        return districts?.data?.find(d => d.id === id)?.nameUz || 'Noma\'lum';
    };

    const handleCreate = () => {
        setEditingIndustry(null);
        setIsModalOpen(true);
    };

    const handleEdit = (industry: Industry) => {
        setEditingIndustry(industry);
        setIsModalOpen(true);
    };

    const handleDelete = (industry: Industry) => {
        setIndustryToDelete(industry);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (industryToDelete) {
            await deleteMutation.mutateAsync(industryToDelete.id);
            setDeleteConfirmOpen(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white shadow-md">
                <div className="flex items-center gap-3 mb-2">
                    <Factory className="w-8 h-8" />
                    <h1 className="text-3xl font-bold">Sanoat zonalari</h1>
                </div>
                <p className="text-blue-100">
                    Sanoat zonalarini boshqaring. Tumanlarga bog'langan holda yangi zonalar qo'shing va ularning joylashuvini ko'rsating.
                </p>
            </div>

            <div className="flex justify-between items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Zonalarni qidirish..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchQuery('');
                            setPagination({ page: 1, limit: 10 });
                        }}
                        className="gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Tozalash
                    </Button>
                    <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <Plus className="w-5 h-5" />
                        Yangi zona
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50 border-b">
                        <TableRow>
                            <TableHead>Nomi (UZ)</TableHead>
                            <TableHead>Tuman / Shahar</TableHead>
                            <TableHead>Joylashuv</TableHead>
                            <TableHead>Amallar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                </TableCell>
                            </TableRow>
                        ) : industriesData?.data?.length ? (
                            industriesData.data.map((item) => (
                                <TableRow key={item.id} className="hover:bg-blue-50/30">
                                    <TableCell className="font-medium">{item.nameUz}</TableCell>
                                    <TableCell>{getDistrictName(item.districtId)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-gray-500">{item.latitude}, {item.longitude}</span>
                                            {item.mapLinks && (
                                                <div className="flex gap-2">
                                                    <a href={item.mapLinks.googleMaps} target="_blank" rel="noreferrer" title="Google Maps">
                                                        <MapPin className="w-4 h-4 text-red-500" />
                                                    </a>
                                                    <a href={item.mapLinks.yandexMaps} target="_blank" rel="noreferrer" title="Yandex Maps">
                                                        <ExternalLink className="w-4 h-4 text-orange-500" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="text-blue-600 hover:bg-blue-50">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(item)} className="text-red-600 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    Sanoat zonalari topilmadi
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                {industriesData && industriesData.totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
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
                                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.page + 1, industriesData.totalPages) }))}
                                disabled={pagination.page === industriesData.totalPages}
                            >
                                Keyingi
                            </Button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">{industriesData.total}</span> ta natijadan <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> dan{' '}
                                    <span className="font-medium">
                                        {Math.min(pagination.page * pagination.limit, industriesData.total)}
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
                                        Sahifa {pagination.page} / {industriesData.totalPages}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.page + 1, industriesData.totalPages) }))}
                                    disabled={pagination.page === industriesData.totalPages}
                                    className="gap-2"
                                >
                                    Keyingi →
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingIndustry ? 'Zonani tahrirlash' : 'Yangi sanoat zonasi'}</DialogTitle>
                    </DialogHeader>
                    <IndustryForm
                        initialData={editingIndustry || undefined}
                        onSuccess={() => setIsModalOpen(false)}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                title="Zonani o'chirish?"
                description={`Ishonchingiz komilmi? "${industryToDelete?.nameUz}" zonasi butunlay o'chiriladi.`}
                onConfirm={handleConfirmDelete}
                destructive
            />
        </div>
    );
}
