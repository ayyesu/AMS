import {Button} from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {useNavigate} from 'react-router-dom';
import {zodResolver} from '@hookform/resolvers/zod';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {authApi} from '@/lib/api';
import {useToast} from '@/components/ui/use-toast';
import {useAuth} from '@/context/auth-context';

const formSchema = z.object({
    id: z.string().regex(/^\d{8}$/, {message: 'Id must be exactly 8 numbers'}),
    pin: z
        .string()
        .regex(/^\d{5}$/, {message: 'Pin must be exactly 5 numbers'}),
    role: z.enum(['student', 'lecturer']),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
    const navigate = useNavigate();
    const {toast} = useToast();
    const [loading, setLoading] = useState(false);
    const {setIsAuthenticated, setUserRole, setUser} = useAuth();

    const form = useForm<UserFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: '',
            pin: '',
            role: 'lecturer',
        },
    });

    const onSubmit = async (data: UserFormValue) => {
        try {
            setLoading(true);

            const response = await authApi.login(data.id, data.pin);

            console.log('response', response);

            const user = response.data;

            if (user?.data.role != data.role) {
                toast({
                    title: 'Error',
                    description: 'Access Denied!!',
                    variant: 'destructive',
                    duration: 3000,
                });
                return;
            }

            // Set authentication state
            setIsAuthenticated(true);
            setUserRole(user.data.role);
            setUser(user.data);

            // Route based on role
            if (user?.data.role === 'student') {
                toast({
                    title: 'Access Denied!!',
                    description: 'Restricted access to this portal',
                    variant: 'destructive',
                });
            } else {
                navigate('/app');
            }

            toast({
                title: 'Success',
                description: 'Successfully logged in',
            });
        } catch (error: any) {
            console.error('Login error:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='w-full space-y-4'
                >
                    <FormField
                        control={form.control}
                        name='id'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>ID</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Enter your ID'
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter your Staff ID
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='pin'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>PIN</FormLabel>
                                <FormControl>
                                    <Input
                                        type='password'
                                        placeholder='Enter your PIN'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type='submit' className='w-full' disabled={loading}>
                        {loading ? 'Logging in...' : 'Sign In'}
                    </Button>
                </form>
            </Form>
        </>
    );
}
