import React, {useState} from 'react';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {courses} from '@/constants/data';
import {Badge} from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import PageHead from '@/components/shared/page-head';
import {Breadcrumbs} from '@/components/shared/breadcrumbs';
import WebcamCapture from '@/components/shared/camera';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {InfoIcon} from 'lucide-react';

interface Session {
    id: number;
    topic: string;
    date: string;
    time: string;
    status: string;
}

interface AttendanceRecord {
    id: number;
    studentId: string;
    studentName: string;
    checkInTime: string;
    status: 'present' | 'absent' | 'late';
    location: string;
}

export default function AttendanceManagementPage() {
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedSession, setSelectedSession] = useState<string>('');
    const [attendanceRecords, setAttendanceRecords] = useState<
        AttendanceRecord[]
    >([
        {
            id: 1,
            studentId: '10234567',
            studentName: 'John Doe',
            checkInTime: '09:15',
            status: 'present',
            location: 'Within Range',
        },
        {
            id: 2,
            studentId: '10234568',
            studentName: 'Jane Smith',
            checkInTime: '09:30',
            status: 'late',
            location: 'Outside Range',
        },
    ]);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isSessionActive, setIsSessionActive] = useState(false);

    const handleCourseChange = (courseId: string) => {
        setSelectedCourse(courseId);
        // Simulated sessions data - in real app, fetch from API
        setSessions([
            {
                id: 1,
                topic: 'Introduction to AI Concepts',
                date: '2024-03-15',
                time: '09:00',
                status: 'active',
            },
            {
                id: 2,
                topic: 'Machine Learning Basics',
                date: '2024-03-16',
                time: '10:00',
                status: 'inactive',
            },
        ]);
    };

    const handleSessionChange = (sessionId: string) => {
        setSelectedSession(sessionId);
        setIsSessionActive(
            sessions.find((s) => s.id.toString() === sessionId)?.status ===
                'active',
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present':
                return 'bg-green-500';
            case 'absent':
                return 'bg-red-500';
            case 'late':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className='p-4 md:p-8'>
            <PageHead title='Attendance Management | App' />
            <Breadcrumbs
                items={[
                    {title: 'Dashboard', link: '/app'},
                    {title: 'Attendance Management', link: '/app/attendance'},
                ]}
            />

            <div className='space-y-4'>
                <Card>
                    <CardHeader className='text-xl font-bold'>
                        Course Selection
                    </CardHeader>
                    <CardContent>
                        <div className='grid gap-4 md:grid-cols-2'>
                            <Select
                                onValueChange={handleCourseChange}
                                value={selectedCourse}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select a course' />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((course) => (
                                        <SelectItem
                                            key={course.id}
                                            value={course.id.toString()}
                                        >
                                            {course.course_code} - {course.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {selectedCourse && (
                                <Select
                                    onValueChange={handleSessionChange}
                                    value={selectedSession}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select a session' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sessions.map((session) => (
                                            <SelectItem
                                                key={session.id}
                                                value={session.id.toString()}
                                            >
                                                {session.topic} - {session.date}{' '}
                                                {session.time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {selectedSession && isSessionActive && (
                    <Card>
                        <CardHeader className='text-xl font-bold'>
                            Facial Recognition Attendance
                        </CardHeader>
                        <CardContent>
                            <Alert className='mb-4'>
                                <InfoIcon className='h-4 w-4' />
                                <AlertDescription>
                                    Start the camera to begin taking attendance
                                    using facial recognition. Make sure students
                                    face the camera clearly for accurate
                                    recognition.
                                </AlertDescription>
                            </Alert>
                            <div className='flex justify-center'>
                                <WebcamCapture
                                    isActive={isCameraActive}
                                    onToggle={setIsCameraActive}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {selectedSession && (
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <div className='text-xl font-bold'>
                                Attendance Records
                            </div>
                            {isSessionActive && (
                                <Badge
                                    variant='outline'
                                    className='bg-green-500 text-white'
                                >
                                    Active Session
                                </Badge>
                            )}
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Check-in Time</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Location</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendanceRecords.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>
                                                {record.studentId}
                                            </TableCell>
                                            <TableCell>
                                                {record.studentName}
                                            </TableCell>
                                            <TableCell>
                                                {record.checkInTime}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getStatusColor(
                                                        record.status,
                                                    )}
                                                >
                                                    {record.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {record.location}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
