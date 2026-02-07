import { getGridLocalization } from '@mui/x-data-grid/utils/getGridLocalization';

const uzUZGrid = {
    // Root
    noRowsLabel: "Ma'lumot yo'q",
    noResultsOverlayLabel: 'Natija topilmadi.',

    // Density selector toolbar button text
    toolbarDensity: 'Zichlik',
    toolbarDensityLabel: 'Zichlik',
    toolbarDensityCompact: 'Ixcham',
    toolbarDensityStandard: 'Standart',
    toolbarDensityComfortable: 'Qulay',

    // Columns selector toolbar button text
    toolbarColumns: 'Ustunlar',
    toolbarColumnsLabel: 'Ustunlarni tanlang',

    // Filters toolbar button text
    toolbarFilters: 'Filtrlar',
    toolbarFiltersLabel: "Filtrlarni ko'rsatish",
    toolbarFiltersTooltipHide: 'Filtrlarni yashirish',
    toolbarFiltersTooltipShow: "Filtrlarni ko'rsatish",
    toolbarFiltersTooltipActive: (count: number) =>
        count !== 1 ? `${count} ta faol filtr` : `${count} faol filtr`,

    // Quick filter toolbar field
    toolbarQuickFilterPlaceholder: 'Qidirish…',
    toolbarQuickFilterLabel: 'Qidirish',
    toolbarQuickFilterDeleteIconLabel: 'Tozalash',

    // Export selector toolbar button text
    toolbarExport: 'Eksport',
    toolbarExportLabel: 'Eksport',
    toolbarExportCSV: 'CSV sifatida yuklab olish',
    toolbarExportPrint: 'Chop etish',
    toolbarExportExcel: 'Excel sifatida yuklab olish',

    // Columns panel text
    columnsPanelTextFieldLabel: 'Ustunni topish',
    columnsPanelTextFieldPlaceholder: 'Ustun nomi',
    columnsPanelDragIconLabel: 'Ustunni qayta tartiblash',
    columnsPanelShowAllButton: "Barchasini ko'rsatish",
    columnsPanelHideAllButton: 'Barchasini yashirish',

    // Filter panel text
    filterPanelAddFilter: "Filtr qo'shish",
    filterPanelRemoveAll: "Barchasini o'chirish",
    filterPanelDeleteIconLabel: "O'chirish",
    filterPanelLogicOperator: 'Mantiqiy operator',
    filterPanelOperator: 'Operator',
    filterPanelOperatorAnd: 'Va',
    filterPanelOperatorOr: 'Yoki',
    filterPanelColumns: 'Ustunlar',
    filterPanelInputLabel: 'Qiymat',
    filterPanelInputPlaceholder: 'Filtr qiymati',

    // Filter operators text
    filterOperatorContains: "o'z ichiga oladi",
    filterOperatorEquals: 'teng',
    filterOperatorStartsWith: 'boshlanadi',
    filterOperatorEndsWith: 'tugaydi',
    filterOperatorIs: 'bu',
    filterOperatorNot: 'emas',
    filterOperatorAfter: 'keyin',
    filterOperatorOnOrAfter: 'yoki keyin',
    filterOperatorBefore: 'oldin',
    filterOperatorOnOrBefore: 'yoki oldin',
    filterOperatorIsEmpty: "bo'sh",
    filterOperatorIsNotEmpty: "bo'sh emas",
    filterOperatorIsAnyOf: 'birortasi',

    // Header filter operators text
    headerFilterOperatorContains: "O'z ichiga oladi",
    headerFilterOperatorEquals: 'Teng',
    headerFilterOperatorStartsWith: 'Boshlanadi',
    headerFilterOperatorEndsWith: 'Tugaydi',
    headerFilterOperatorIs: 'Bu',
    headerFilterOperatorNot: 'Emas',
    headerFilterOperatorAfter: 'Keyin',
    headerFilterOperatorOnOrAfter: 'Yoki keyin',
    headerFilterOperatorBefore: 'Oldin',
    headerFilterOperatorOnOrBefore: 'Yoki oldin',
    headerFilterOperatorIsEmpty: "Bo'sh",
    headerFilterOperatorIsNotEmpty: "Bo'sh emas",
    headerFilterOperatorIsAnyOf: 'Birortasi',

    // Filter values text
    filterValueAny: 'har qanday',
    filterValueTrue: "to'g'ri",
    filterValueFalse: "noto'g'ri",

    // Column menu text
    columnMenuLabel: 'Menyu',
    columnMenuShowColumns: "Ustunlarni ko'rsatish",
    columnMenuManageColumns: 'Ustunlarni boshqarish',
    columnMenuFilter: 'Filtr',
    columnMenuHideColumn: 'Yashirish',
    columnMenuUnsort: 'Saralashni bekor qilish',
    columnMenuSortAsc: "O'sish bo'yicha saralash",
    columnMenuSortDesc: "Kamayish bo'yicha saralash",

    // Column header text
    columnHeaderFiltersTooltipActive: (count: number) =>
        count !== 1 ? `${count} ta faol filtr` : `${count} faol filtr`,
    columnHeaderFiltersLabel: "Filtrlarni ko'rsatish",
    columnHeaderSortIconLabel: 'Saralash',

    // Rows selected footer text
    footerRowSelected: (count: number) =>
        count !== 1
            ? `${count.toLocaleString()} ta qator tanlandi`
            : `${count.toLocaleString()} qator tanlandi`,

    // Total row amount footer text
    footerTotalRows: 'Jami qatorlar:',

    // Total visible row amount footer text
    footerTotalVisibleRows: (visibleCount: number, totalCount: number) =>
        `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

    // Checkbox selection text
    checkboxSelectionHeaderName: 'Belgilash',
    checkboxSelectionSelectAllRows: 'Barcha qatorlarni tanlash',
    checkboxSelectionUnselectAllRows: 'Barcha qatorlarni bekor qilish',
    checkboxSelectionSelectRow: 'Qatorni tanlash',
    checkboxSelectionUnselectRow: 'Qatorni bekor qilish',

    // Boolean cell text
    booleanCellTrueLabel: 'ha',
    booleanCellFalseLabel: "yo'q",

    // Actions cell more text
    actionsCellMore: "ko'proq",

    // Column pinning text
    pinToLeft: 'Chapga mahkamlash',
    pinToRight: "O'ngga mahkamlash",
    unpin: 'Mahkamlashni bekor qilish',

    // Tree Data
    treeDataGroupingHeaderName: 'Guruh',
    treeDataExpand: "ko'rish",
    treeDataCollapse: 'yashirish',

    // Grouping columns
    groupingColumnHeaderName: 'Guruh',
    groupColumn: (name: string) => `${name} bo'yicha guruhlash`,
    unGroupColumn: (name: string) => `${name} bo'yicha guruhlashni bekor qilish`,

    // Master/detail
    detailPanelToggle: 'Tafsilotlar panelini almashtirish',
    expandDetailPanel: 'Kengaytirish',
    collapseDetailPanel: "Yig'ish",

    // Row reordering text
    rowReorderingHeaderName: 'Qatorlarni qayta tartiblash',

    // Aggregation
    aggregationMenuItemHeader: 'Agregatsiya',
    aggregationFunctionLabelSum: "yig'indi",
    aggregationFunctionLabelAvg: "o'rtacha",
    aggregationFunctionLabelMin: 'min',
    aggregationFunctionLabelMax: 'maks',
    aggregationFunctionLabelSize: 'hajmi',

    // Used core components translation keys
    MuiTablePagination: {
        labelRowsPerPage: 'Sahifadagi qatorlar:',
        labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) =>
            `${from}–${to} / ${count !== -1 ? count : `${to} dan ko'p`}`,
    },
};

export const uzUZ = getGridLocalization(uzUZGrid, {});
