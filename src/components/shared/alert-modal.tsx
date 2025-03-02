import {Button} from '@/components/ui/button';
import {Modal} from '@/components/ui/modal';

type TAlertModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    title?: string;
    description?: string;
};

export const AlertModal = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
    title = 'Are you sure?',
    description = 'Are you sure you want to continue?',
}: TAlertModalProps) => {
    const handleConfirm = (e: React.MouseEvent) => {
        e.stopPropagation();
        onConfirm();
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
    };

    return (
        <Modal
            title={title}
            description={description}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className='flex w-full items-center justify-end space-x-2 pt-6'
            >
                <Button
                    disabled={loading}
                    variant='outline'
                    onClick={handleClose}
                >
                    Cancel
                </Button>
                <Button
                    disabled={loading}
                    variant='destructive'
                    onClick={handleConfirm}
                >
                    Continue
                </Button>
            </div>
        </Modal>
    );
};
