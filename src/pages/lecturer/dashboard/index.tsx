import { useEffect, useState } from 'react';
import PageHead from '@/components/shared/page-head';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import Overview from './components/overview';
import Analytics from './components/analytics';
import SystemStatus from './components/system-status';
import { dashboardApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';

// Import icon components
import { CoursesSvg } from '@/assets/svg/coursesSvg';
import { ActiveAttendanceSvg } from '@/assets/svg/activeAttendanceSvg';
import { TotalSessionsSvg } from '@/assets/svg/totalSessionsSvg';
import { FlaggedAttendanceSvg } from '@/assets/svg/flaggedAttendanceSvg';

export default function DashboardPage() {
    const [dashboardData, setDashboardData] = useState({
        totalCourses: 0,
        activeAttendance: 0,
        totalSessions: 0,
        flaggedSubmissions: 0,
    });
    console.log("dashboard data", dashboardData)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const data = await dashboardApi.getLecturerDashboard();
                setDashboardData(data.data);
            } catch (err: any) {
                console.error('Failed to fetch dashboard data:', err);
                setError(err.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <>
            <PageHead title='Dashboard | App' />
            <div className='h-full flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8'>
                <div className='flex items-center justify-between space-y-2'>
                    <h2 className='text-3xl font-bold tracking-tight'>
                        Hi, Welcome back 👋
                    </h2>
                </div>
                <Tabs defaultValue='overview' className='space-y-4'>
                    <TabsList>
                        <TabsTrigger value='overview'>Overview</TabsTrigger>
                        <TabsTrigger value='analytics'>Analytics</TabsTrigger>
                    </TabsList>
                    <TabsContent value='overview' className='space-y-4'>
                        {loading ? (
                            <div className='flex justify-center p-8'>
                                <Loader2 className='h-8 w-8 animate-spin text-primary' />
                            </div>
                        ) : error ? (
                            <Card>
                                <CardContent className='p-6'>
                                    <p className='text-center text-red-500'>{error}</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                                <Card>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='text-sm font-medium'>
                                            Total Courses
                                        </CardTitle>
                                        <CoursesSvg />
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-2xl font-bold'>{dashboardData.totalCourses}</div>
                                        <p className='text-xs text-muted-foreground'>
                                            Number of created courses
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='text-sm font-medium'>
                                            Active Attendance
                                        </CardTitle>
                                        <ActiveAttendanceSvg />
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-2xl font-bold'>
                                            {dashboardData.activeAttendance}
                                        </div>
                                        <p className='text-xs text-muted-foreground'>
                                            current active sessions
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='text-sm font-medium'>
                                            Total Sessions
                                        </CardTitle>
                                        <TotalSessionsSvg />
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-2xl font-bold'>{dashboardData.totalSessions}</div>
                                        <p className='text-xs text-muted-foreground'>
                                            includes active & inactive sessions
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                        <CardTitle className='text-sm font-medium'>
                                            Flagged Attendance
                                        </CardTitle>
                                        <FlaggedAttendanceSvg />
                                    </CardHeader>
                                    <CardContent>
                                        <div className='text-2xl font-bold'>{dashboardData.flaggedSubmissions}</div>
                                        <p className='text-xs text-muted-foreground'>
                                            requires your attention
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                            <Card className='col-span-4'>
                                <CardHeader>
                                    <CardTitle>Overview</CardTitle>
                                </CardHeader>
                                <CardContent className='pl-2'>
                                    <Overview />
                                </CardContent>
                            </Card>
                            <Card className='col-span-3'>
                                <CardHeader>
                                    <CardTitle>System Status</CardTitle>
                                    <CardDescription>
                                        All services operational
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <SystemStatus />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value='analytics' className='space-y-4'>
                        <Analytics />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
