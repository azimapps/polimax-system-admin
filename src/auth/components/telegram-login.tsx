import { useRef, useEffect } from 'react';

type TelegramUser = {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
};

type Props = {
    botName: string;
    buttonSize?: 'large' | 'medium' | 'small';
    cornerRadius?: number;
    requestAccess?: 'write';
    usePic?: boolean;
    onAuth: (user: TelegramUser) => void;
};

export function TelegramLoginButton({
    botName,
    buttonSize = 'large',
    cornerRadius = 8,
    requestAccess = 'write',
    usePic = false,
    onAuth,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        (window as any).TelegramLoginWidget = {
            dataOnauth: (user: TelegramUser) => onAuth(user),
        };

        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.async = true;
        script.setAttribute('data-telegram-login', botName);
        script.setAttribute('data-size', buttonSize);
        if (cornerRadius !== undefined) {
            script.setAttribute('data-radius', cornerRadius.toString());
        }
        if (requestAccess) {
            script.setAttribute('data-request-access', requestAccess);
        }
        script.setAttribute('data-userpic', usePic.toString());
        script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');

        if (containerRef.current) {
            containerRef.current.appendChild(script);
        }

        return () => {
            delete (window as any).TelegramLoginWidget;
            // Also maybe clean up the widget if needed
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once

    return <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center' }} />;
}
