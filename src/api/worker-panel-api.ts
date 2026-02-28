import type {
    PlanItem,
    GetMyBrigadaParams,
    GetMyMaterialsParams,
    MyMaterialsTransaction,
} from 'src/types/worker-panel';

import axiosInstance from 'src/lib/axios';

export const workerPanelApi = {
    getMyBrigadaPlanItems: async (params?: GetMyBrigadaParams): Promise<PlanItem[]> => {
        const response = await axiosInstance.get('/plan-items/my-brigada', { params });
        return response.data;
    },

    getMyMaterials: async (params?: GetMyMaterialsParams): Promise<MyMaterialsTransaction[]> => {
        const response = await axiosInstance.get('/pechat/my-materials', { params });
        return response.data;
    },
};
