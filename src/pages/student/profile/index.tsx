import React, { useState } from 'react';
import PageHead from '@/components/shared/page-head';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { User, Upload } from 'lucide-react';

const profileFormSchema = z.object({
    name: z.string().min(2, {
        message: 'Name must be at least 2 characters.',
    }),
    email: z.string().email({
        message: 'Please enter a valid email address.',
    }),
    studentId: z.string().min(1, {
        message: 'Student ID is required.',
    }),
    program: z.string().min(1, {
        message: 'Program is required.',
    }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    studentId: 'STU123456',
    program: 'Bachelor of Computer Science',
};

export default function StudentProfile() {
    const [imageUrl, setImageUrl] = useState<string>();
    const { toast } = useToast();
    
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
    });

    function onSubmit(data: ProfileFormValues) {
        toast({
            title: 'Profile updated',
            description: 'Your profile has been successfully updated.',
        });
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJpgOrPng) {
                toast({
                    title: 'Upload failed',
                    description: 'You can only upload JPG/PNG files!',
                    variant: 'destructive',
                });
                return;
            }

            if (!isLt2M) {
                toast({
                    title: 'Upload failed',
                    description: 'Image must be smaller than 2MB!',
                    variant: 'destructive',
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <PageHead title='Profile | Student' />
            <div className='max-h-screen flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-3xl font-bold tracking-tight'>Profile</h2>
                </div>

                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                    <Card className='col-span-3'>
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                            <CardDescription>
                                Update your profile picture
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='flex flex-col items-center space-y-4'>
                            <Avatar className='h-32 w-32'>
                                <AvatarImage src={imageUrl} />
                                <AvatarFallback>
                                    <User className='h-16 w-16' />
                                </AvatarFallback>
                            </Avatar>
                            <div className='flex items-center space-x-2'>
                                <Input
                                    type='file'
                                    accept='image/jpeg,image/png'
                                    onChange={handleImageUpload}
                                    className='hidden'
                                    id='picture-upload'
                                />
                                <Label
                                    htmlFor='picture-upload'
                                    className='cursor-pointer'
                                >
                                    <Button type='button' variant='outline'>
                                        <Upload className='mr-2 h-4 w-4' />
                                        Upload Photo
                                    </Button>
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='col-span-4'>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>
                                Update your personal details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='email'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type='email' />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='studentId'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Student ID</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='program'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Program</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='submit'>Save Changes</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
