import React, {createContext, useContext, useState, ReactNode} from 'react';

interface Location {
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
}

interface Session {
    _id: string;
    course: string;
    topic: string;
    session_date: Date;
    status: 'active' | 'inactive';
    attendance_weight: number;
    attendance_type: 'face_recognition' | 'student_based' | 'hybrid';
    location: Location;
    created_at: Date;
}

interface SessionContextType {
    sessions: Session[];
    setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
    selectedSession: Session | null;
    setSelectedSession: React.Dispatch<React.SetStateAction<Session | null>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
    children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({children}) => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedSession, setSelectedSession] = useState<Session | null>(
        null,
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const value = {
        sessions,
        setSessions,
        selectedSession,
        setSelectedSession,
        loading,
        setLoading,
        error,
        setError,
    };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSessionContext = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error(
            'useSessionContext must be used within a SessionProvider',
        );
    }
    return context;
};
