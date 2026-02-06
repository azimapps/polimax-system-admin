import type { NavSectionProps } from 'src/components/nav-section';

import { useMemo } from 'react';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

/**
 * Input nav data is an array of navigation section items used to define the structure and content of a navigation bar.
 * Each section contains a subheader and an array of items, which can include nested children items.
 *
 * Each item can have the following properties:
 * - `title`: The title of the navigation item.
 * - `path`: The URL path the item links to.
 * - `icon`: An optional icon component to display alongside the title.
 * - `info`: Optional additional information to display, such as a label.
 * - `allowedRoles`: An optional array of roles that are allowed to see the item.
 * - `caption`: An optional caption to display below the title.
 * - `children`: An optional array of nested navigation items.
 * - `disabled`: An optional boolean to disable the item.
 */
export const useNavData = (): NavSectionProps['data'] => {
  useTranslate('navbar');
  return useMemo(
    () => [
      /**
       * Overview
       * Hiding existing sections as requested, but keeping code for reference.
       */
      /*
      {
        subheader: t('allInformation'),
        items: [
          { title: t('statistics'), path: paths.dashboard.root, icon: ICONS.analytics },
          {
            title: t('users'),
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            children: [{ title: t('list'), path: paths.dashboard.user.list }],
          },
        ],
      },
      */
      /**
       * Management
       */
      /*
      {
        subheader: t('game'),
        items: [
          {
            title: 'Word battle',
            path: paths.dashboard.games.wordBattle.root,
            icon: ICONS.wordBattle,
            children: [
              {
                title: t('list'),
                path: paths.dashboard.games.wordBattle.list,
              },
              {
                title: t('create'),
                path: paths.dashboard.games.wordBattle.create,
              },
              {
                title: t('users'),
                path: paths.dashboard.games.wordBattle.users,
              },
              {
                title: t('settings'),
                path: paths.dashboard.games.wordBattle.settings,
              },
            ],
          },
          {
            title: 'Flash Card',
            path: paths.dashboard.games.flashCard.root,
            icon: ICONS.flashCard,
            children: [
              {
                title: t('list'),
                path: paths.dashboard.games.flashCard.list,
              },
              {
                title: t('create'),
                path: paths.dashboard.games.flashCard.create,
              },
              {
                title: 'Category List',
                path: paths.dashboard.games.flashCard.categoryList,
              },
            ],
          },
          {
            title: '4Pics 1Word',
            path: paths.dashboard.games.picsWord.root,
            icon: ICONS.picWord,
            children: [
              {
                title: t('list'),
                path: paths.dashboard.games.picsWord.list,
              },
              {
                title: t('create'),
                path: paths.dashboard.games.picsWord.create,
              },
              {
                title: t('settings'),
                path: paths.dashboard.games.picsWord.settings,
              },
            ],
          },
          {
            title: 'Odd One Out',
            path: paths.dashboard.games.oddOneOut.root,
            icon: ICONS.oddOneOut,
            children: [
              {
                title: t('list'),
                path: paths.dashboard.games.oddOneOut.list,
              },
            ],
          },
        ],
      },
      */
    ],
    []
  );
};
