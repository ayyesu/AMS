import {ReactNode, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useToast} from '@/components/ui/use-toast';
import {authApi} from '@/lib/api';
import {SignInOrbit} from '@/pages/auth/signin/components/signinOrbit';

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
                const user = response?.data;

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
                // Clear auth state
                localStorage.clear();
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
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="relative w-[300px] h-[300px] flex items-center justify-center">
                    {/* AMS Logo in center */}
                    <div className="text-6xl font-bold text-gray-700 dark:text-gray-300">AMS</div>
                    {/* Spinner around the text */}
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                    <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin"></div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
