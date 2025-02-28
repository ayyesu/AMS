import {useState, useEffect} from 'react';
import {Button} from './button';
import {Card} from './card';

export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setShowBanner(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className='fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-sm'>
            <Card className='max-w-2xl mx-auto p-4'>
                <div className='space-y-4'>
                    <div className='space-y-2'>
                        <h3 className='text-lg font-semibold'>
                            Cookie Preferences
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                            We use cookies to enhance your browsing experience.
                            Some cookies are necessary for the website to
                            function, while others help us improve our services.
                        </p>
                    </div>
                    <div className='flex space-x-4'>
                        <Button onClick={handleAccept} variant='default'>
                            Accept All Cookies
                        </Button>
                        <Button onClick={handleDecline} variant='outline'>
                            Decline Non-Essential
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
