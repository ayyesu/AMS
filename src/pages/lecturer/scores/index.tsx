import React, {useState, useEffect} from 'react';
import PageHead from '@/components/shared/page-head';
import {Breadcrumbs} from '@/components/shared/breadcrumbs';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {Input} from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {AlertCircle, Loader2, Search, Download} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {useCourseContext} from '@/context/course-context';
import {attendanceApi} from '@/lib/api';
import {CourseAttendanceScores} from '@/types/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Add this type augmentation for jsPDF
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

export default function AttendanceScoresPage() {
    // States
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [attendanceScores, setAttendanceScores] =
        useState<CourseAttendanceScores | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Get courses from context
    const {
        courses,
        fetchCourses,
        loading: coursesLoading,
        error: coursesError,
    } = useCourseContext();

    // Fetch courses on component mount
    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    // Fetch attendance scores when a course is selected
    const handleCourseChange = async (courseId: string) => {
        setSelectedCourseId(courseId);
        setAttendanceScores(null);
        setError(null);

        if (!courseId) return;

        setLoading(true);
        try {
            const response =
                await attendanceApi.getCourseAttendanceScores(courseId);
            setAttendanceScores(response.data);
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Failed to fetch attendance scores';
            setError(errorMessage);
            console.error('Fetch Attendance Scores Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filter students based on search query
    const filteredStudents =
        attendanceScores?.studentScores.filter((student) => {
            if (!searchQuery) return true;

            const query = searchQuery.toLowerCase();
            return (
                student.fullName.toLowerCase().includes(query) ||
                student.userIdentifier.toLowerCase().includes(query) ||
                student.email.toLowerCase().includes(query)
            );
        }) || [];

    // Export functions
    const exportToExcel = () => {
        if (!attendanceScores) return;

        const exportData = filteredStudents.map((student) => ({
            'Student ID': student.userIdentifier,
            Name: student.fullName,
            Email: student.email,
            'Sessions Attended': `${student.attendedSessions} / ${attendanceScores.totalSessions}`,
            'Attendance Rate': `${Math.round((student.attendedSessions / attendanceScores.totalSessions) * 100)}%`,
            'Average Score': student.averageScore,
            'Total Score': student.totalScore,
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance Scores');

        // Get course name for filename
        const course = courses.find((c) => c._id === selectedCourseId);
        const filename = `attendance_scores_${course?.course_code || selectedCourseId}.xlsx`;

        XLSX.writeFile(wb, filename);
    };

    const exportToCSV = () => {
        if (!attendanceScores) return;

        const exportData = filteredStudents.map((student) => ({
            'Student ID': student.userIdentifier,
            Name: student.fullName,
            Email: student.email,
            'Sessions Attended': `${student.attendedSessions} / ${attendanceScores.totalSessions}`,
            'Attendance Rate': `${Math.round((student.attendedSessions / attendanceScores.totalSessions) * 100)}%`,
            'Average Score': student.averageScore,
            'Total Score': student.totalScore,
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const csv = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});

        // Get course name for filename
        const course = courses.find((c) => c._id === selectedCourseId);
        const filename = `attendance_scores_${course?.course_code || selectedCourseId}.csv`;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    const exportToPDF = () => {
        if (!attendanceScores) return;

        const doc = new jsPDF();

        // Get course details for header
        const course = courses.find((c) => c._id === selectedCourseId);

        // Add title and course info
        doc.text('Attendance Scores Report', 14, 15);

        if (course) {
            doc.text(
                `Course: ${course.course_name} (${course.course_code})`,
                14,
                22,
            );
            doc.text(
                `Total Sessions: ${attendanceScores.totalSessions}`,
                14,
                29,
            );
        }

        // Table columns and rows
        const tableColumn = [
            'Student ID',
            'Name',
            'Sessions Attended',
            'Attendance Rate',
            'Average Score',
        ];

        const tableRows = filteredStudents.map((student) => [
            student.userIdentifier,
            student.fullName,
            `${student.attendedSessions} / ${attendanceScores.totalSessions}`,
            `${Math.round((student.attendedSessions / attendanceScores.totalSessions) * 100)}%`,
            student.averageScore.toString(),
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 35,
        });

        // Get course name for filename
        const filename = `attendance_scores_${course?.course_code || selectedCourseId}.pdf`;
        doc.save(filename);
    };

    const getAttendanceRateColor = (
        attendedSessions: number,
        totalSessions: number,
    ) => {
        const rate = totalSessions > 0 ? attendedSessions / totalSessions : 0;

        if (rate >= 0.8) return 'bg-green-500 hover:bg-green-600 text-white';
        if (rate >= 0.6) return 'bg-yellow-500 hover:bg-yellow-600 text-black';
        return 'bg-red-500 hover:bg-red-600 text-white';
    };

    return (
        <div className='h-full flex-1 space-y-4 overflow-y-auto p-4 md:p-8'>
            <PageHead title='Attendance Scores | App' />
            <Breadcrumbs
                items={[
                    {title: 'Dashboard', link: '/app'},
                    {title: 'Attendance Scores', link: '/app/scores'},
                ]}
            />

            {/* Display Course Fetching Errors */}
            {coursesError && (
                <Alert variant='destructive'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertTitle>Error Fetching Courses</AlertTitle>
                    <AlertDescription>{coursesError}</AlertDescription>
                </Alert>
            )}

            <div className='space-y-4'>
                <Card>
                    <CardHeader className='text-xl font-bold'>
                        Course Selection
                    </CardHeader>
                    <CardContent>
                        <Select
                            onValueChange={handleCourseChange}
                            value={selectedCourseId}
                            disabled={coursesLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select a course' />
                            </SelectTrigger>
                            <SelectContent>
                                {coursesLoading && (
                                    <div className='flex items-center justify-center p-2'>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Loading Courses...
                                    </div>
                                )}
                                {!coursesLoading && courses.length === 0 && (
                                    <div className='p-2 text-center text-sm text-muted-foreground'>
                                        No courses found.
                                    </div>
                                )}
                                {courses.map((course) => (
                                    <SelectItem
                                        key={course._id}
                                        value={course._id}
                                    >
                                        {course.course_code} -{' '}
                                        {course.course_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {selectedCourseId && (
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <div className='text-xl font-bold'>
                                Attendance Scores
                            </div>

                            {attendanceScores && (
                                <div>
                                    <Badge className='bg-blue-500 text-white'>
                                        Total Sessions:{' '}
                                        {attendanceScores.totalSessions}
                                    </Badge>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            {/* Display errors */}
                            {error && !loading && (
                                <Alert variant='destructive' className='mb-4'>
                                    <AlertCircle className='h-4 w-4' />
                                    <AlertTitle>
                                        Error Loading Attendance Scores
                                    </AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Loading indicator */}
                            {loading && (
                                <div className='flex items-center justify-center p-8'>
                                    <Loader2 className='mr-2 h-6 w-6 animate-spin' />
                                    Loading Attendance Scores...
                                </div>
                            )}

                            {!loading && attendanceScores && (
                                <>
                                    <div className='flex justify-between items-center mb-4'>
                                        {/* Search box */}
                                        <div className='relative w-72'>
                                            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                                            <Input
                                                placeholder='Search by name or ID...'
                                                className='pl-8'
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        {/* Export buttons */}
                                        <div className='flex gap-2'>
                                            <Button
                                                size='sm'
                                                onClick={exportToExcel}
                                                className='flex items-center gap-2'
                                            >
                                                <Download className='h-4 w-4' />
                                                Excel
                                            </Button>
                                            <Button
                                                size='sm'
                                                onClick={exportToCSV}
                                                className='flex items-center gap-2'
                                            >
                                                <Download className='h-4 w-4' />
                                                CSV
                                            </Button>
                                            <Button
                                                size='sm'
                                                onClick={exportToPDF}
                                                className='flex items-center gap-2'
                                            >
                                                <Download className='h-4 w-4' />
                                                PDF
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    Student ID
                                                </TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>
                                                    Sessions Attended
                                                </TableHead>
                                                <TableHead>
                                                    Attendance Rate
                                                </TableHead>
                                                <TableHead>
                                                    Average Score
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredStudents.length === 0 ? (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={5}
                                                        className='text-center'
                                                    >
                                                        {searchQuery
                                                            ? 'No students match your search criteria.'
                                                            : 'No students found in this course.'}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredStudents.map(
                                                    (student) => (
                                                        <TableRow
                                                            key={
                                                                student.studentId
                                                            }
                                                        >
                                                            <TableCell>
                                                                {
                                                                    student.userIdentifier
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className='font-medium'>
                                                                    {
                                                                        student.fullName
                                                                    }
                                                                </div>
                                                                <div className='text-sm text-muted-foreground'>
                                                                    {
                                                                        student.email
                                                                    }
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    student.attendedSessions
                                                                }{' '}
                                                                /{' '}
                                                                {
                                                                    attendanceScores.totalSessions
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    className={getAttendanceRateColor(
                                                                        student.attendedSessions,
                                                                        attendanceScores.totalSessions,
                                                                    )}
                                                                >
                                                                    {Math.round(
                                                                        (student.attendedSessions /
                                                                            attendanceScores.totalSessions) *
                                                                            100,
                                                                    )}
                                                                    %
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    student.averageScore
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
