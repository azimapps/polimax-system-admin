// core (MUI)
import { enUS as enUSCore } from '@mui/material/locale';
// date pickers (MUI)
import { enUS as enUSDate } from '@mui/x-date-pickers/locales';
// data grid (MUI)
import { enUS as enUSDataGrid, ruRU as ruRUDataGrid } from '@mui/x-data-grid/locales';

// custom data grid locales
import { uzUZ as uzUZDataGrid, uzUZPagination } from './data-grid/uzUZ';
import { uzCyrlUZ as uzCyrlUZDataGrid, uzCyrlUZPagination } from './data-grid/uzCyrlUZ';

// ----------------------------------------------------------------------

export const allLangs = [
  {
    value: 'en',
    label: 'English',
    countryCode: 'GB',
    adapterLocale: 'en',
    numberFormat: { code: 'en-US', currency: 'USD' },
    systemValue: {
      components: {
        ...enUSCore.components,
        ...enUSDate.components,
        ...enUSDataGrid.components,
      },
    },
  },
  {
    value: 'ru',
    label: 'Русский',
    countryCode: 'RU',
    adapterLocale: 'ru',
    numberFormat: { code: 'ru-RU', currency: 'RUB' },
    systemValue: {
      components: {
        // Only data grid is available for ruRU
        ...ruRUDataGrid.components,
      },
    },
  },
  {
    value: 'uz',
    label: 'O’zbekcha',
    countryCode: 'UZ',
    adapterLocale: 'uz',
    numberFormat: { code: 'uz-UZ', currency: 'UZS' },
    systemValue: {
      // Fallback to English components for now, since MUI doesn’t offer uz localization
      components: {
        ...enUSCore.components,
        ...enUSDate.components,
        ...uzUZDataGrid.components,
        ...uzUZPagination,
      },
    },
  },
  {
    value: 'uz-Cyrl',
    label: 'Ўзбекча',
    countryCode: 'UZ',
    adapterLocale: 'uz',
    numberFormat: { code: 'uz-UZ', currency: 'UZS' },
    systemValue: {
      components: {
        ...enUSCore.components,
        ...enUSDate.components,
        ...uzCyrlUZDataGrid.components,
        ...uzCyrlUZPagination,
      },
    },
  },
];
