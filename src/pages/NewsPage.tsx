
import { Newspaper } from 'lucide-react';
import NewsTable from '@/features/news/components/NewsTable';
import PageHeader from '@/components/common/PageHeader';

export default function NewsPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="News Management"
                description="Create, edit, and publish news articles in multiple languages"
                icon={<Newspaper className="w-6 h-6" />}
            />

            <NewsTable />
        </div>
    );
}