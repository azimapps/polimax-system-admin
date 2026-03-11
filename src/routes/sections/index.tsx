import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { DashboardLayout } from 'src/layouts/dashboard';
import { ReskaPanelLayout } from 'src/layouts/reska-panel/reska-panel-layout';
import { PechatPanelLayout } from 'src/layouts/pechat-panel/pechat-panel-layout';
import { LaminatsiyaPanelLayout } from 'src/layouts/laminatsiya-panel/laminatsiya-panel-layout';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
import { RoleBasedGuard } from 'src/auth/guard/role-based-guard';

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
const KlientlarMaterials = lazy(() => import('src/pages/klientlar/materials-page'));
const KlientlarTransactions = lazy(() => import('src/pages/klientlar/transactions'));
const KlientlarOrders = lazy(() => import('src/pages/klientlar/orders-page'));
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
const OmborAnalyticsPage = lazy(() => import('src/pages/ombor/analytics-page'));
const OmborAccounts = lazy(() => import('src/pages/dashboard/ombor-account/list'));
const FinanceCashPage = lazy(() => import('src/pages/finance/cash'));
const FinanceTransferPage = lazy(() => import('src/pages/finance/transfer'));
const FinanceArchivedPage = lazy(() => import('src/pages/finance/archived'));
const FinanceStaffDebtPage = lazy(() => import('src/pages/finance/staff-debt'));
// Production
const ProductionPage = lazy(() => import('src/pages/production/page'));
const OrderPlanningPage = lazy(() => import('src/pages/order-planning/page'));
const MixingStationPage = lazy(() => import('src/pages/mixing-station/page'));
const SushkaPaneliPage = lazy(() => import('src/pages/sushka-paneli/page'));
// Worker Panel
const WorkerPanelPage = lazy(() => import('src/pages/worker-panel/page'));
// Laminatsiya Panel
const LaminatsiyaPanelPage = lazy(() => import('src/pages/laminatsiya-panel/page'));
// Reska Panel
const ReskaPanelPage = lazy(() => import('src/pages/reska-panel/page'));

// ----------------------------------------------------------------------

function WorkerPanelGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const allowed =
    ['admin', 'manager', 'ceo'].includes(user?.role) ||
    user?.role === 'pechat' ||
    user?.worker_type === 'pechat' ||
    user?.type === 'worker' ||
    !!user?.staff; // Allow any telegram staff to at least see it

  return (
    <RoleBasedGuard hasContent currentRole={allowed ? 'allowed' : 'denied'} allowedRoles={['allowed']}>
      {children}
    </RoleBasedGuard>
  );
}

function LaminatsiyaPanelGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const allowed =
    ['admin', 'manager', 'ceo'].includes(user?.role) ||
    user?.role === 'laminatsiya' ||
    user?.worker_type === 'laminatsiya' ||
    user?.type === 'worker' ||
    !!user?.staff;

  return (
    <RoleBasedGuard hasContent currentRole={allowed ? 'allowed' : 'denied'} allowedRoles={['allowed']}>
      {children}
    </RoleBasedGuard>
  );
}

function ReskaPanelGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const allowed =
    ['admin', 'manager', 'ceo'].includes(user?.role) ||
    user?.role === 'reska' ||
    user?.worker_type === 'reska' ||
    user?.type === 'worker' ||
    !!user?.staff;

  return (
    <RoleBasedGuard hasContent currentRole={allowed ? 'allowed' : 'denied'} allowedRoles={['allowed']}>
      {children}
    </RoleBasedGuard>
  );
}

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

const pechatPanelLayout = () => (
  <PechatPanelLayout>
    <SuspenseOutlet />
  </PechatPanelLayout>
);

const laminatsiyaPanelLayout = () => (
  <LaminatsiyaPanelLayout>
    <SuspenseOutlet />
  </LaminatsiyaPanelLayout>
);

const reskaPanelLayout = () => (
  <ReskaPanelLayout>
    <SuspenseOutlet />
  </ReskaPanelLayout>
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
          { index: true, element: <KlientlarList /> },
          { path: 'list', element: <KlientlarList /> },

          { path: 'create', element: <KlientlarCreate /> },
          { path: 'archived', element: <KlientlarArchived /> },
          { path: 'crm', element: <KlientlarCRM /> },
          { path: 'materials', element: <KlientlarMaterials /> },
          { path: 'orders', element: <KlientlarOrders /> },
          { path: ':id', element: <KlientlarDetail /> },
          { path: ':id/edit', element: <KlientlarDetail /> },
          { path: ':id/transactions', element: <KlientlarTransactions /> },
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
          { index: true, element: <StaffList /> },
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
          { index: true, element: <StanokList /> },
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
          { path: 'analytics', element: <OmborAnalyticsPage /> },
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
          { path: 'accounts', element: <OmborAccounts /> },
        ],
      },
      {
        path: 'sushka-paneli',
        element: <SushkaPaneliPage />,
      },
      {
        path: 'finance',
        children: [
          { index: true, element: <FinanceCashPage /> },
          { path: 'cash', element: <FinanceCashPage /> },
          { path: 'transfer', element: <FinanceTransferPage /> },
          { path: 'staff-debt', element: <FinanceStaffDebtPage /> },
          { path: 'archived', element: <FinanceArchivedPage /> },
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

  // Worker standalone panel
  {
    path: '/pechat-panel',
    element: (
      <AuthGuard>
        <WorkerPanelGuard>
          {pechatPanelLayout()}
        </WorkerPanelGuard>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <WorkerPanelPage /> },
      { path: 'jarayonda', element: <WorkerPanelPage /> },
      { path: 'finished', element: <WorkerPanelPage /> },
      { path: 'materials', element: <WorkerPanelPage /> },
      { path: 'sushka', element: <WorkerPanelPage /> },
    ],
  },

  // Laminatsiya standalone panel
  {
    path: '/laminatsiya-panel',
    element: (
      <AuthGuard>
        <LaminatsiyaPanelGuard>
          {laminatsiyaPanelLayout()}
        </LaminatsiyaPanelGuard>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <LaminatsiyaPanelPage /> },
      { path: 'jarayonda', element: <LaminatsiyaPanelPage /> },
      { path: 'finished', element: <LaminatsiyaPanelPage /> },
      { path: 'materials', element: <LaminatsiyaPanelPage /> },
      { path: 'sushka', element: <LaminatsiyaPanelPage /> },
    ],
  },

  // Reska standalone panel
  {
    path: '/reska-panel',
    element: (
      <AuthGuard>
        <ReskaPanelGuard>
          {reskaPanelLayout()}
        </ReskaPanelGuard>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <ReskaPanelPage /> },
      { path: 'jarayonda', element: <ReskaPanelPage /> },
      { path: 'finished', element: <ReskaPanelPage /> },
      { path: 'materials', element: <ReskaPanelPage /> },
      { path: 'sushka', element: <ReskaPanelPage /> },
    ],
  },

  // Auth
  ...authDemoRoutes,

  // Main
  ...mainRoutes,

  // No match
  { path: '*', element: <Page404 /> },
];