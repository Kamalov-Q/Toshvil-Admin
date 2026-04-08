import { FileStack } from 'lucide-react';
import DocsTable from '@/features/docs/components/DocsTable';
import PageHeader from '@/components/common/PageHeader';

export default function DocsPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Hujjatlarni boshqarish"
                description="Hujjatlar va ularning tegishli kategoriyalarini boshqaring"
                icon={<FileStack className="w-6 h-6" />}
            />

            <DocsTable />
        </div>
    );
}
