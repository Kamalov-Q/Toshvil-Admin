import { Briefcase } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import PositionTable from '@/features/management/components/PositionTable';

export default function PositionsPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Lavozimlarni boshqarish"
                description="Bo'limlar kesimida lavozimlarni boshqaring"
                icon={<Briefcase className="w-6 h-6" />}
                variant="purple"
            />

            <PositionTable />
        </div>
    );
}
