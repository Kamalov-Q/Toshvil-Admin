import { FolderTree } from 'lucide-react';
import CategoryTable from '@/features/categories/components/CategoryTable';
import PageHeader from '@/components/common/PageHeader';

export default function CategoriesPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Kategoriyalarni boshqarish"
                description="Hujjatlar va boshqa kontentlar uchun kategoriyalarni boshqarish"
                icon={<FolderTree className="w-6 h-6" />}
            />

            <CategoryTable />
        </div>
    );
}
