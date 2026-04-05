import { MapPin, Layers } from 'lucide-react';
import LotsTable from '../features/lots/components/LotsTable';

export default function LotsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-md">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <MapPin className="w-8 h-8" />
                            <h1 className="text-3xl font-bold">Lots Management</h1>
                        </div>
                        <p className="text-blue-100 max-w-2xl">
                            Manage land lots and properties. Create, edit, and delete lot listings with complete control over all details.
                        </p>
                    </div>
                    <Layers className="w-12 h-12 opacity-20" />
                </div>
            </div>

            {/* Content */}
            <LotsTable />
        </div>
    );
}