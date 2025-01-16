import React, {useRef, useEffect, useState} from 'react';
import {Button} from '../ui/button';
import {Camera, StopCircle} from 'lucide-react';

interface WebcamProps {
    onCapture?: (imageSrc: string) => void;
    isActive: boolean;
    onToggle: (state: boolean) => void;
}

export default function WebcamCapture({
    onCapture,
    isActive,
    onToggle,
}: WebcamProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            }
            onToggle(true);
        } catch (err) {
            console.error('Error accessing camera:', err);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            streamRef.current = null;
            onToggle(false);
        }
    };

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div className='relative'>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`rounded-lg border-2 border-gray-300 ${isActive ? 'block' : 'hidden'}`}
                style={{maxWidth: '100%', width: '500px'}}
            />
            <div className='mt-4 flex justify-center gap-4'>
                {!isActive ? (
                    <Button
                        onClick={startCamera}
                        className='bg-green-600 hover:bg-green-700'
                    >
                        <Camera className='mr-2 h-4 w-4' />
                        Start Camera
                    </Button>
                ) : (
                    <Button onClick={stopCamera} variant='destructive'>
                        <StopCircle className='mr-2 h-4 w-4' />
                        Stop Camera
                    </Button>
                )}
            </div>
        </div>
    );
}
