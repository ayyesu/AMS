import { useEffect, useState } from 'react';
import type { SystemStatus } from '@/types';
import { systemApi } from '@/lib/api';

export default function SystemStatus() {
    const [statuses, setStatuses] = useState<SystemStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSystemStatus = async () => {
            try {
                setLoading(true);
                const data = await systemApi.getStatus();
                
                // Transform API response to match SystemStatus type
                const formattedStatuses: SystemStatus[] = [];
                
                // Skip the description field (first entry)
                Object.entries(data).forEach(([key, value], index) => {
                    if (key !== "System Status") {
                        formattedStatuses.push({
                            name: key,
                            status: value as 'Online' | 'Offline' | 'Maintenance',
                            avatar: `/avatars/0${index}.png`,
                        });
                    }
                });
                
                setStatuses(formattedStatuses);
            } catch (err) {
                console.error("Failed to fetch system status:", err);
                setError("Failed to load system status");
            } finally {
                setLoading(false);
            }
        };

        fetchSystemStatus();
    }, []);

    const statusColors: Record<SystemStatus['status'], string> = {
        Online: 'text-green-500',
        Offline: 'text-red-500',
        Maintenance: 'text-yellow-500',
    };

    if (loading) return <div>Loading system status...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className='space-y-8 overflow-auto'>
            {statuses.map((status, index) => (
                <div key={index} className='flex items-center'>
                    <div className='ml-4 space-y-1'>
                        <p className='text-sm font-medium leading-none'>
                            {status.name}
                        </p>
                        <p className={`text-sm ${statusColors[status.status]}`}>
                            {status.status}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
