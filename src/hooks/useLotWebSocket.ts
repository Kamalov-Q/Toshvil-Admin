import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';

export type LotStatus = 'active' | 'upcoming' | 'sold' | 'cancelled';

export interface LotTimerInfo {
    lotId: string;
    tradeDate: Date | string;
    remainingMs: number;
    status: LotStatus;
    isExpired: boolean;
}

export interface UseLotWebSocketReturn {
    isConnected: boolean;
    lastEvent: any | null;
    activeTimers: LotTimerInfo[];
}

const WS_URL = (import.meta.env.VITE_WS_URL as string | undefined) ?? 'http://localhost:3000/lots';

/**
 * Connects to the backend Socket.IO namespace '/lots' to receive real-time lot updates.
 * Automatically invalidates the 'lots' React Query cache on relevant events.
 */
export function useLotWebSocket(): UseLotWebSocketReturn {
    const queryClient = useQueryClient();
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastEvent, setLastEvent] = useState<any | null>(null);
    const [activeTimers, setActiveTimers] = useState<LotTimerInfo[]>([]);

    useEffect(() => {
        // Initialize connection
        const socket = io(WS_URL, {
            transports: ['websocket'],
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
            console.log('[LotWS] Connected to /lots namespace');
            
            // Subscribe to all active timers for the list page
            socket.emit('subscribeActiveTimers');
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            console.log('[LotWS] Disconnected');
        });

        // Handle full list updates (received every second)
        socket.on('activeTimers', (data: LotTimerInfo[]) => {
            setActiveTimers(data);
            
            // Periodically invalidate the main lots list to keep data in sync
            // We do this sparingly to avoid too many refetches while showing live countdowns locally
            if (Math.random() < 0.05) { // ~5% of ticks trigger a full refresh
                queryClient.invalidateQueries({ queryKey: ['lots'] });
            }
        });

        // Handle single lot updates
        socket.on('lotTimer', (data: LotTimerInfo) => {
            setLastEvent({ type: 'lot_updated', ...data });
            queryClient.setQueryData(['lot', data.lotId], (old: any) => {
                if (!old) return old;
                return { ...old, status: data.status };
            });
        });

        // Handle expiration
        socket.on('lotExpired', (data: { lotId: string }) => {
            console.log(`[LotWS] Lot ${data.lotId} expired`);
            queryClient.invalidateQueries({ queryKey: ['lots'] });
            queryClient.invalidateQueries({ queryKey: ['lot', data.lotId] });
            setLastEvent({ type: 'lot_deleted', lotId: data.lotId });
        });

        return () => {
            if (socket) {
                socket.disconnect();
                socketRef.current = null;
            }
        };
    }, [queryClient]);

    return { isConnected, lastEvent, activeTimers };
}
