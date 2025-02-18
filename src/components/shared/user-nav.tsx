import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {authApi} from '@/lib/api';
import {useNavigate} from 'react-router-dom';
import {toast} from '../ui/use-toast';
import {useAuth} from '@/context/auth-context';
import {useImage} from '@/context/image-context';

export default function UserNav() {
    const navigate = useNavigate();
    const {user, logout} = useAuth();
    const {imageData} = useImage();

    const handleLogout = async () => {
        try {
            await authApi.logout();
            logout();
            navigate('/login');
            toast({
                title: 'Success',
                description: 'Successfully logged out',
            });
        } catch (error: any) {
            console.error('Logout error:', error);
            toast({
                title: 'Error',
                description:
                    error.message || 'Failed to log out. Please try again.',
                variant: 'destructive',
            });
        }
    };

    // Get User Initials
    const getInitials = (fullName: any) => {
        if (!fullName) return '';
        return fullName
            .split(' ')
            .map((name: any) => name[0])
            .join('');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    className='relative h-10 w-10 rounded-full'
                >
                    <Avatar className='h-10 w-10'>
                        {user && imageData?.image_path ? (
                            <AvatarImage
                                src={imageData.image_path}
                                alt='User avatar'
                            />
                        ) : (
                            <AvatarFallback>
                                {getInitials(user?.fullName)}
                            </AvatarFallback>
                        )}
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-medium leading-none'>
                            {user?.fullName}
                        </p>
                        <p className='text-xs leading-none text-muted-foreground'>
                            {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => navigate(`profile/${user?._id}`)}
                    >
                        Profile
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className='font-normal'>
                    <p
                        onClick={handleLogout}
                        aria-label='Logout'
                        className='text-red-500 cursor-pointer hover:text-red-700'
                    >
                        Logout
                    </p>
                </DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
