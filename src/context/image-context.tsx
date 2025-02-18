import React, {createContext, useContext, useState, useEffect} from 'react';
import {useAuth} from './auth-context';
import {imageApi} from '@/lib/api';

interface ImageData {
    _id: string;
    student: string;
    image_path: string;
}

type ImageContextType = {
    imageData: ImageData | null;
    setImageData: (data: ImageData | null) => void;
    uploadImage: (file: File) => Promise<void>;
    isLoading: boolean;
    error: string | null;
};

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({children}: {children: React.ReactNode}) {
    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

            const formData = new FormData();
            formData.append('image', file);
            formData.append('student', user._id);

            const response = await fetch('/images/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();
            setImageData(data.data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to upload image',
            );
        } finally {
            setIsLoading(false);
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
