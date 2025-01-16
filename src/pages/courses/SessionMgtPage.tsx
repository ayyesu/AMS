import React, {useState, useEffect} from 'react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {useNavigate} from 'react-router-dom';
import {
    ChevronLeftIcon,
    PlusCircleIcon,
    MapPinIcon,
    ToggleLeftIcon,
    ToggleRightIcon,
    Settings2Icon,
} from 'lucide-react';
import Heading from '@/components/shared/heading';

export default function CourseSessionPage() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([
        {
            id: 1,
            topic: 'Introduction to AI Concepts',
            date: '2025-01-15',
            time: '09:00',
            duration: '2 hours',
            status: 'inactive',
            location: {
                name: 'Lecture Hall A',
                latitude: 51.5074,
                longitude: -0.1278,
            },
            attendanceMethod: 'both',
            radiusLimit: 50,
        },
    ]);

    const [showNewSession, setShowNewSession] = useState(false);
    const [currentLocation, setCurrentLocation] = useState({
        latitude: parseFloat(''),
        longitude: parseFloat(''),
    });
    const [newSession, setNewSession] = useState({
        topic: '',
        date: '',
        time: '',
        duration: '',
        location: {
            name: '',
            latitude: '',
            longitude: '',
        },
        attendanceMethod: 'both',
        radiusLimit: 50,
        status: 'inactive',
    });

    useEffect(() => {
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                },
            );
        }
    }, []);

    const handleAddSession = () => {
        if (newSession.topic && newSession.date && newSession.time) {
            setSessions((prevSessions: any) => [
                ...prevSessions,
                {
                    id: prevSessions.length + 1,
                    ...newSession,
                },
            ]);
            setNewSession({
                topic: '',
                date: '',
                time: '',
                duration: '',
                location: {
                    name: '',
                    latitude: '',
                    longitude: '',
                },
                attendanceMethod: 'both',
                radiusLimit: 50,
                status: 'inactive',
            });
            setShowNewSession(false);
        }
    };

    const toggleSessionStatus = (sessionId: number) => {
        setSessions(
            sessions.map((session) => {
                if (session.id === sessionId) {
                    return {
                        ...session,
                        status:
                            session.status === 'active' ? 'inactive' : 'active',
                    };
                }
                return session;
            }),
        );
    };

    const detectCurrentLocation = () => {
        if (currentLocation) {
            setNewSession({
                ...newSession,
                location: {
                    ...newSession.location,
                    latitude: currentLocation.latitude.toString(),
                    longitude: currentLocation.longitude.toString(),
                },
            });
        }
    };

    return (
        <div className='p-10 transition-colors duration-300 overflow-y-auto h-screen'>
            <div className='flex items-center justify-between sticky top-0 bg-background z-20 pb-6'>
                <Heading title='Course Session Management' />
                <div className='flex justify-end gap-3'>
                    <Button onClick={() => setShowNewSession(!showNewSession)}>
                        <PlusCircleIcon className='h-4 w-4 mr-2' />
                        Add Session
                    </Button>
                    <Button onClick={() => navigate(-1)}>
                        <ChevronLeftIcon className='h-4 w-4' />
                        Back
                    </Button>
                </div>
            </div>

            {showNewSession && (
                <Card className='mt-6 transition-colors duration-300 dark:bg-gray-800'>
                    <CardHeader className='text-xl font-bold'>
                        Create New Session
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <input
                                type='text'
                                placeholder='Session Topic'
                                value={newSession.topic}
                                onChange={(e) =>
                                    setNewSession({
                                        ...newSession,
                                        topic: e.target.value,
                                    })
                                }
                                className='border p-2 rounded transition-colors duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                            />
                            <input
                                type='date'
                                value={newSession.date}
                                onChange={(e) =>
                                    setNewSession({
                                        ...newSession,
                                        date: e.target.value,
                                    })
                                }
                                className='border p-2 rounded transition-colors duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                            />
                            <input
                                type='time'
                                value={newSession.time}
                                onChange={(e) =>
                                    setNewSession({
                                        ...newSession,
                                        time: e.target.value,
                                    })
                                }
                                className='border p-2 rounded transition-colors duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                            />
                            <input
                                type='text'
                                placeholder='Duration (e.g., 2 hours)'
                                value={newSession.duration}
                                onChange={(e) =>
                                    setNewSession({
                                        ...newSession,
                                        duration: e.target.value,
                                    })
                                }
                                className='border p-2 rounded transition-colors duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                            />
                            <div className='space-y-2'>
                                <input
                                    type='text'
                                    placeholder='Location Name'
                                    value={newSession.location.name}
                                    onChange={(e) =>
                                        setNewSession({
                                            ...newSession,
                                            location: {
                                                ...newSession.location,
                                                name: e.target.value,
                                            },
                                        })
                                    }
                                    className='border p-2 rounded w-full transition-colors duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                                />
                                <div className='flex gap-2'>
                                    <Button
                                        onClick={detectCurrentLocation}
                                        className='w-full'
                                    >
                                        <MapPinIcon className='h-4 w-4 mr-2' />
                                        Detect Location
                                    </Button>
                                </div>
                                {currentLocation && (
                                    <div className='text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300'>
                                        Lat:{' '}
                                        {currentLocation.latitude.toFixed(6)},
                                        Long:{' '}
                                        {currentLocation.longitude.toFixed(6)}
                                    </div>
                                )}
                            </div>
                            <div className='space-y-2'>
                                <select
                                    value={newSession.attendanceMethod}
                                    onChange={(e) =>
                                        setNewSession({
                                            ...newSession,
                                            attendanceMethod: e.target.value,
                                        })
                                    }
                                    className='border p-2 rounded w-full transition-colors duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                                >
                                    <option value='both'>
                                        Both Lecturer & Student Based
                                    </option>
                                    <option value='lecturer'>
                                        Lecturer Based Only
                                    </option>
                                    <option value='student'>
                                        Student Based Only
                                    </option>
                                </select>
                                <input
                                    type='number'
                                    placeholder='Radius Limit (meters)'
                                    value={newSession.radiusLimit}
                                    onChange={(e) =>
                                        setNewSession({
                                            ...newSession,
                                            radiusLimit:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    className='border p-2 rounded w-full transition-colors duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                                />
                            </div>
                        </div>
                        <Button onClick={handleAddSession} className='mt-4'>
                            Create Session
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Card className='mt-6 transition-colors duration-300 dark:bg-gray-800'>
                <CardHeader className='text-xl font-bold sticky top-0 bg-background z-10'>
                    Session List
                </CardHeader>
                <CardContent>
                    <div className='relative'>
                        <div className='overflow-x-auto'>
                            <div className='overflow-y-auto'>
                                <table className='w-full'>
                                    <thead className='sticky top-0 bg-gray-100 dark:bg-gray-700 shadow-sm transition-colors duration-300'>
                                        <tr>
                                            <th className='p-3 text-left transition-colors duration-300 dark:text-white'>
                                                Topic
                                            </th>
                                            <th className='p-3 text-left transition-colors duration-300 dark:text-white'>
                                                Date & Time
                                            </th>
                                            <th className='p-3 text-left transition-colors duration-300 dark:text-white'>
                                                Location
                                            </th>
                                            <th className='p-3 text-left transition-colors duration-300 dark:text-white'>
                                                Attendance Method
                                            </th>
                                            <th className='p-3 text-left transition-colors duration-300 dark:text-white'>
                                                Radius
                                            </th>
                                            <th className='p-3 text-left transition-colors duration-300 dark:text-white'>
                                                Status
                                            </th>
                                            <th className='p-3 text-left transition-colors duration-300 dark:text-white'>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white dark:bg-gray-800 transition-colors duration-300'>
                                        {sessions.map((session) => (
                                            <tr
                                                key={session.id}
                                                className='border-t dark:border-gray-700 transition-colors duration-300'
                                            >
                                                <td className='p-3 dark:text-white'>
                                                    {session.topic}
                                                </td>
                                                <td className='p-3 dark:text-white'>
                                                    {session.date}{' '}
                                                    {session.time}
                                                </td>
                                                <td className='p-3 dark:text-white'>
                                                    {session.location.name}
                                                </td>
                                                <td className='p-3 dark:text-white'>
                                                    {session.attendanceMethod}
                                                </td>
                                                <td className='p-3 dark:text-white'>
                                                    {session.radiusLimit} meters
                                                </td>
                                                <td className='p-3 dark:text-white'>
                                                    <Badge
                                                        variant={
                                                            session.status ===
                                                            'active'
                                                                ? 'default'
                                                                : 'destructive'
                                                        }
                                                    >
                                                        {session.status}
                                                    </Badge>
                                                </td>
                                                <td className='p-3 flex gap-2'>
                                                    <Button
                                                        onClick={() =>
                                                            toggleSessionStatus(
                                                                session.id,
                                                            )
                                                        }
                                                        className='transition-colors duration-300'
                                                    >
                                                        {session.status ===
                                                        'active' ? (
                                                            <ToggleLeftIcon className='h-4 w-4' />
                                                        ) : (
                                                            <ToggleRightIcon className='h-4 w-4' />
                                                        )}
                                                    </Button>
                                                    <Button className='transition-colors duration-300'>
                                                        <Settings2Icon className='h-4 w-4' />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
