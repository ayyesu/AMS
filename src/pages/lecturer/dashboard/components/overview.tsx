import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

export default function Overview() {
    return (
        <div className='space-y-6'>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Welcome to the Attendance Management System (AMS)
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <section>
                        <h3 className='font-semibold mb-2'>Key Features</h3>
                        <ul className='list-disc pl-5 space-y-1'>
                            <li>
                                Real-time attendance tracking for lectures and
                                tutorials
                            </li>
                            <li>Automated attendance reports generation</li>
                            <li>Student attendance history and analytics</li>
                            <li>Course management and scheduling</li>
                            <li>Multi-device support for taking attendance</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className='font-semibold mb-2'>How to Use</h3>
                        <ul className='list-decimal pl-5 space-y-1'>
                            <li>
                                Create or select a course from your dashboard
                            </li>
                            <li>
                                Start a new attendance session for your class
                            </li>
                            <li>Share the attendance code with students</li>
                            <li>Monitor attendance in real-time</li>
                            <li>
                                Generate and export attendance reports as needed
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h3 className='font-semibold mb-2'>Quick Tips</h3>
                        <ul className='list-disc pl-5 space-y-1'>
                            <li>
                                Use the search function to quickly find specific
                                students or courses
                            </li>
                            <li>
                                Set up recurring sessions for regular classes
                            </li>
                            <li>
                                Enable notifications to stay updated on
                                attendance submissions
                            </li>
                            <li>
                                Export reports in multiple formats (PDF, CSV,
                                Excel)
                            </li>
                        </ul>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
