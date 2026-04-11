import { Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import ManagerTable from '@/features/management/components/ManagerTable';

export default function ManagersPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Mas'ullar"
                description="Hududlarga mas'ul etib tayinlangan xodimlar boshqaruvi"
                icon={<Users className="w-6 h-6" />}
                variant="orange"
            />

            <ManagerTable />
        </div>
    );
}
