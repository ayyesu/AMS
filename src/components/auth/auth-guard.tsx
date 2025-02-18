import {ReactNode, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useToast} from '@/components/ui/use-toast';
import {authApi} from '@/lib/api';

interface AuthGuardProps {
    children: ReactNode;
    allowedRoles?: ('student' | 'lecturer' | 'admin')[];
}

export default function AuthGuard({children, allowedRoles}: AuthGuardProps) {
    const navigate = useNavigate();
    const {toast} = useToast();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await authApi.authCheck();
                const user = response.data;

                if (!user) {
                    throw new Error('Unauthorized');
                }

                if (allowedRoles && !allowedRoles.includes(user.role)) {
                    toast({
                        title: 'Access Denied',
                        description:
                            'You do not have permission to access this page.',
                        variant: 'destructive',
                    });

                    navigate(user.role === 'student' ? '/student' : '/app');
                    return;
                }
            } catch (error) {
                console.error('Auth check error:', error);
                toast({
                    title: 'Authentication Required',
                    description: 'Please sign in to continue.',
                    variant: 'destructive',
                });
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [navigate, allowedRoles, toast]);

    if (isLoading) {
        return <div>Loading...</div>; // Optional: Add a spinner here
    }

    return <>{children}</>;
}
