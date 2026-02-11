import type { NavSectionProps } from 'src/components/nav-section';

import { useMemo } from 'react';

import { useTranslate } from 'src/locales';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  analytics: icon('ic-analytics'),
  user: icon('ic-user'),
};

// ----------------------------------------------------------------------

export const useNavData = (): NavSectionProps['data'] => {
  const { t } = useTranslate('navbar');

  return useMemo(
    () => [
      {
        subheader: t('sections'),
        items: [
          // Ombor (Warehouse) - Box Icon
          {
            title: t('ombor'),
            path: '/ombor',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 5H4v14h16V5zm-2 12H6V7h12v10zm-4-8h-4v2h4V9zm0 4h-4v2h4v-2z" opacity=".3" />
                <path d="M22 3H2v18h20V3zM4 5h16v14H4V5zm2 2v10h12V7H6zm4 2h4v2h-4V9zm0 4h4v2h-4v-2z" />
              </svg>
            ),
            children: [
              { title: t('ombor_analytics'), path: '/ombor/analytics' },
              { title: t('plyonka'), path: '/ombor/plyonka' },
              { title: t('kraska'), path: '/ombor/kraska' },
              { title: t('suyuq_kraska'), path: '/ombor/suyuq-kraska' },
              { title: t('rastvaritel'), path: '/ombor/rastvaritel' },
              { title: t('rastvaritel_mix'), path: '/ombor/rastvaritel-mix' },
              { title: t('cilindr'), path: '/ombor/cilindr' },
              { title: t('kley'), path: '/ombor/kley' },
              { title: t('zapchastlar'), path: '/ombor/zapchastlar' },
              { title: t('otxod'), path: '/ombor/otxod' },
              { title: t('finished_products_toshkent'), path: '/ombor/finished-products-toshkent' },
              { title: t('finished_products_angren'), path: '/ombor/finished-products-angren' },
            ],
          },

          // Stanok (Machine) - Nut/Bolt or Industrial Gear Icon
          {
            title: t('stanoklar'),
            path: '/stanoklar/list',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.64-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
              </svg>
            ),
            children: [
              { title: t('pechat'), path: '/stanoklar/pechat' },
              { title: t('reska'), path: '/stanoklar/reska' },
              { title: t('laminatsiya'), path: '/stanoklar/laminatsiya' },
            ],
          },

          // Sushka Paneli (Drying Panel) - Sun/Heat Icon
          {
            title: t('sushka_paneli'),
            path: '/sushka-paneli',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.5h-2v3h2V1zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.75l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zm-12.24 0l-1.79 1.79 1.41 1.41 1.79-1.8-1.41-1.4zM20 10.5v2h3v-2h-3zm-8-7c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1 3h2v3h-2v-3z" />
              </svg>
            ),
          },

          // Xodimlar (Staff) - User Groups
          {
            title: t('staff'),
            path: '/staff/list',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            ),
            children: [
              { title: t('crm'), path: '/staff/crm' },
              { title: t('workers'), path: '/staff/workers' },
              { title: t('accountants'), path: '/staff/accountants' },
              { title: t('planners'), path: '/staff/planners' },
            ],
          },

          // Hamkorlar (Partners) - Handshake
          {
            title: t('partners'),
            path: '/partners/list',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            ),
          },

          // Klientlar (Clients) - User/Analytics icon
          {
            title: t('clients'),
            path: '/klientlar',
            icon: ICONS.analytics,
            children: [
              { title: t('clients'), path: '/klientlar/list' },
              { title: t('crm'), path: '/klientlar/crm' },
              { title: t('materials'), path: '/klientlar/materials' },
              { title: t('orders'), path: '/klientlar/orders' },
            ],
          },

          // Moliya (Finance) - Dollar Sign / Money
          {
            title: t('finance'),
            path: '/finance',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            ),
            children: [
              { title: t('cash'), path: '/finance/cash' },
              { title: t('transfer'), path: '/finance/transfer' },
            ],
          },

          // Ishlab chiqarish (Production) - Chart Pie
          {
            title: t('production'),
            path: '/production',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <path d="M22 12A10 10 0 0 0 12 2v10z" />
              </svg>
            ),
            children: [
              { title: t('production_reports'), path: '/production/reports' },
            ],
          },

          // Buyurtma planlashtirish (Order Planning) - Dash / Line
          {
            title: t('order_planning'),
            path: '/order-planning',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            ),
            children: [
              { title: t('in_progress'), path: '/order-planning/in-progress' },
              { title: t('finished'), path: '/order-planning/finished' },
            ],
          },

          // Aralashtirish stansiyasi (Mixing Station) - Wrench
          {
            title: t('mixing_station'),
            path: '/mixing-station',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            ),
          },
        ],
      },
    ],
    [t]
  );
};
