import {ReactNode} from 'react';

// props for the provider
export interface AttendanceProviderProps {
    children: ReactNode;
}

export interface AttendanceRecord {
    _id: string;
    student: {
        id: string;
        fullName: string;
        userIdentifier: string;
        email?: string;
    };
    session: string;
    captured_at?: Date | null;
    attendance_status: 'present' | 'absent' | 'late';
    location_status?: 'within_range' | 'outside_range' | 'not_verified';
    verification_method?: 'manual' | 'face_recognition' | 'location';
    created_at: Date;
    face_matched?: boolean;
    score?: number;
    attendance_weight?: number;
}

export interface SessionAttendanceResponse {
    data: {
        absent_count: number;
        attendance_details: AttendanceRecord[];
        course: {id: string; name: string | null};
        flagged_count: number;
        present_count: number;
        session_date: string;
        session_id: string;
        total_students: number;
    };
    message: string;
}

export interface AttendanceContextType {
    attendanceRecords: AttendanceRecord[];
    setAttendanceRecords: React.Dispatch<
        React.SetStateAction<AttendanceRecord[]>
    >;
    loading: boolean;
    error: string | null;
    fetchAttendanceBySession: (sessionId: string) => Promise<void>;
    markAttendanceWithFace: (
        courseId: string,
        sessionId: string,
        imageBlob: Blob,
        locationCoordinates?: {
            latitude: number;
            longitude: number;
            accuracy: number;
        },
    ) => Promise<string>; // Changed from Promise<void> to Promise<string>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}
