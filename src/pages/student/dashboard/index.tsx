import PageHead from '@/components/shared/page-head';
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
} from '@/components/ui/tabs';
import { BookOpen, CheckCircle, Clock, Calendar } from 'lucide-react';

export default function StudentDashboard() {
    return (
        <>
            <PageHead title='Student Dashboard | App' />
            <div className='max-h-screen flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8'>
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
                                        Enrolled Courses
                                    </CardTitle>
                                    <BookOpen className='h-4 w-4 text-muted-foreground' />
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>5</div>
                                    <p className='text-xs text-muted-foreground'>
                                        Active courses this semester
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                    <CardTitle className='text-sm font-medium'>
                                        Attendance Rate
                                    </CardTitle>
                                    <CheckCircle className='h-4 w-4 text-muted-foreground' />
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>85%</div>
                                    <p className='text-xs text-muted-foreground'>
                                        Overall attendance
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                    <CardTitle className='text-sm font-medium'>
                                        Upcoming Sessions
                                    </CardTitle>
                                    <Clock className='h-4 w-4 text-muted-foreground' />
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>3</div>
                                    <p className='text-xs text-muted-foreground'>
                                        Sessions this week
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                    <CardTitle className='text-sm font-medium'>
                                        Total Sessions
                                    </CardTitle>
                                    <Calendar className='h-4 w-4 text-muted-foreground' />
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold'>24</div>
                                    <p className='text-xs text-muted-foreground'>
                                        Sessions this semester
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                            <Card className='col-span-4'>
                                <CardHeader>
                                    <CardTitle>Recent Attendance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* Add attendance history component here */}
                                </CardContent>
                            </Card>
                            <Card className='col-span-3'>
                                <CardHeader>
                                    <CardTitle>Upcoming Classes</CardTitle>
                                    <CardDescription>
                                        Your schedule for the next few days
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {/* Add upcoming classes component here */}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value='analytics' className='space-y-4'>
                        {/* Add analytics content here */}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
