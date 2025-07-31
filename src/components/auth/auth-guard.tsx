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
                    {/* Fingerprint icon */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 text-red-500 animate-pulse">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M8 12.5A4 4 0 0 1 16 8.5"></path>
                            <path d="M12 16.5a4 4 0 1 0 0-8"></path>
                            <path d="M16 12.5A4 4 0 0 1 8 16.5"></path>
                            <path d="M12 8.5a4 4 0 1 0 0 8"></path>
                            <circle cx="12" cy="12.5" r="10"></circle>
                        </svg>
                    </div>

                    {/* Location icon */}
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 text-amber-700 animate-bounce">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                    </div>

                    {/* AMS Logo in center */}
                    <div className="text-6xl font-bold text-gray-700">AMS</div>

                    {/* Globe icon */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-teal-500 animate-spin-slow">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            <path d="M2 12h20"></path>
                        </svg>
                    </div>

                    {/* Circle outline */}
                    <div className="absolute inset-0 rounded-full border-2 border-gray-200 animate-pulse"></div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
