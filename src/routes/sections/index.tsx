import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

import { mainRoutes } from './main';
import { usePathname } from '../hooks';
import { authDemoRoutes } from './auth';

// ----------------------------------------------------------------------

// Overview
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
// User
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
// Games  - Word Battle
const WordBattle = lazy(() => import('src/pages/dashboard/word-battle/list'));
const CreateCategory = lazy(() => import('src/pages/dashboard/word-battle/create'));
const WordBattleUserList = lazy(() => import('src/pages/dashboard/word-battle/users'));
const CategoryView = lazy(() => import('src/pages/dashboard/word-battle/categoryView'));
const Settings = lazy(() => import('src/pages/dashboard/word-battle/settingsGame'));
// Games - Flash Card
const FlashCardList = lazy(() => import('src/pages/dashboard/flash-card/topicList'));
const CreateTopic = lazy(() => import('src/pages/dashboard/flash-card/create'));
const EditTopic = lazy(() => import('src/pages/dashboard/flash-card/edit'));
const FlashCardTopicView = lazy(() => import('src/pages/dashboard/flash-card/view'));
const FlashCardCategoryList = lazy(() => import('src/pages/dashboard/flash-card/categoryList'));
// Klientlar
const KlientlarList = lazy(() => import('src/pages/klientlar/list'));
const KlientlarCreate = lazy(() => import('src/pages/klientlar/create'));
const KlientlarDetail = lazy(() => import('src/pages/klientlar/detail'));
const KlientlarArchived = lazy(() => import('src/pages/klientlar/archived'));
const KlientlarCRM = lazy(() => import('src/pages/klientlar/crm'));
// Games - 4Pics 1Word
const QuestionList = lazy(() => import('src/pages/dashboard/4pics-1word/list'));
const CreateQuestions = lazy(() => import('src/pages/dashboard/4pics-1word/create'));
const UpdateQuestion = lazy(() => import('src/pages/dashboard/4pics-1word/update'));
const SettingsPicsWord = lazy(() => import('src/pages/dashboard/4pics-1word/setting'));
// Partners
const PartnersList = lazy(() => import('src/pages/partners/list'));
const PartnersArchived = lazy(() => import('src/pages/partners/archived'));
// Staff
const StaffList = lazy(() => import('src/pages/staff/list'));
const StaffArchived = lazy(() => import('src/pages/staff/archived'));
// Stanoklar
const StanokList = lazy(() => import('src/pages/stanok/list'));
const StanokArchived = lazy(() => import('src/pages/stanok/archived'));
const StanokBrigades = lazy(() => import('src/pages/stanok/brigades'));
const StanokProducts = lazy(() => import('src/pages/stanok/products'));
// Games - Odd One Out
const OddOneOutQuestionsList = lazy(() => import('src/pages/dashboard/odd-one-out/list'));
// New Sections
const OmborPage = lazy(() => import('src/pages/ombor/page'));
const FinancePage = lazy(() => import('src/pages/finance/page'));
const ProductionPage = lazy(() => import('src/pages/production/page'));
const OrderPlanningPage = lazy(() => import('src/pages/order-planning/page'));
const MixingStationPage = lazy(() => import('src/pages/mixing-station/page'));
const SushkaPaneliPage = lazy(() => import('src/pages/sushka-paneli/page'));
// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/pages/error/404'));

export const routesSection: RouteObject[] = [
  {
    path: '/',
    element: <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { index: true, element: <OverviewAnalyticsPage /> },
      {
        path: 'user',
        children: [
          { path: 'list', element: <UserListPage /> },
          { path: 'profile', element: <UserProfilePage /> },
        ],
      },
      {
        path: 'klientlar',
        children: [
          { path: 'list', element: <KlientlarList /> },
          { path: 'create', element: <KlientlarCreate /> },
          { path: 'archived', element: <KlientlarArchived /> },
          { path: 'crm', element: <KlientlarCRM /> },
          { path: ':id', element: <KlientlarDetail /> },
          { path: ':id/edit', element: <KlientlarDetail /> },
        ],
      },
      {
        path: 'partners',
        children: [
          { path: 'list', element: <PartnersList /> },
          { path: 'archived', element: <PartnersArchived /> },
        ],
      },
      {
        path: 'staff',
        children: [
          { path: 'list', element: <StaffList /> },
          { path: 'crm', element: <StaffList /> },
          { path: 'workers', element: <StaffList /> },
          { path: 'accountants', element: <StaffList /> },
          { path: 'planners', element: <StaffList /> },
          { path: 'archived', element: <StaffArchived /> },
        ],
      },
      {
        path: 'stanoklar',
        children: [
          { path: 'list', element: <StanokList /> },
          { path: 'pechat', element: <StanokList /> },
          { path: 'reska', element: <StanokList /> },
          { path: 'laminatsiya', element: <StanokList /> },
          { path: ':id/brigades', element: <StanokBrigades /> },
          { path: ':id/products', element: <StanokProducts /> },
          { path: 'archived', element: <StanokArchived /> },
        ],
      },
      {
        path: 'ombor',
        children: [
          { index: true, element: <OmborPage /> },
          { path: 'analytics', element: <OmborPage /> },
          { path: 'plyonka', element: <OmborPage /> },
          { path: 'kraska', element: <OmborPage /> },
          { path: 'suyuq-kraska', element: <OmborPage /> },
          { path: 'rastvaritel', element: <OmborPage /> },
          { path: 'rastvaritel-mix', element: <OmborPage /> },
          { path: 'cilindr', element: <OmborPage /> },
          { path: 'kley', element: <OmborPage /> },
          { path: 'zapchastlar', element: <OmborPage /> },
          { path: 'otxod', element: <OmborPage /> },
          { path: 'finished-products-toshkent', element: <OmborPage /> },
          { path: 'finished-products-angren', element: <OmborPage /> },
        ],
      },
      {
        path: 'sushka-paneli',
        element: <SushkaPaneliPage />,
      },
      {
        path: 'finance',
        children: [
          { index: true, element: <FinancePage /> },
          { path: 'cash', element: <FinancePage /> },
          { path: 'transfer', element: <FinancePage /> },
        ],
      },
      {
        path: 'production',
        children: [
          { index: true, element: <ProductionPage /> },
          { path: 'reports', element: <ProductionPage /> },
        ],
      },
      {
        path: 'order-planning',
        children: [
          { index: true, element: <OrderPlanningPage /> },
          { path: 'in-progress', element: <OrderPlanningPage /> },
          { path: 'finished', element: <OrderPlanningPage /> },
        ],
      },
      {
        path: 'mixing-station',
        element: <MixingStationPage />,
      },
      {
        path: 'word-battle',
        children: [
          { path: 'list', element: <WordBattle /> },
          { path: 'create', element: <CreateCategory /> },
          { path: 'players', element: <WordBattleUserList /> },
          { path: ':id/view', element: <CategoryView /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
      {
        path: 'flash-card',
        children: [
          {
            path: 'list',
            element: <FlashCardList />,
          },
          {
            path: 'create',
            element: <CreateTopic />,
          },
          {
            path: ':id/edit',
            element: <EditTopic />,
          },
          {
            path: ':id/view',
            element: <FlashCardTopicView />,
          },
          {
            path: 'category-list',
            element: <FlashCardCategoryList />,
          },
        ],
      },
      {
        path: 'pics-word',
        children: [
          {
            path: 'list',
            element: <QuestionList />,
          },
          {
            path: 'create',
            element: <CreateQuestions />,
          },
          {
            path: ':id/update',
            element: <UpdateQuestion />,
          },
          {
            path: 'settings',
            element: <SettingsPicsWord />,
          },
        ],
      },
      {
        path: 'odd-one-out',
        children: [
          {
            path: 'list',
            element: <OddOneOutQuestionsList />,
          },
        ],
      },
    ],
  },

  // Auth
  ...authDemoRoutes,

  // Main
  ...mainRoutes,

  // No match
  { path: '*', element: <Page404 /> },
];
