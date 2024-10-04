import Heading from '@/components/shared/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRouter } from '@/routes/hooks';
import { ChevronLeftIcon, ShareIcon, CameraIcon, SearchIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import StudentFeedTable from './components/course-feed-table';
import { useGetCourses } from './queries/queries';
import { useState } from 'react';

export default function CourseDetailPage() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [cameraStarted, setCameraStarted] = useState(false);

  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 10);
  const country = searchParams.get('search') || null;
  const offset = (page - 1) * pageLimit;
  const { data, isLoading } = useGetCourses(offset, pageLimit, country);
  const users = data?.users;
  const totalUsers = data?.total_users;
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const router = useRouter();

  const startCamera = () => {
    setCameraStarted(true);
    // Logic for starting facial recognition can be added here
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <h1>Loading!!!</h1>
      </div>
    )
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <Heading title={'Course Attendance Details'} />
        <div className="flex justify-end gap-3">
          <Button onClick={startCamera}>
            <CameraIcon className="h-4 w-4" />
            {cameraStarted ? "Camera On" : "Start Camera"}
          </Button>
          <Button>
            <ShareIcon className="h-4 w-4" />
            Share
          </Button>
          <Button onClick={() => router.back()}>
            <ChevronLeftIcon className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 py-6 lg:grid-cols-4">
        <div className="col-span-1 flex flex-col gap-6 lg:col-span-1">
          <Card className="bg-secondary shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between font-bold">
              <p className="text-xl">Course Profile</p>
              <Badge className="bg-green-600">Ongoing</Badge>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <p className="text-center text-lg font-semibold">Course Name: Introduction to AI</p>
              <p className="text-center text-lg">Course Code: AI101</p>
              <p className="text-center text-lg">Semester: Fall 2024</p>
            </CardContent>
          </Card>
        </div>

        {/* Students Attendance Information */}
        <Card className="col-span-1 bg-secondary shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm lg:col-span-3">
          <CardHeader className="text-xl font-bold">Marked Attendance</CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 pb-4">
              <input
                type="text"
                placeholder="Search marked students"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
              <Button>
                <SearchIcon className="h-4 w-4" />
                Search
              </Button>
            </div>

            {/* <StudentFeedTable
              users={users?.filter((user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              page={page}
              totalUsers={totalUsers}
              pageCount={pageCount}
            /> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
