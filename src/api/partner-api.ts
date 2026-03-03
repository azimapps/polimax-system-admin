import type {
    Partner,
    PartnerListItem,
    CreatePartnerRequest,
    UpdatePartnerRequest,
} from 'src/types/partner';

import axiosInstance from 'src/lib/axios';

// ----------------------------------------------------------------------

const ALL_CAT_COMPANIES = [
    "Биаксплен",
    "ООО ORIENT FACTORY",
    "Mega Lux Sirdaryo (ООО Invest Asia)",
    "Mega Lux Sirdaryo",
    "ЭШУ Феруза",
    "Polilux",
    "Дим Реал Принт",
    "Россия",
    "Super Film",
    "Cold West Technology",
    "МБФ",
    "Синопласт",
    "Элбек пласт",
    "Улуг Саман",
    "Чортог",
    "Асрор-Рустам",
    "Бриз",
    "FLEX FILMS LLC",
    "Pakem",
    "Реталл Россия",
    "FLEX MIDDLE EAST FZE",
    "Титан плюс",
    "Савдо ЗТЮ",
    "Servis savdo",
    "Polupack",
    "Аккорд",
    "Турбо пласт плюс",
    "Фиббер",
    "Ташкент",
    "Китай упаковщик",
    "Uz Pro Labeloo",
    "SUQIAN GETTEL",
    "ООО \"Флекс Филмс Рус\"",
    "Shenjen Guangyuanjie Alufoil Products Co., Ltd"
];

const SOLVENT_ONLY_COMPANIES = [
    "Шавкатхожи",
    "Раимбов",
    "Хусниддин",
    "Shtu solvents"
];

const KLEY_ONLY_COMPANIES = [
    "Турецкий",
    "PERSIACHASB",
    "Омад Назаров",
    "OCHEM China",
    "BCI Туркия",
    "Бегзод Тошкент",
    "Дамир ака"
];

const STATIC_PARTNERS: PartnerListItem[] = [
    ...ALL_CAT_COMPANIES.map((name, index) => ({
        id: -(index + 1000),
        version: 1,
        fullname: name,
        company: name,
        phone_number: `+998 90 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(10 + Math.random() * 90)} ${Math.floor(10 + Math.random() * 90)}`,
        categories: ['plyonka', 'boyoq', 'silindr'] as any[],
        logo_url: '',
        image_urls: []
    })),
    ...SOLVENT_ONLY_COMPANIES.map((name, index) => ({
        id: -(index + 2000),
        version: 1,
        fullname: name,
        company: name,
        phone_number: `+998 90 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(10 + Math.random() * 90)} ${Math.floor(10 + Math.random() * 90)}`,
        categories: ['erituvchi'] as any[],
        logo_url: '',
        image_urls: []
    })),
    ...KLEY_ONLY_COMPANIES.map((name, index) => ({
        id: -(index + 3000),
        version: 1,
        fullname: name,
        company: name,
        phone_number: `+998 90 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(10 + Math.random() * 90)} ${Math.floor(10 + Math.random() * 90)}`,
        categories: ['yelim'] as any[],
        logo_url: '',
        image_urls: []
    }))
];

export const partnerApi = {
    // Get all partners
    getPartners: async (params?: { q?: string; category?: string }): Promise<PartnerListItem[]> => {
        const response = await axiosInstance.get('/partners', { params });
        const data = response.data as PartnerListItem[];
        
        // Add static partners if not searching or if search matches
        const staticMatches = STATIC_PARTNERS.filter(p => {
            if (params?.q && !p.company.toLowerCase().includes(params.q.toLowerCase())) return false;
            if (params?.category && !p.categories.includes(params.category as any)) return false;
            return true;
        });

        return [...data, ...staticMatches];
    },

    // Get single partner
    getPartner: async (id: number): Promise<Partner> => {
        if (id < 0) {
            const staticPartner = STATIC_PARTNERS.find(p => p.id === id);
            if (staticPartner) {
                return {
                    ...staticPartner,
                    notes: 'Automatically added supplier',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    deleted_at: null,
                    archived_at: null,
                    created_by: 0,
                    archived_by: null,
                    previous_id: null
                } as Partner;
            }
        }
        const response = await axiosInstance.get(`/partners/${id}`);
        return response.data;
    },

    // Create partner
    createPartner: async (data: CreatePartnerRequest): Promise<Partner> => {
        const response = await axiosInstance.post('/partners', data);
        return response.data;
    },

    // Update partner
    updatePartner: async (id: number, data: UpdatePartnerRequest): Promise<Partner> => {
        const response = await axiosInstance.put(`/partners/${id}`, data);
        return response.data;
    },

    // Delete partner
    deletePartner: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/partners/${id}`);
    },

    // Get archived partners
    getArchivedPartners: async (q?: string): Promise<PartnerListItem[]> => {
        const response = await axiosInstance.get('/partners/archived', { params: { q } });
        return response.data;
    },

    // Restore partner
    restorePartner: async (id: number): Promise<Partner> => {
        const response = await axiosInstance.post(`/partners/${id}/restore`);
        return response.data;
    },

    // Get partner history
    getPartnerHistory: async (id: number): Promise<Partner[]> => {
        const response = await axiosInstance.get(`/partners/${id}/history`);
        return response.data;
    },

    // Revert to version
    revertPartner: async (id: number, version: number): Promise<Partner> => {
        const response = await axiosInstance.post(`/partners/${id}/revert/${version}`);
        return response.data;
    },
};
