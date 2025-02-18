import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

// Sample data for attendance trends
const monthlyAttendanceData = [
    {month: 'Jan', present: 85, absent: 15, late: 10},
    {month: 'Feb', present: 82, absent: 12, late: 15},
    {month: 'Mar', present: 88, absent: 10, late: 8},
    {month: 'Apr', present: 85, absent: 14, late: 12},
    {month: 'May', present: 90, absent: 8, late: 7},
    {month: 'Jun', present: 87, absent: 11, late: 9},
];

// Sample data for facial recognition accuracy
const recognitionData = [
    {day: 'Mon', accuracy: 98},
    {day: 'Tue', accuracy: 97},
    {day: 'Wed', accuracy: 99},
    {day: 'Thu', accuracy: 96},
    {day: 'Fri', accuracy: 98},
];

// Sample data for attendance distribution
const distributionData = [
    {name: 'Present', value: 75},
    {name: 'Absent', value: 15},
    {name: 'Late', value: 10},
];

const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

export default function Analytics() {
    return (
        <div className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Attendance Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width='100%' height={300}>
                            <BarChart data={monthlyAttendanceData}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='month' />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey='present' fill='#10B981' />
                                <Bar dataKey='absent' fill='#EF4444' />
                                <Bar dataKey='late' fill='#F59E0B' />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Facial Recognition Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width='100%' height={300}>
                            <LineChart data={recognitionData}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='day' />
                                <YAxis domain={[90, 100]} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type='monotone'
                                    dataKey='accuracy'
                                    stroke='#2563EB'
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Attendance Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width='100%' height={300}>
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx='50%'
                                    cy='50%'
                                    labelLine={false}
                                    label={({name, percent}) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                    outerRadius={80}
                                    fill='#8884d8'
                                    dataKey='value'
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
