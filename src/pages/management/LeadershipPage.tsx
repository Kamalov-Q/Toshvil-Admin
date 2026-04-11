import { Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import LeadershipTable from '@/features/management/components/LeadershipTable';

export default function LeadershipPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Rahbariyat"
                description="Tashkilot rahbariyati va ularga biriktirilgan tumanlar"
                icon={<Users className="w-6 h-6" />}
                variant="green"
            />

            <LeadershipTable />
        </div>
    );
}
