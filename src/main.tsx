import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import {ToastProvider} from '@radix-ui/react-toast';
import {AuthProvider} from './context/auth-context';
import {ImageProvider} from './context/image-context';
import {CourseProvider} from './context/course-context';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <ImageProvider>
                <CourseProvider>
                    <ToastProvider>
                        <App />
                    </ToastProvider>
                </CourseProvider>
            </ImageProvider>
        </AuthProvider>
    </React.StrictMode>,
);
