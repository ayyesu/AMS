import { lecturerNavItems, studentNavItems } from '@/constants/data';
import {usePathname} from '@/routes/hooks';
import Heading from './heading';
import UserNav from './user-nav';
import {ModeToggle} from './theme-toggle';

// Custom hook to find the matched path
const useMatchedPath = (pathname: string, isStudent: boolean = false) => {
    const items = isStudent ? studentNavItems : lecturerNavItems;
    const matchedPath =
        items.find((item) => item.href === pathname) ||
        items.find(
            (item) =>
                pathname.startsWith(item.href + '/app') && item.href !== '/app',
        );
    return matchedPath?.title || '';
};

export default function Header({ isStudent = false }: { isStudent?: boolean }) {
    const pathname = usePathname();
    const headingText = useMatchedPath(pathname, isStudent);

    return (
        <header className='sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6'>
            <div className='flex items-center gap-2'>
                <Heading title={headingText} />
            </div>

            <div className='ml-auto flex items-center gap-4'>
                <div className='hidden md:flex md:items-center md:gap-4'>
                    <ModeToggle />
                    <UserNav />
                </div>
                <div className='flex md:hidden'>
                    <ModeToggle />
                    <UserNav />
                </div>
            </div>
        </header>
    );
}
