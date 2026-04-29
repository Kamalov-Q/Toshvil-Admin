import { useState } from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
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
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Plus, AlertCircle, Eye } from 'lucide-react';
import { useAuctions, useDeleteAuction } from '../api/hooks';
import type { Auction } from '../schemas/schemas';
import AuctionModal from './AuctionModal';
import ConfirmDialog from '@/features/lots/components/modals/ConfirmDialog';
import { Badge } from '@/components/ui/badge';

export default function AuctionsTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuction, setEditingAuction] = useState<Auction | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [auctionToDelete, setAuctionToDelete] = useState<Auction | null>(null);

  const { data: auctionsData, isLoading, error } = useAuctions();
  const auctions = auctionsData?.data || [];
  const deleteMutation = useDeleteAuction();

  const handleEdit = (auction: Auction) => {
    setEditingAuction(auction);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (auction: Auction) => {
    setAuctionToDelete(auction);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!auctionToDelete) return;
    try {
      await deleteMutation.mutateAsync(auctionToDelete.id);
      setDeleteConfirmOpen(false);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const columns: ColumnDef<Auction>[] = [
    {
      accessorKey: 'nameUz',
      header: 'Nomi (UZ)',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.getValue('nameUz')}</span>
      ),
    },
    {
      accessorKey: 'path',
      header: 'Havola',
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">{row.getValue('path')}</span>
      ),
    },
    {
      accessorKey: 'districts',
      header: 'Tumanlar',
      cell: ({ row }) => {
        const districts = row.original.districts || [];
        return (
          <div className="flex flex-wrap gap-1">
            {districts.map((d) => (
              <Badge key={d.id} variant="secondary" className="text-[10px]">
                {d.nameUz}
              </Badge>
            ))}
            {districts.length === 0 && <span className="text-gray-400 text-xs">—</span>}
          </div>
        );
      },
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
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(row.original)}
            className="text-red-600 hover:text-red-800 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: auctions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 text-red-700 font-medium text-sm">
          <AlertCircle className="h-5 w-5" />
          Xatolik yuz berdi: {(error as any).message}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditingAuction(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Yangi auksion yaratish
        </Button>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4 py-3 text-left font-semibold text-gray-700">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span>Yuklanmoqda...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Eye className="w-12 h-12" />
                    <span>Auksionlar mavjud emas</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50 transition-colors">
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingAuction ? 'Auksionni tahrirlash' : 'Yangi auksion yaratish'}
            </DialogTitle>
          </DialogHeader>
          <AuctionModal 
            auction={editingAuction || undefined} 
            onClose={() => setIsModalOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="O'chirishni tasdiqlang"
        description="Haqiqatan ham ushbu auksionni o'chirib tashlamoqchimisiz?"
        onConfirm={handleConfirmDelete}
        destructive
      />
    </div>
  );
}
