import {AlertModal} from '@/components/shared/alert-modal';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Edit, MoreHorizontal, Trash} from 'lucide-react';
import {useState} from 'react';
import {useToast} from '@/components/ui/use-toast';
import {courseApi} from '@/lib/api';
import {useCourseContext} from '@/context/course-context';
import PopupModal from '@/components/shared/popup-modal';
import CourseUpdateForm from '../course-forms/course-update-form';

interface CellActionProps {
    data: {
        _id: string;
        course_code: string;
        course_name: string;
        semester: string;
        academic_year: string;
        status: string;
    };
}

export const CellAction = ({data}: CellActionProps) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const {toast} = useToast();
    const {setCourses} = useCourseContext();

    const onConfirm = async () => {
        try {
            setLoading(true);
            await courseApi.delete(data._id);

            setCourses((prevCourses) =>
                prevCourses.filter((course) => course._id !== data._id),
            );

            toast({
                title: 'Success',
                description: 'Course deleted successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click event
        setOpen(true);
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={(e?: React.MouseEvent) => {
                    if (e) e.stopPropagation();
                    setOpen(false);
                }}
                onConfirm={onConfirm}
                loading={loading}
            />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Open menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align='end'
                    onClick={(e) => e.stopPropagation()}
                >
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <PopupModal
                        trigger={
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                            >
                                <Edit className='mr-2 h-4 w-4' /> Update
                            </DropdownMenuItem>
                        }
                        renderModal={(onClose) => (
                            <CourseUpdateForm
                                courseData={data}
                                modalClose={onClose}
                            />
                        )}
                    />
                    <DropdownMenuItem onClick={handleDeleteClick}>
                        <Trash className='mr-2 h-4 w-4' /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
