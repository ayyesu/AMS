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
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Camera } from 'lucide-react';
import Webcam from 'react-webcam';

interface AttendanceRecord {
  id: string;
  courseCode: string;
  courseName: string;
  date: string;
  status: 'present' | 'absent';
  time: string;
}

export default function StudentAttendance() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = React.useRef<Webcam>(null);

  const dummyAttendance: AttendanceRecord[] = [
    {
      id: '1',
      courseCode: 'CSC101',
      courseName: 'Introduction to Computing',
      date: '2024-01-31',
      status: 'present',
      time: '10:00 AM',
    },
    {
      id: '2',
      courseCode: 'CSC102',
      courseName: 'Programming Fundamentals',
      date: '2024-01-31',
      status: 'absent',
      time: '2:00 PM',
    },
  ];

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      // Handle the captured image
      console.log(imageSrc);
      setIsCameraOpen(false);
    }
  };

  return (
    <>
      <PageHead title='Attendance | Student' />
      <div className='max-h-screen flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8'>
        <div className='flex items-center justify-between'>
          <h2 className='text-3xl font-bold tracking-tight'>Attendance</h2>
          <Button onClick={() => setIsCameraOpen(true)}>
            <Camera className='mr-2 h-4 w-4' />
            Mark Attendance
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>
              View your attendance records for all courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.courseCode}</TableCell>
                    <TableCell>{record.courseName}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.time}</TableCell>
                    <TableCell>
                      <Badge
                        variant={record.status === 'present' ? 'secondary' : 'destructive'}
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
            <DialogDescription>
              Please ensure you are in a well-lit area and your face is clearly visible
            </DialogDescription>
          </DialogHeader>
          <div className='mt-4'>
            <Webcam
              ref={webcamRef}
              screenshotFormat='image/jpeg'
              className='rounded-lg'
            />
            <div className='mt-4 flex justify-end space-x-2'>
              <Button variant='outline' onClick={() => setIsCameraOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCapture}>Capture</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
