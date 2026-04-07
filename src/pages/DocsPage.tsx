import { FileStack } from 'lucide-react';
import DocsTable from '@/features/docs/components/DocsTable';
import PageHeader from '@/components/common/PageHeader';

export default function DocsPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Documents Management"
                description="Manage documents and their underlying categories"
                icon={<FileStack className="w-6 h-6" />}
            />

            <DocsTable />
        </div>
    );
}
