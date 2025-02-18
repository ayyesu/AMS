import React, {useState, useRef} from 'react';
import PageHead from '@/components/shared/page-head';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {User} from 'lucide-react';
import {useAuth} from '@/context/auth-context';
import {useImage} from '@/context/image-context';

export default function UserProfile() {
    const {user} = useAuth();
    const {imageData} = useImage();
    const userData = {
        name: user?.fullName,
        email: user?.email,
        studentId: user?.userIdentifier,
    };

    const updateProfileImage = async (formData: FormData) => {
        try {
            const response = await fetch('/api/update-profile-image', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                // Refresh the image data or update the context
                // You might need to call a function from your image context here
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <>
            <PageHead title='Profile | Student' />
            <div className='max-h-screen flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-3xl font-bold tracking-tight'>
                        Profile
                    </h2>
                </div>

                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                    <Card className='col-span-3'>
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                        </CardHeader>
                        <CardContent className='flex flex-col items-center space-y-4'>
                            <Avatar className='h-72 w-72'>
                                <AvatarImage src={imageData?.image_path} />
                                <AvatarFallback>
                                    <User className='h-16 w-16' />
                                </AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col items-center gap-4'>
                                <Label
                                    htmlFor='picture'
                                    className='cursor-pointer text-sm text-muted-foreground hover:text-primary'
                                >
                                    Change Picture
                                </Label>
                                <p className='text-sm text-secondary-foreground text-center max-w-[250px]'>
                                    Note: This image will be used for facial
                                    recognition. Please provide a clear, recent
                                    photo of your face.
                                </p>
                                <input
                                    id='picture'
                                    type='file'
                                    accept='image/*'
                                    className='hidden'
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            // Handle file upload here
                                            const formData = new FormData();
                                            formData.append('image', file);
                                            // Add your API call to update the image here
                                            // Example:
                                            // updateProfileImage(formData);
                                        }
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='col-span-4'>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                <strong>Full Name:</strong> {userData.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {userData.email}
                            </p>
                            <p>
                                <strong>Staff ID:</strong> {userData.studentId}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
