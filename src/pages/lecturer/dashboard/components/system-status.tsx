import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import type {SystemStatus} from '@/types';

export default function SystemStatus() {
    const statuses: SystemStatus[] = [
        {
            name: 'Facial Recognition',
            status: 'Online',
            avatar: '/avatars/01.png',
        },
        {
            name: 'Geo-Location tracking',
            status: 'Offline',
            avatar: '/avatars/02.png',
        },
    ];

    const statusColors: Record<SystemStatus['status'], string> = {
        Online: 'text-green-500',
        Offline: 'text-red-500',
        Maintenance: 'text-yellow-500',
    };

    return (
        <div className='space-y-8 overflow-auto'>
            {statuses.map((user, index) => (
                <div key={index} className='flex items-center'>
                    <div className='ml-4 space-y-1'>
                        <p className='text-sm font-medium leading-none'>
                            {user.name}
                        </p>
                        <p className={`text-sm ${statusColors[user.status]}`}>
                            {user.status}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
