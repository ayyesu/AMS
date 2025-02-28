import {CookieConsent} from './components/ui/cookie-consent';
import {Toaster} from './components/ui/toaster';
import AppProvider from './providers';
import AppRouter from './routes';

export default function App() {
    return (
        <AppProvider>
            <AppRouter />
            <Toaster />
            <CookieConsent />
        </AppProvider>
    );
}
