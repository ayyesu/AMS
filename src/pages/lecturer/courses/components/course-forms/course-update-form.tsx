import {useEffect} from 'react';
import Heading from '@/components/shared/heading';
import {Button} from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {useToast} from '@/components/ui/use-toast';
import {useCourseContext} from '@/context/course-context';
import {courseApi} from '@/lib/api';

const courseFormSchema = z.object({
    course_code: z.string().min(1, {message: 'Course code is required'}),
    name: z.string().min(1, {message: 'Course name is required'}),
    semester: z.coerce
        .number()
        .int()
        .min(1, {message: 'Semester must be between 1 and 3'})
        .max(3, {message: 'Semester must be between 1 and 3'}),
    academic_year: z
        .string()
        .min(1, {message: 'Academic year is required'})
        .regex(/^\d{4}\/\d{4}$/, {
            message: 'Academic year must be in format YYYY/YYYY',
        }),
    status: z.enum(['active', 'inactive', 'completed'], {
        required_error: 'Status is required',
    }),
    isEnrollmentOpen: z.boolean({
        required_error: 'Enrollment status is required',
    }),
});

type CourseFormSchemaType = z.infer<typeof courseFormSchema>;

interface CourseUpdateFormProps {
    courseData: {
        _id: string;
        course_code: string;
        course_name: string;
        semester: string;
        academic_year: string;
        status: string;
        isEnrollmentOpen?: boolean;
    };
    modalClose: () => void;
}

export default function CourseUpdateForm({
    courseData,
    modalClose,
}: CourseUpdateFormProps) {
    const {setCourses, setLoading, setError} = useCourseContext();
    const {toast} = useToast();

    const form = useForm<CourseFormSchemaType>({
        resolver: zodResolver(courseFormSchema),
        defaultValues: {
            course_code: courseData.course_code,
            name: courseData.course_name,
            semester: parseInt(courseData.semester),
            academic_year: courseData.academic_year,
            status: courseData.status as 'active' | 'inactive' | 'completed',
            isEnrollmentOpen: courseData.isEnrollmentOpen ?? false,
        },
    });

    const onSubmit = async (values: CourseFormSchemaType) => {
        try {
            setLoading(true);
            const updateData = {
                course_name: values.name,
                course_code: values.course_code.toUpperCase(),
                semester: values.semester.toString(),
                academic_year: values.academic_year,
                status: values.status,
                isEnrollmentOpen: values.isEnrollmentOpen,
            };

            const response = await courseApi.update(courseData._id, updateData);

            setCourses((prevCourses) =>
                prevCourses.map((course) =>
                    course._id === courseData._id ? response.data : course,
                ),
            );

            toast({
                title: 'Success',
                description: 'Course updated successfully',
            });

            modalClose();
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to update course';
            setError(errorMessage);
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='px-2'>
            <Heading
                title={'Update Course'}
                description={''}
                className='space-y-2 py-4 text-center'
            />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4'
                    autoComplete='off'
                >
                    <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
                        <FormField
                            control={form.control}
                            name='course_code'
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter the course code'
                                            {...field}
                                            className='px-4 py-6 shadow-inner drop-shadow-xl'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='name'
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter the course name'
                                            {...field}
                                            className='px-4 py-6 shadow-inner drop-shadow-xl'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='semester'
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            min={1}
                                            max={3}
                                            placeholder='Enter semester (1-3)'
                                            {...field}
                                            className='px-4 py-6 shadow-inner drop-shadow-xl'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='academic_year'
                            render={({field}) => (
                                <FormItem className="space-y-2">
                                    <FormControl>
                                        <div className="flex items-center">
                                            <Input
                                                type="number"
                                                min={2000}
                                                max={2100}
                                                placeholder="Start year"
                                                value={field.value.split('/')[0] || ''}
                                                className="px-4 py-6 shadow-inner drop-shadow-xl"
                                                onChange={(e) => {
                                                    const startYear = e.target.value;
                                                    const endYear = field.value.split('/')[1] || '';
                                                    if (startYear && endYear && parseInt(startYear) >= parseInt(endYear)) {
                                                        // Automatically set end year to start year + 1 if invalid
                                                        field.onChange(`${startYear}/${parseInt(startYear) + 1}`);
                                                    } else {
                                                        field.onChange(`${startYear}${endYear ? '/' + endYear : ''}`);
                                                    }
                                                }}
                                            />
                                            <span className="mx-2 text-lg font-bold">/</span>
                                            <Input
                                                type="number"
                                                min={2000}
                                                max={2100}
                                                placeholder="End year"
                                                value={field.value.split('/')[1] || ''}
                                                className="px-4 py-6 shadow-inner drop-shadow-xl"
                                                onChange={(e) => {
                                                    const startYear = field.value.split('/')[0] || '';
                                                    const endYear = e.target.value;
                                                    if (startYear && endYear && parseInt(startYear) >= parseInt(endYear)) {
                                                        // Show error message but still allow typing
                                                        field.onChange(`${startYear}/${endYear}`);
                                                    } else {
                                                        field.onChange(`${startYear ? startYear + '/' : ''}${endYear}`);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    {field.value && field.value.includes('/') && 
                                     parseInt(field.value.split('/')[0]) >= parseInt(field.value.split('/')[1]) && (
                                        <p className="text-sm text-red-500">Start year must be less than end year</p>
                                    )}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='status'
                            render={({field}) => (
                                <FormItem>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select status' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value='active'>
                                                Active
                                            </SelectItem>
                                            <SelectItem value='inactive'>
                                                Inactive
                                            </SelectItem>
                                            <SelectItem value='completed'>
                                                Completed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='isEnrollmentOpen'
                            render={({field}) => (
                                <FormItem>
                                    <Select
                                        onValueChange={(value) =>
                                            field.onChange(value === 'true')
                                        }
                                        value={field.value.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select enrollment status' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value='true'>
                                                Open
                                            </SelectItem>
                                            <SelectItem value='false'>
                                                Closed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex justify-end space-x-2'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={modalClose}
                        >
                            Cancel
                        </Button>
                        <Button type='submit'>Update Course</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
