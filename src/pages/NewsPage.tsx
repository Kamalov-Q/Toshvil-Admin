
import { Newspaper } from 'lucide-react';
import NewsTable from '@/features/news/components/NewsTable';
import PageHeader from '@/components/common/PageHeader';

export default function NewsPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Yangiliklarni boshqarish"
                description="Yangiliklarni yaratish, tahrirlash va ko'p tillarda nashr etish"
                icon={<Newspaper className="w-6 h-6" />}
            />

            <NewsTable />
        </div>
    );
}