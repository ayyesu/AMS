import React, { useState } from 'react';
import PageHead from '@/components/shared/page-head';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Course {
    id: string;
    code: string;
    name: string;
    lecturer: string;
    schedule: string;
    enrolled: boolean;
}

export default function StudentCourses() {
    const [searchText, setSearchText] = useState('');
    const [enrollModalVisible, setEnrollModalVisible] = useState(false);
    const { toast } = useToast();

    const dummyCourses: Course[] = [
        {
            id: '1',
            code: 'CSC101',
            name: 'Introduction to Computing',
            lecturer: 'Dr. Smith',
            schedule: 'Mon, Wed 10:00 AM',
            enrolled: true,
        },
        {
            id: '2',
            code: 'CSC202',
            name: 'Data Structures',
            lecturer: 'Prof. Johnson',
            schedule: 'Tue, Thu 2:00 PM',
            enrolled: false,
        },
        {
            id: '3',
            code: 'CSC303',
            name: 'Software Engineering',
            lecturer: 'Dr. Williams',
            schedule: 'Wed, Fri 11:00 AM',
            enrolled: false,
        },
    ];

    const filteredCourses = dummyCourses.filter(
        (course) =>
            course.name.toLowerCase().includes(searchText.toLowerCase()) ||
            course.code.toLowerCase().includes(searchText.toLowerCase()) ||
            course.lecturer.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleEnroll = (courseId: string) => {
        // Handle enrollment logic here
        toast({
            title: 'Course Enrolled',
            description: 'You have successfully enrolled in this course.',
        });
    };

    const handleUnenroll = (courseId: string) => {
        // Handle unenrollment logic here
        toast({
            title: 'Course Unenrolled',
            description: 'You have been unenrolled from this course.',
            variant: 'destructive',
        });
    };

    return (
        <>
            <PageHead title='Courses | Student' />
            <div className='max-h-screen flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-3xl font-bold tracking-tight'>Course Enrollment</h2>
                    <Button onClick={() => setEnrollModalVisible(true)}>
                        <Plus className='mr-2 h-4 w-4' />
                        Enroll in Course
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Available Courses</CardTitle>
                        <CardDescription>
                            View and manage your course enrollments
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='flex items-center py-4'>
                            <div className='relative flex-1 max-w-sm'>
                                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                                <Input
                                    placeholder='Search courses...'
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className='pl-8'
                                />
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course Code</TableHead>
                                    <TableHead>Course Name</TableHead>
                                    <TableHead>Lecturer</TableHead>
                                    <TableHead>Schedule</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCourses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell>{course.code}</TableCell>
                                        <TableCell>{course.name}</TableCell>
                                        <TableCell>{course.lecturer}</TableCell>
                                        <TableCell>{course.schedule}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={course.enrolled ? 'secondary' : 'outline'}
                                            >
                                                {course.enrolled ? 'Enrolled' : 'Not Enrolled'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant={course.enrolled ? 'destructive' : 'secondary'}
                                                size='sm'
                                                onClick={() =>
                                                    course.enrolled
                                                        ? handleUnenroll(course.id)
                                                        : handleEnroll(course.id)
                                                }
                                            >
                                                {course.enrolled ? 'Unenroll' : 'Enroll'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog open={enrollModalVisible} onOpenChange={setEnrollModalVisible}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Enroll in a New Course</DialogTitle>
                            <DialogDescription>
                                Enter the course code to enroll in a new course
                            </DialogDescription>
                        </DialogHeader>
                        <div className='grid gap-4 py-4'>
                            <div className='space-y-2'>
                                <Input
                                    id='courseCode'
                                    placeholder='Enter course code (e.g., CSC101)'
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant='outline' onClick={() => setEnrollModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                setEnrollModalVisible(false);
                                toast({
                                    title: 'Course Enrolled',
                                    description: 'You have successfully enrolled in this course.',
                                });
                            }}>
                                Enroll
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}
