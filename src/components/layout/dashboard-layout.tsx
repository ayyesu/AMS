import {useState} from 'react';
import Sidebar from '../shared/sidebar';
import Header from '../shared/header';
import MobileSidebar from '../shared/mobile-sidebar';
import {MenuIcon} from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const location = useLocation();
    const isStudent = location.pathname.startsWith('/student');

    return (
        <div className='flex h-screen overflow-hidden bg-secondary'>
            <MobileSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isStudent={isStudent}
            />
            <Sidebar isStudent={isStudent} />
            <div className='flex w-0 flex-1 flex-col overflow-hidden'>
                <div className='xl:hidden'>
                    <button
                        className='pl-4 pt-2 text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary'
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className='sr-only'>Open sidebar</span>
                        <MenuIcon className='h-6 w-6' aria-hidden='true' />
                    </button>
                </div>
                <Header />
                <main className='relative mx-2 my-3 mr-2 flex-1 overflow-hidden rounded-xl  bg-background focus:outline-none md:mx-0 md:my-4 md:mr-4 '>
                    {children}
                </main>
            </div>
        </div>
    );
}
