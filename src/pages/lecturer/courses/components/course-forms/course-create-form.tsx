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
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {useToast} from '@/components/ui/use-toast';
import {useCourseContext} from '@/context/course-context';
import {courseApi} from '@/lib/api';
import {useAuth} from '@/context/auth-context';

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

const CourseCreateForm = ({modalClose}: {modalClose: () => void}) => {
    const {setCourses, setLoading, setError} = useCourseContext();
    const {user} = useAuth();
    const {toast} = useToast();

    const form = useForm<CourseFormSchemaType>({
        resolver: zodResolver(courseFormSchema),
        defaultValues: {
            course_code: '',
            name: '',
            semester: 1,
            academic_year: '',
            status: 'inactive',
            isEnrollmentOpen: false,
        },
    });

    const onSubmit = async (values: CourseFormSchemaType) => {
        try {
            setLoading(true);
            const courseData = {
                course_name: values.name,
                course_code: values.course_code.toUpperCase(),
                lecturer: user?._id,
                semester: values.semester.toString(),
                academic_year: values.academic_year,
                status: values.status,
                isEnrollmentOpen: values.isEnrollmentOpen,
            };

            const response = await courseApi.create(courseData);

            // Update courses state with the new course
            setCourses((prevCourses) => [...prevCourses, response.data]);

            toast({
                title: 'Success',
                description: 'Course created successfully',
            });

            form.reset(); // Reset form after successful submission
            modalClose();
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to create course';
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
                title={'Add New Course'}
                description={''}
                className='space-y-2 py-4 text-center'
            />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4'
                    autoComplete='off'
                >
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4'>
                        <FormField
                            control={form.control}
                            name='course_code'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-base font-semibold">Course Code</FormLabel>
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
                                    <FormLabel className="text-base font-semibold">Course Name</FormLabel>
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
                                    <FormLabel className="text-base font-semibold">Semester</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            min={1}
                                            max={3}
                                            placeholder='Enter semester (1-3)'
                                            value={field.value || ''}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value),
                                                )
                                            }
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
                                    <FormLabel className="text-base font-semibold">Academic Year</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center space-x-2 rounded-md border border-input bg-background px-3 shadow-inner drop-shadow-xl">
                                            <Input
                                                type="number"
                                                min={2000}
                                                max={2100}
                                                placeholder="Start year"
                                                value={field.value.split('/')[0] || ''}
                                                className="border-0 shadow-none px-1 py-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                onChange={(e) => {
                                                    const startYear = e.target.value;
                                                    const endYear = field.value.split('/')[1] || '';
                                                    if (startYear && endYear && parseInt(startYear) >= parseInt(endYear)) {
                                                        field.onChange(`${startYear}/${parseInt(startYear) + 1}`);
                                                    } else {
                                                        field.onChange(`${startYear}${endYear ? '/' + endYear : ''}`);
                                                    }
                                                }}
                                            />
                                            <span className="text-lg font-bold">/</span>
                                            <Input
                                                type="number"
                                                min={2000}
                                                max={2100}
                                                placeholder="End year"
                                                value={field.value.split('/')[1] || ''}
                                                className="border-0 shadow-none px-1 py-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                onChange={(e) => {
                                                    const startYear = field.value.split('/')[0] || '';
                                                    const endYear = e.target.value;
                                                    if (startYear && endYear && parseInt(startYear) >= parseInt(endYear)) {
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
                                    <FormLabel className="text-base font-semibold">Status</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="px-4 py-6 shadow-inner drop-shadow-xl">
                                                <SelectValue placeholder='Select status' />
                                            </SelectTrigger>
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
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='isEnrollmentOpen'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-base font-semibold">Enrollment Status</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(value === 'true')
                                            }
                                            value={field.value.toString()}
                                        >
                                            <SelectTrigger className="px-4 py-6 shadow-inner drop-shadow-xl">
                                                <SelectValue placeholder='Select enrollment status' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='true'>
                                                    Open
                                                </SelectItem>
                                                <SelectItem value='false'>
                                                    Closed
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex items-center justify-center gap-4'>
                        <Button
                            type='button'
                            variant='secondary'
                            className='rounded-full '
                            size='lg'
                            onClick={modalClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            className='rounded-full'
                            size='lg'
                        >
                            Create Course
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CourseCreateForm;
