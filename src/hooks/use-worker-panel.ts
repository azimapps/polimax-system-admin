import type { GetMyBrigadaParams, GetMyMaterialsParams } from 'src/types/worker-panel';

import { useQuery } from '@tanstack/react-query';

import { workerPanelApi } from 'src/api/worker-panel-api';

const QUERY_KEYS = {
    planItems: (params: GetMyBrigadaParams) => ['plan-items', params],
    materials: (params: GetMyMaterialsParams) => ['my-materials', params],
};

export function useGetMyBrigadaPlanItems(params: GetMyBrigadaParams) {
    return useQuery({
        queryKey: QUERY_KEYS.planItems(params),
        queryFn: () => workerPanelApi.getMyBrigadaPlanItems(params),
        retry: false,
    });
}

export function useGetMyMaterials(params: GetMyMaterialsParams) {
    return useQuery({
        queryKey: QUERY_KEYS.materials(params),
        queryFn: () => workerPanelApi.getMyMaterials(params),
        retry: false,
    });
}
