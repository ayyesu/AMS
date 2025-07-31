import { useState, useEffect } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

export default function Analytics() {
    const [monthlyAttendanceData, setMonthlyAttendanceData] = useState<any[]>([]);
    const [recognitionData, setRecognitionData] = useState<any[]>([]);
    const [distributionData, setDistributionData] = useState<any[]>([]);
    
    const [monthlyLoading, setMonthlyLoading] = useState(true);
    const [recognitionLoading, setRecognitionLoading] = useState(true);
    const [distributionLoading, setDistributionLoading] = useState(true);
    
    const [monthlyError, setMonthlyError] = useState<string | null>(null);
    const [recognitionError, setRecognitionError] = useState<string | null>(null);
    const [distributionError, setDistributionError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch monthly attendance data
        const fetchMonthlyData = async () => {
            try {
                const response = await dashboardApi.getMonthlyAttendance();
                const data = response.data;
                
                // Transform the data into the format expected by the chart
                if (data && data.months && data.present && data.absent && data.late) {
                    const transformedData = data.months.map((month: string, index: number) => ({
                        month,
                        present: data.present[index] || 0,
                        absent: data.absent[index] || 0,
                        late: data.late[index] || 0
                    }));
                    setMonthlyAttendanceData(transformedData);
                } else {
                    setMonthlyAttendanceData([]);
                }
                
                setMonthlyLoading(false);
            } catch (error: any) {
                console.error('Error fetching monthly attendance data:', error);
                setMonthlyError(error.message || 'Failed to load data');
                setMonthlyLoading(false);
            }
        };

        // Fetch facial recognition accuracy data
        const fetchRecognitionData = async () => {
            try {
                const response = await dashboardApi.getFacialRecognitionAccuracy();
                const data = response.data;
                
                // Transform the data into the format expected by the chart
                if (data && data.days && data.accuracy) {
                    const transformedData = data.days.map((day: string, index: number) => ({
                        day,
                        accuracy: data.accuracy[index] || 0
                    }));
                    setRecognitionData(transformedData);
                } else {
                    setRecognitionData([]);
                }
                
                setRecognitionLoading(false);
            } catch (error: any) {
                console.error('Error fetching facial recognition data:', error);
                setRecognitionError(error.message || 'Failed to load data');
                setRecognitionLoading(false);
            }
        };

        // Fetch attendance distribution data
        const fetchDistributionData = async () => {
            try {
                const response = await dashboardApi.getAttendanceDistribution();
                
                // Transform the object format into array format for the pie chart
                if (response && response.data && typeof response.data === 'object') {
                    const data = response.data;
                    
                    // Create array from the object properties
                    const transformedData = [
                        { name: 'Present', value: data.present || 0 },
                        { name: 'Absent', value: data.absent || 0 },
                        { name: 'Late', value: data.late || 0 }
                    ];
                    
                    setDistributionData(transformedData);
                } else {
                    // Default empty state for distribution chart
                    setDistributionData([
                        { name: 'Present', value: 0 },
                        { name: 'Absent', value: 0 },
                        { name: 'Late', value: 0 }
                    ]);
                }
                setDistributionLoading(false);
            } catch (error: any) {
                console.error('Error fetching attendance distribution data:', error);
                setDistributionError(error.message || 'Failed to load data');
                setDistributionLoading(false);
            }
        };

        fetchMonthlyData();
        fetchRecognitionData();
        fetchDistributionData();
    }, []);

    // Helper function to render loading or error state
    const renderLoading = () => (
        <div className="flex justify-center items-center h-[300px]">
            <Skeleton className="w-full h-[250px]" />
        </div>
    );

    const renderError = (message: string) => (
        <div className="flex justify-center items-center h-[300px] text-red-500">
            Error: {message}
        </div>
    );

    // Check if distributionData is an array before mapping
    const renderPieChart = () => {
        if (!Array.isArray(distributionData) || distributionData.length === 0) {
            return (
                <div className="flex justify-center items-center h-[300px] text-gray-500">
                    No data available
                </div>
            );
        }

        // Create a custom label renderer for the pie chart
        const renderCustomizedLabel = ({ 
            cx, 
            cy, 
            midAngle, 
            innerRadius, 
            outerRadius, 
            percent, 
            index, 
            name 
        }: {
            cx: number;
            cy: number;
            midAngle: number;
            innerRadius: number;
            outerRadius: number;
            percent: number;
            index: number;
            name: string;
        }) => {
            const RADIAN = Math.PI / 180;
            // Position the label outside the pie
            const radius = outerRadius * 1.2;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            
            // Don't show labels for segments with 0%
            if (percent === 0) return null;

            return (
                <text 
                    x={x} 
                    y={y} 
                    fill={COLORS[index % COLORS.length]} 
                    textAnchor={x > cx ? 'start' : 'end'} 
                    dominantBaseline="central"
                    fontSize="12"
                    fontWeight="500"
                >
                    {name} {(percent * 100).toFixed(0)}%
                </text>
            );
        };

        return (
            <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                    <Pie
                        data={distributionData}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={90}
                        fill='#8884d8'
                        dataKey='value'
                        paddingAngle={2}
                    >
                        {distributionData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                strokeWidth={entry.value > 0 ? 2 : 0}
                            />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}`, name]} />
                    <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        iconType="circle"
                    />
                </PieChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Attendance Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {monthlyLoading ? (
                            renderLoading()
                        ) : monthlyError ? (
                            renderError(monthlyError)
                        ) : (
                            <ResponsiveContainer width='100%' height={300}>
                                <BarChart data={monthlyAttendanceData}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis dataKey='month' />
                                    <YAxis 
                                        width={50}
                                        tickCount={5}
                                        allowDecimals={false}
                                        scale="auto"
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey='present' fill='#10B981' />
                                    <Bar dataKey='absent' fill='#EF4444' />
                                    <Bar dataKey='late' fill='#F59E0B' />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Facial Recognition Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recognitionLoading ? (
                            renderLoading()
                        ) : recognitionError ? (
                            renderError(recognitionError)
                        ) : (
                            <ResponsiveContainer width='100%' height={300}>
                                <LineChart data={recognitionData}>
                                    <CartesianGrid strokeDasharray='3 3' />
                                    <XAxis dataKey='day' />
                                    <YAxis 
                                        domain={[90, 100]} 
                                        width={50}
                                        tickCount={5}
                                        allowDecimals={false}
                                        scale="auto"
                                    />
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
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Attendance Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {distributionLoading ? (
                            renderLoading()
                        ) : distributionError ? (
                            renderError(distributionError)
                        ) : (
                            renderPieChart()
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
