import { useState } from "react";
import { type PaginationState } from '@tanstack/react-table';
import type { Lot } from "../schemas/schemas";
import { useDeleteLot, useLots } from "../api/hooks";


export default function LotsTable() {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10
    });

    const [filters, setFilters] = useState({
        search: '',
        status: '',
        paymentType: '',
        tradeType: ''
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLot, setEditingLot] = useState<Lot | null>(null);

    const { } = useLots({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: filters.search || undefined,
        status: filters.status || undefined,
        paymentType: filters.paymentType || undefined,
        tradeType: filters.tradeType || undefined,
    });

    const deleteLotsQuery = useDeleteLot();

    const handleEdit = (lot: Lot) => {
        setEditingLot(lot);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        // if()
    }





}