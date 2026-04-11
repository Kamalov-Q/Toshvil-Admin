import { FolderTree } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import DepartmentTable from '@/features/management/components/DepartmentTable';

export default function DepartmentsPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Bo'limlarni boshqarish"
                description="Tashkilot bo'limlarini boshqaring"
                icon={<FolderTree className="w-6 h-6" />}
                variant="blue"
            />

            <DepartmentTable />
        </div>
    );
}
