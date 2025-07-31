import PageHead from '@/components/shared/page-head.jsx';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs.js';
import SystemStatus from './components/system-status.js';
import {CoursesSvg} from '@/assets/svg/coursesSvg.js';
import {ActiveAttendanceSvg} from '@/assets/svg/activeAttendanceSvg.js';
import {TotalSessionsSvg} from '@/assets/svg/totalSessionsSvg.js';
import {FlaggedAttendanceSvg} from '@/assets/svg/flaggedAttendanceSvg.js';
import Analytics from './components/analytics/index.js';
import Overview from './components/overview.js';

export default function DashboardPage() {
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
                        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                            <Card>
                                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                    <CardTitle className='text-sm font-medium'>
                                        Total Courses
                                    </CardTitle>
                                    <CoursesSvg />
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>20</div>
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
                                        150
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
                                    <div className='text-2xl font-bold'>15</div>
                                    <p className='text-xs text-muted-foreground'>
                                        includes active & inactive sessions
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                    <CardTitle className='text-sm font-medium'>
                                        Flagged Submissions
                                    </CardTitle>
                                    <FlaggedAttendanceSvg />
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>
                                        +573
                                    </div>
                                    <p className='text-xs text-muted-foreground'>
                                        flagged attendance for active session
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
                            <Card className='col-span-4'>
                                <CardHeader>
                                    <CardTitle>Overview</CardTitle>
                                </CardHeader>
                                <CardContent className='pl-2 overflow-y-auto'>
                                    <Overview />
                                </CardContent>
                            </Card>
                            <Card className='col-span-4 md:col-span-3'>
                                <CardHeader>
                                    <CardTitle>System Status</CardTitle>
                                    <CardDescription>
                                        System updates and funtion details.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <SystemStatus />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value='analytics'>
                        <Analytics />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
