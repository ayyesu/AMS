import React, {createContext, useContext, useState, useEffect} from 'react';
import {useAuth} from './auth-context';
import {imageApi} from '@/lib/api';

interface ImageData {
    _id: string;
    student: string;
    image_path: string;
    face_descriptor?: boolean;
}

type ImageContextType = {
    imageData: ImageData | null;
    setImageData: (data: ImageData | null) => void;
    uploadImage: (file: File) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    uploadProgress: number;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({children}: {children: React.ReactNode}) {
    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const {user} = useAuth();

    // Fetch user's profile image on mount or when user changes
    useEffect(() => {
        const fetchUserImage = async () => {
            if (!user?._id) return;

            try {
                setIsLoading(true);
                setError(null);

                const response = await imageApi.getImage(user._id);

                setImageData(response?.data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch image',
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserImage();
    }, [user]);

    const uploadImage = async (file: File) => {
        if (!user?._id) return;

        try {
            setIsLoading(true);
            setError(null);
            setUploadProgress(0);

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('File size should not exceed 5MB');
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                throw new Error('Please upload an image file');
            }

            // Create FormData and append the file
            const formData = new FormData();
            formData.append('image', file);

            const response = await imageApi.uploadImage(
                formData,
                user._id,
                (progress) => {
                    setUploadProgress(progress);
                },
            );

            if (!response.data) {
                throw new Error('Failed to upload image');
            }

            setImageData(response.data);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to upload image';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <ImageContext.Provider
            value={{
                imageData,
                setImageData,
                uploadImage,
                isLoading,
                error,
                uploadProgress,
            }}
        >
            {children}
        </ImageContext.Provider>
    );
}

export const useImage = () => {
    const context = useContext(ImageContext);
    if (context === undefined) {
        throw new Error('useImage must be used within an ImageProvider');
    }
    return context;
};
