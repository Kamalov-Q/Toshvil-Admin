import { FolderTree } from 'lucide-react';
import CategoryTable from '@/features/categories/components/CategoryTable';
import PageHeader from '@/components/common/PageHeader';

export default function CategoriesPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Category Management"
                description="Manage categories for documents and other content"
                icon={<FolderTree className="w-6 h-6" />}
            />

            <CategoryTable />
        </div>
    );
}
