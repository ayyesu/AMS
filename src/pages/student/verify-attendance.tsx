import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { faceRecognitionApi, attendanceApi, sessionApi } from '@/lib/api';
import { Loader2, Camera, RefreshCcw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Session } from '@/types';

export default function VerifyAttendancePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        if (!sessionId) return;
        const sessionData = await sessionApi.getById(sessionId);
        setSession(sessionData);
        
        // Check if session is active
        if (sessionData.status !== 'active') {
          setError('This session is not currently active for attendance.');
          return;
        }
        
        // Start camera if session is valid
        await startCamera();
      } catch (error) {
        setError('Failed to load session details. Please try again later.');
      } finally {
        setInitializing(false);
      }
    };

    fetchSession();
    return () => {
      stopCamera();
    };
  }, [sessionId]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      setError('Failed to access camera. Please check permissions and try again.');
      toast({
        title: 'Camera Error',
        description: 'Failed to access camera. Please check permissions.',
        variant: 'destructive',
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current) {
        reject(new Error('Video element not found'));
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to capture image'));
          }
        },
        'image/jpeg',
        0.8
      );
    });
  };

  const handleVerification = async () => {
    if (!sessionId) {
      toast({
        title: 'Error',
        description: 'Session ID is missing',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const imageBlob = await captureImage();
      const formData = new FormData();
      formData.append('image', imageBlob, 'verification.jpg');
      formData.append('sessionId', sessionId);

      const verificationResult = await faceRecognitionApi.verifyFace(formData);
      
      if (verificationResult.verified) {
        await attendanceApi.markAttendance(sessionId, {
          verificationMethod: 'face',
          status: 'present',
        });

        toast({
          title: 'Success',
          description: 'Attendance marked successfully!',
        });

        navigate('/student/dashboard');
      } else {
        setError('Face verification failed. Please ensure proper lighting and try again.');
        toast({
          title: 'Verification Failed',
          description: 'Face verification failed. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setError('Failed to verify attendance. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to verify attendance. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Face Verification</CardTitle>
          <CardDescription>
            {session ? (
              <>
                Marking attendance for {session.courseId} - {new Date(session.date).toLocaleDateString()}
                <br />
                Please position your face in the camera frame and ensure good lighting
              </>
            ) : (
              'Loading session details...'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="relative aspect-video w-full max-w-md mx-auto overflow-hidden rounded-lg bg-muted">
            {!stream && !loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Camera is not active</p>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={startCamera}
              disabled={loading || !!stream}
            >
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                stopCamera();
                startCamera();
              }}
              disabled={loading || !stream}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset Camera
            </Button>

            <Button
              onClick={handleVerification}
              disabled={loading || !stream}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify & Mark Attendance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
