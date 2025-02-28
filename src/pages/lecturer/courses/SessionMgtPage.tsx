import React, {useState, useEffect} from 'react';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {useNavigate, useParams} from 'react-router-dom';
import {
    ChevronLeftIcon,
    PlusCircleIcon,
    MapPinIcon,
    ToggleLeftIcon,
    ToggleRightIcon,
    Trash2Icon,
} from 'lucide-react';
import Heading from '@/components/shared/heading';
import {useSessionContext} from '@/context/session-context';
import {sessionApi} from '@/lib/api';
import {useToast} from '@/components/ui/use-toast';
import {InfoIcon} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function CourseSessionPage() {
    const navigate = useNavigate();
    const {courseId} = useParams();
    const {toast} = useToast();
    const {sessions, setSessions, loading, setLoading, setError} =
        useSessionContext();
    const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
    const [showNewSession, setShowNewSession] = useState(false);
    const [currentLocation, setCurrentLocation] = useState({
        latitude: 0,
        longitude: 0,
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
        attendance_type: 'face_recognition',
        radius: 50,
        status: 'inactive',
        attendance_weight: 100,
    });

    console.log(newSession);

    // Fetch sessions when component mounts
    useEffect(() => {
        const fetchSessions = async () => {
            if (!courseId) return;
            try {
                setLoading(true);
                const response = await sessionApi.getByCourse(courseId);
                setSessions(response.data);
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch sessions';
                setError(errorMessage);
                toast({
                    title: 'Error',
                    description: errorMessage,
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [courseId, setSessions, setLoading, setError]);

    // Get current location
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
                    toast({
                        title: 'Error',
                        description: 'Failed to get location',
                        variant: 'destructive',
                    });
                },
            );
        }
    }, []);

    const handleAddSession = async () => {
        try {
            // Validate required fields
            if (
                !newSession.topic ||
                !newSession.date ||
                !newSession.time ||
                !newSession.duration
            ) {
                toast({
                    title: 'Error',
                    description: 'Please fill in all required fields',
                    variant: 'destructive',
                });
                return;
            }

            if (
                !newSession.location.name ||
                !newSession.location.latitude ||
                !newSession.location.longitude
            ) {
                toast({
                    title: 'Error',
                    description: 'Please set the session location',
                    variant: 'destructive',
                });
                return;
            }
            setLoading(true);
            const sessionDate = new Date(
                `${newSession.date}T${newSession.time}`,
            );
            const response = await sessionApi.create({
                course: courseId,
                topic: newSession.topic,
                duration: parseInt(newSession.duration),
                session_date: sessionDate,
                status: newSession.status,
                attendance_weight: newSession.attendance_weight,
                attendance_type: newSession.attendance_type,
                location: {
                    name: newSession.location.name,
                    latitude: parseFloat(newSession.location.latitude),
                    longitude: parseFloat(newSession.location.longitude),
                    radius: newSession.radius,
                },
            });

            setSessions((prevSessions) => [...prevSessions, response.data]);
            setShowNewSession(false);
            toast({
                title: 'Success',
                description: 'Session created successfully',
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to create session';
            setError(errorMessage);
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSession = async (sessionId: string) => {
        try {
            setLoading(true);
            await sessionApi.delete(sessionId);

            // Update local state by removing the deleted session
            setSessions((prevSessions) =>
                prevSessions.filter((session) => session._id !== sessionId),
            );

            toast({
                title: 'Success',
                description: 'Session deleted successfully',
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete session';
            setError(errorMessage);
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
            setSessionToDelete(null);
        }
    };

    const confirmDelete = (sessionId: string) => {
        setSessionToDelete(sessionId);
    };

    const toggleSessionStatus = async (sessionId: string) => {
        try {
            setLoading(true);
            const session = sessions.find((s) => s._id === sessionId);
            if (!session) {
                throw new Error('Session not found');
            }

            const newStatus =
                session.status === 'active' ? 'inactive' : 'active';

            // Update session in the database
            const response = await sessionApi.update(sessionId, {
                status: newStatus,
            });

            // Update local state with the response from server
            setSessions((prevSessions) =>
                prevSessions.map((s) =>
                    s._id === sessionId ? response.data : s,
                ),
            );

            toast({
                title: 'Success',
                description: `Session status updated to ${newStatus}`,
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to update session status';
            setError(errorMessage);
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const detectCurrentLocation = () => {
        if (currentLocation.latitude && currentLocation.longitude) {
            setNewSession((prev) => ({
                ...prev,
                location: {
                    ...prev.location,
                    name: prev.location.name || 'Current Location',
                    latitude: currentLocation.latitude.toString(),
                    longitude: currentLocation.longitude.toString(),
                },
            }));

            toast({
                title: 'Location Detected',
                description: `Lat: ${currentLocation.latitude.toFixed(6)}, Long: ${currentLocation.longitude.toFixed(6)}`,
            });
        } else {
            toast({
                title: 'Error',
                description: 'Could not detect location. Please try again.',
                variant: 'destructive',
            });
        }
    };
    const hallSizeRecommendations = {
        small: {size: 'Small Hall (< 50 students)', radius: 20},
        medium: {size: 'Medium Hall (50-150 students)', radius: 35},
        large: {size: 'Large Hall (150-300 students)', radius: 50},
        auditorium: {size: 'Auditorium (300+ students)', radius: 75},
    };
    const handleHallSizeChange = (
        size: keyof typeof hallSizeRecommendations,
    ) => {
        setNewSession((prev) => ({
            ...prev,
            radius: hallSizeRecommendations[size].radius,
        }));
    };
    return (
        <div className='transition-colors duration-300 h-full flex-1 space-y-4 overflow-y-auto p-4 md:p-8'>
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

            <AlertDialog
                open={!!sessionToDelete}
                onOpenChange={() => setSessionToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the session and all related attendance
                            records.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                sessionToDelete &&
                                handleDeleteSession(sessionToDelete)
                            }
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
                                <div className='grid grid-cols-2 gap-2'>
                                    <input
                                        type='text'
                                        placeholder='Latitude'
                                        value={newSession.location.latitude}
                                        readOnly
                                        className='border p-2 rounded w-full transition-colors duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                                    />
                                    <input
                                        type='text'
                                        placeholder='Longitude'
                                        value={newSession.location.longitude}
                                        readOnly
                                        className='border p-2 rounded w-full transition-colors duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                                    />
                                </div>
                                <Button
                                    onClick={detectCurrentLocation}
                                    className='w-full'
                                >
                                    <MapPinIcon className='h-4 w-4 mr-2' />
                                    Detect Location
                                </Button>
                            </div>
                            <div className='space-y-2'>
                                <select
                                    value={newSession.attendance_type}
                                    onChange={(e) =>
                                        setNewSession({
                                            ...newSession,
                                            attendance_type: e.target.value,
                                        })
                                    }
                                    className='border p-2 rounded w-full transition-colors duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                                >
                                    <option value='face_recognition'>
                                        Lecturer Based
                                    </option>
                                    <option value='student_based'>
                                        Student Based
                                    </option>
                                </select>

                                <div className='space-y-2'>
                                    <div className='flex items-center gap-2 mb-2'>
                                        <label className='text-sm font-medium'>
                                            Hall Size
                                        </label>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <InfoIcon className='h-4 w-4 text-muted-foreground' />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        Select hall size for
                                                        recommended radius
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <Select
                                        onValueChange={handleHallSizeChange}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select hall size' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(
                                                hallSizeRecommendations,
                                            ).map(([key, value]) => (
                                                <SelectItem
                                                    key={key}
                                                    value={key}
                                                >
                                                    {value.size}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <div className='mt-4'>
                                        <div className='flex items-center justify-between'>
                                            <label className='text-sm font-medium'>
                                                Radius Limit (meters)
                                            </label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <InfoIcon className='h-4 w-4 text-muted-foreground' />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className='space-y-2'>
                                                            <p className='font-medium'>
                                                                Recommended
                                                                Ranges:
                                                            </p>
                                                            <ul className='text-sm'>
                                                                <li>
                                                                    Small Hall:
                                                                    20m
                                                                </li>
                                                                <li>
                                                                    Medium Hall:
                                                                    35m
                                                                </li>
                                                                <li>
                                                                    Large Hall:
                                                                    50m
                                                                </li>
                                                                <li>
                                                                    Auditorium:
                                                                    75m
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <input
                                                type='range'
                                                min='10'
                                                max='100'
                                                step='5'
                                                value={newSession.radius}
                                                onChange={(e) =>
                                                    setNewSession({
                                                        ...newSession,
                                                        radius: parseInt(
                                                            e.target.value,
                                                        ),
                                                    })
                                                }
                                                className='flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
                                            />
                                            <input
                                                type='number'
                                                value={newSession.radius}
                                                onChange={(e) =>
                                                    setNewSession({
                                                        ...newSession,
                                                        radius:
                                                            parseInt(
                                                                e.target.value,
                                                            ) || 0,
                                                    })
                                                }
                                                className='w-20 border p-2 rounded text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                                                min='10'
                                                max='100'
                                            />
                                        </div>
                                        <div className='mt-1 text-sm text-muted-foreground'>
                                            Coverage area: ~
                                            {Math.round(
                                                Math.PI *
                                                    Math.pow(
                                                        newSession.radius,
                                                        2,
                                                    ),
                                            )}
                                            m²
                                        </div>
                                    </div>
                                </div>
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
                                                key={session._id}
                                                className='border-t dark:border-gray-700 transition-colors duration-300'
                                            >
                                                <td className='p-3 dark:text-white'>
                                                    {session.topic}
                                                </td>
                                                <td className='p-3 dark:text-white'>
                                                    {new Date(
                                                        session.session_date,
                                                    ).toLocaleString()}
                                                </td>
                                                <td className='p-3 dark:text-white'>
                                                    {session.location.name}
                                                </td>
                                                <td className='p-3 dark:text-white'>
                                                    {session.attendance_type}
                                                </td>
                                                <td className='p-3 dark:text-white'>
                                                    {session.location.radius}{' '}
                                                    meters
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
                                                                session._id,
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
                                                    <Button
                                                        variant='destructive'
                                                        onClick={() =>
                                                            confirmDelete(
                                                                session._id,
                                                            )
                                                        }
                                                        className='transition-colors duration-300'
                                                    >
                                                        <Trash2Icon className='h-4 w-4' />
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
