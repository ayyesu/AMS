import {AlertModal} from '@/components/shared/alert-modal';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Employee} from '@/constants/data';
import {Edit, PinIcon, MoreHorizontal, Trash} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';

interface CellActionProps {
    data: Employee;
}

export const CellAction: React.FC<CellActionProps> = ({data}) => {
    const [loading] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const onConfirm = async () => {};

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
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
                    <DropdownMenuItem>
                        <PinIcon className='mr-2 h-4 w-4' />
                        Create session
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => navigate(`/app/courses/${data.id}`)}
                    >
                        <Edit className='mr-2 h-4 w-4' /> Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className='mr-2 h-4 w-4' /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
