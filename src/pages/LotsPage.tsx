import { MapPin, Layers, Wifi, WifiOff } from 'lucide-react';
import LotsTable from '../features/lots/components/LotsTable';
import { useLotWebSocket } from '../hooks/useLotWebSocket';

export default function LotsPage() {
    const { isConnected } = useLotWebSocket();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-md relative overflow-hidden">
                <div className="flex items-start justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <MapPin className="w-8 h-8" />
                            <h1 className="text-3xl font-bold">Lots Management</h1>
                            
                            {/* WebSocket Status Indicator */}
                            <div className={`ml-4 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                                isConnected 
                                ? 'bg-green-500/20 border-green-400 text-green-100' 
                                : 'bg-gray-500/20 border-gray-400 text-gray-300'
                            }`}>
                                {isConnected ? (
                                    <>
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        <Wifi className="w-3 h-3 ml-1" />
                                        Live
                                    </>
                                ) : (
                                    <>
                                        <span className="h-2 w-2 rounded-full bg-gray-500"></span>
                                        <WifiOff className="w-3 h-3 ml-1" />
                                        Disconnected
                                    </>
                                )}
                            </div>
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