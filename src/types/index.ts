export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin' | 'lecturer';
  studentId?: string;
  imageUrl?: string | null;
  profileImageUrl?: string | null;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  description?: string;
  semester: string;
  academicYear: string;
}

export interface Session {
  id: string;
  courseId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  status: 'pending' | 'active' | 'completed';
}

export interface Attendance {
  id: string;
  sessionId: string;
  studentId: string;
  status: 'present' | 'absent' | 'late';
  verificationMethod: 'face' | 'location';
  verifiedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  label: string;
}
