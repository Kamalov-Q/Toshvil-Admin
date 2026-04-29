import { Layers, Gavel } from 'lucide-react';
import AuctionsTable from '../features/auctions/components/AuctionsTable';

export default function AuctionsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white shadow-md relative overflow-hidden">
                <div className="flex items-start justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Gavel className="w-8 h-8" />
                            <h1 className="text-3xl font-bold">Auksionlarni boshqarish</h1>
                        </div>
                        <p className="text-blue-100 max-w-2xl">
                          Toshkent viloyati auksion turlarini yarating va ularni tumanlarga biriktiring.
                        </p>
                    </div>
                    <Layers className="w-12 h-12 opacity-20" />
                </div>
            </div>

            {/* Content */}
            <AuctionsTable />
        </div>
    );
}
