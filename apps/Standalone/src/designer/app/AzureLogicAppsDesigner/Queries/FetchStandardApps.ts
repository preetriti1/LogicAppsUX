import axios from 'axios';
import { environment } from '../../../../environments/environment';
import type { Data as FetchLogicAppsData } from '../Models/LogicAppAppTypes';
import { fetchAppsByQuery } from '../Utilities/resourceUtilities';
import { useQuery } from '@tanstack/react-query';
import type { WorkflowList } from '../Models/WorkflowListTypes';
import { ArmParser } from '../Utilities/ArmParser';

export const useFetchStandardApps = (isHybridLogicAppsEnabled?: boolean) => {
  return useQuery<FetchLogicAppsData[]>(
    ['listAllLogicApps', 'standard', isHybridLogicAppsEnabled],
    async () => {
      if (!environment.armToken) {
        return [];
      }
      const query = isHybridLogicAppsEnabled
        ? `resources | where type == "Microsoft.App/logicApps" and kind contains "workflowapp"`
        : `resources | where type == "microsoft.web/sites" and kind contains "workflowapp"`;
      const data = await fetchAppsByQuery(query);
      return data.map((item: any) => ({
        id: item[0],
        name: item[1],
        location: item[5],
        resourceGroup: item[6],
        subscriptionId: item[7],
        properties: item[11],
      }));
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
};

export const useFetchStandardWorkflows = (validApp: boolean, appId?: string, isHybridLogicAppsEnabled?: boolean) => {
  return useQuery<WorkflowList | null>(['getListOfWorkflows', appId, isHybridLogicAppsEnabled], async () => {
    if (!appId || !validApp) {
      return null;
    }
    const { subscriptionId, resourceGroup, provider, topResourceName } = new ArmParser(appId);
    const uri = isHybridLogicAppsEnabled
      ? `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/${provider}/containerApps/${topResourceName}/providers/${provider}/logicapps/${topResourceName}/workflows?api-version=2024-02-02-preview`
      : `https://management.azure.com${appId}/workflows?api-version=2018-11-01`;
    const results = await axios.get<WorkflowList>(uri, {
      headers: {
        Authorization: `Bearer ${environment.armToken}`,
      },
    });
    return results.data;
  });
};
