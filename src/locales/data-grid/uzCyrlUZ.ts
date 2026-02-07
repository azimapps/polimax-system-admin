import { getGridLocalization } from '@mui/x-data-grid/utils/getGridLocalization';

const uzCyrlUZGrid = {
  // Root
  noRowsLabel: 'Маълумот йўқ',
  noResultsOverlayLabel: 'Натижа топилмади.',

  // Density selector toolbar button text
  toolbarDensity: 'Зичлик',
  toolbarDensityLabel: 'Зичлик',
  toolbarDensityCompact: 'Ихчам',
  toolbarDensityStandard: 'Стандарт',
  toolbarDensityComfortable: 'Қулай',

  // Columns selector toolbar button text
  toolbarColumns: 'Устунлар',
  toolbarColumnsLabel: 'Устунларни танланг',

  // Filters toolbar button text
  toolbarFilters: 'Фильтрлар',
  toolbarFiltersLabel: 'Фильтрларни кўрсатиш',
  toolbarFiltersTooltipHide: 'Фильтрларни яшириш',
  toolbarFiltersTooltipShow: 'Фильтрларни кўрсатиш',
  toolbarFiltersTooltipActive: (count: number) =>
    count !== 1 ? `${count} та фаол фильтр` : `${count} фаол фильтр`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Қидириш…',
  toolbarQuickFilterLabel: 'Қидириш',
  toolbarQuickFilterDeleteIconLabel: 'Тозалаш',

  // Export selector toolbar button text
  toolbarExport: 'Экспорт',
  toolbarExportLabel: 'Экспорт',
  toolbarExportCSV: 'CSV сифатида юклаб олиш',
  toolbarExportPrint: 'Чоп этиш',
  toolbarExportExcel: 'Excel сифатида юклаб олиш',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Устунни топиш',
  columnsPanelTextFieldPlaceholder: 'Устун номи',
  columnsPanelDragIconLabel: 'Устунни қайта тартиблаш',
  columnsPanelShowAllButton: 'Барчасини кўрсатиш',
  columnsPanelHideAllButton: 'Барчасини яшириш',

  // Filter panel text
  filterPanelAddFilter: 'Фильтр қўшиш',
  filterPanelRemoveAll: 'Барчасини ўчириш',
  filterPanelDeleteIconLabel: 'Ўчириш',
  filterPanelLogicOperator: 'Мантиқий оператор',
  filterPanelOperator: 'Оператор',
  filterPanelOperatorAnd: 'Ва',
  filterPanelOperatorOr: 'Ёки',
  filterPanelColumns: 'Устунлар',
  filterPanelInputLabel: 'Қиймат',
  filterPanelInputPlaceholder: 'Фильтр қиймати',

  // Filter operators text
  filterOperatorContains: 'ўз ичига олади',
  filterOperatorEquals: 'тенг',
  filterOperatorStartsWith: 'бошланади',
  filterOperatorEndsWith: 'тугайди',
  filterOperatorIs: 'бу',
  filterOperatorNot: 'эмас',
  filterOperatorAfter: 'кейин',
  filterOperatorOnOrAfter: 'ёки кейин',
  filterOperatorBefore: 'олдин',
  filterOperatorOnOrBefore: 'ёки олдин',
  filterOperatorIsEmpty: 'бўш',
  filterOperatorIsNotEmpty: 'бўш эмас',
  filterOperatorIsAnyOf: 'бирортаси',

  // Header filter operators text
  headerFilterOperatorContains: 'Ўз ичига олади',
  headerFilterOperatorEquals: 'Тенг',
  headerFilterOperatorStartsWith: 'Бошланади',
  headerFilterOperatorEndsWith: 'Тугайди',
  headerFilterOperatorIs: 'Бу',
  headerFilterOperatorNot: 'Эмас',
  headerFilterOperatorAfter: 'Кейин',
  headerFilterOperatorOnOrAfter: 'Ёки кейин',
  headerFilterOperatorBefore: 'Олдин',
  headerFilterOperatorOnOrBefore: 'Ёки олдин',
  headerFilterOperatorIsEmpty: 'Бўш',
  headerFilterOperatorIsNotEmpty: 'Бўш эмас',
  headerFilterOperatorIsAnyOf: 'Бирортаси',

  // Filter values text
  filterValueAny: 'хар қандай',
  filterValueTrue: 'тўғри',
  filterValueFalse: 'нотўғри',

  // Column menu text
  columnMenuLabel: 'Меню',
  columnMenuShowColumns: 'Устунларни кўрсатиш',
  columnMenuManageColumns: 'Устунларни бошқариш',
  columnMenuFilter: 'Фильтр',
  columnMenuHideColumn: 'Яшириш',
  columnMenuUnsort: 'Саралашни бекор қилиш',
  columnMenuSortAsc: 'Ўсиш бўйича саралаш',
  columnMenuSortDesc: 'Камайиш бўйича саралаш',

  // Column header text
  columnHeaderFiltersTooltipActive: (count: number) =>
    count !== 1 ? `${count} та фаол фильтр` : `${count} фаол фильтр`,
  columnHeaderFiltersLabel: 'Фильтрларни кўрсатиш',
  columnHeaderSortIconLabel: 'Саралаш',

  // Rows selected footer text
  footerRowSelected: (count: number) =>
    count !== 1
      ? `${count.toLocaleString()} та қатор танланди`
      : `${count.toLocaleString()} қатор танланди`,

  // Total row amount footer text
  footerTotalRows: 'Жами қаторлар:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount: number, totalCount: number) =>
    `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Белгилаш',
  checkboxSelectionSelectAllRows: 'Барча қаторларни танлаш',
  checkboxSelectionUnselectAllRows: 'Барча қаторларни бекор қилиш',
  checkboxSelectionSelectRow: 'Қаторни танлаш',
  checkboxSelectionUnselectRow: 'Қаторни бекор қилиш',

  // Boolean cell text
  booleanCellTrueLabel: 'ҳа',
  booleanCellFalseLabel: 'йўқ',

  // Actions cell more text
  actionsCellMore: 'кўпроқ',

  // Column pinning text
  pinToLeft: 'Чапга махкамлаш',
  pinToRight: 'Ўнгга махкамлаш',
  unpin: 'Махкамлашни бекор қилиш',

  // Tree Data
  treeDataGroupingHeaderName: 'Гуруҳ',
  treeDataExpand: 'кўриш',
  treeDataCollapse: 'яшириш',

  // Grouping columns
  groupingColumnHeaderName: 'Гуруҳ',
  groupColumn: (name: string) => `${name} бўйича гуруҳлаш`,
  unGroupColumn: (name: string) => `${name} бўйича гуруҳлашни бекор қилиш`,

  // Master/detail
  detailPanelToggle: 'Тафсилотлар панелини алмаштириш',
  expandDetailPanel: 'Кенгайтириш',
  collapseDetailPanel: 'Йиғиш',

  // Row reordering text
  rowReorderingHeaderName: 'Қаторларни қайта тартиблаш',

  // Aggregation
  aggregationMenuItemHeader: 'Агрегация',
  aggregationFunctionLabelSum: 'йиғинди',
  aggregationFunctionLabelAvg: 'ўртача',
  aggregationFunctionLabelMin: 'мин',
  aggregationFunctionLabelMax: 'макс',
  aggregationFunctionLabelSize: 'ҳажми',
};

export const uzCyrlUZ = getGridLocalization(uzCyrlUZGrid, {});

export const uzCyrlUZPagination = {
  MuiTablePagination: {
    defaultProps: {
      labelRowsPerPage: 'Саҳифадаги қаторлар сони:',
      labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) =>
        `${from}–${to} дан ${count !== -1 ? count : `${to} дан кўп`}`,
    },
  },
};
