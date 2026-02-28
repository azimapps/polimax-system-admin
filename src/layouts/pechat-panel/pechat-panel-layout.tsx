import type { NavSectionProps } from 'src/components/nav-section';

import { useMemo } from 'react';

import { DashboardLayout } from 'src/layouts/dashboard';

function usePechatNavData(): NavSectionProps['data'] {
    return useMemo(
        () => [
            {
                subheader: 'PECHAT PANELI',
                items: [
                    {
                        title: 'Jarayonda',
                        path: '/pechat-panel/jarayonda',
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2" />
                                <path d="M3 9h18" />
                                <path d="M9 21V9" />
                            </svg>
                        ),
                    },
                    {
                        title: 'Yakunlangan',
                        path: '/pechat-panel/finished',
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        ),
                    },
                    {
                        title: 'Materiallar',
                        path: '/pechat-panel/materials',
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 5H4v14h16V5zm-2 12H6V7h12v10zm-4-8h-4v2h4V9zm0 4h-4v2h4v-2z" opacity=".3" />
                                <path d="M22 3H2v18h20V3zM4 5h16v14H4V5zm2 2v10h12V7H6zm4 2h4v2h-4V9zm0 4h4v2h-4v-2z" />
                            </svg>
                        ),
                    },
                    {
                        title: 'Sushka paneli',
                        path: '/pechat-panel/sushka',
                        icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.5h-2v3h2V1zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.75l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zm-12.24 0l-1.79 1.79 1.41 1.41 1.79-1.8-1.41-1.4zM20 10.5v2h3v-2h-3zm-8-7c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1 3h2v3h-2v-3z" />
                            </svg>
                        ),
                    },
                ],
            },
        ],
        []
    );
}

type Props = {
    children: React.ReactNode;
};

export function PechatPanelLayout({ children }: Props) {
    const navData = usePechatNavData();

    return (
        <DashboardLayout slotProps={{ nav: { data: navData } }}>
            {children}
        </DashboardLayout>
    );
}
