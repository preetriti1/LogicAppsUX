import axios from 'axios';
import { environment } from '../../../../environments/environment';
import type { Data as FetchLogicAppsData } from '../Models/LogicAppAppTypes';
import { fetchAppsByQuery } from '../Utilities/resourceUtilities';
import { useQuery } from '@tanstack/react-query';
import type { RunList, WorkflowList } from '../Models/WorkflowListTypes';
import { mockHybridResourceId, mockHybridUri } from '../../../../environments/mockHybrid';

export const useFetchStandardApps = (hybrid?: boolean) => {
  return useQuery<FetchLogicAppsData[]>(
    ['listAllLogicApps', 'standard', hybrid],
    async () => {
      if (!environment.armToken) {
        return [];
      }
      const query = hybrid
        ? // ? `resources | where type == "microsoft.app/logicapps" and kind contains "workflowapp"`\
          `resources | where type == "microsoft.web/sites" and kind contains "workflowapp"`
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

export const useFetchStandardWorkflows = (validApp: boolean, appId?: string, hybrid?: boolean) => {
  return useQuery<WorkflowList | null>(['getListOfWorkflows', appId, hybrid], async () => {
    if (!appId || (!validApp && !hybrid)) {
      return null;
    }
    // temporarily using a mock api for hybrid logic apps
    // const hybridResourceId = new ArmParser(appId).hybridResourceId;
    //? `https://management.azure.com/${hybridResourceId}/workflows?api-version=2024-02-02-preview`
    const uri = hybrid
      ? `${mockHybridUri}/${mockHybridResourceId}/workflows?api-version=2024-02-02-preview`
      : `https://management.azure.com${appId}/workflows?api-version=2018-11-01`;
    const results = await axios.get<WorkflowList>(uri, {
      headers: {
        Authorization: `Bearer ${environment.armToken}`,
      },
    });
    return results.data;
  });
};

export const useFetchRunInstances = (
  validApp: boolean,
  appId?: string,
  workflowName?: string,
  isMonitoringView?: boolean,
  hybrid?: boolean
) => {
  return useQuery<RunList | null>(
    ['getListOfRunInstances', appId, workflowName, hybrid],
    async () => {
      console.log(validApp, workflowName, isMonitoringView, hybrid);
      if ((!validApp && !hybrid) || !workflowName || !isMonitoringView) {
        return null;
      }

      if (hybrid) {
        // temporarily using a mock api for hybrid logic apps
        // const hybridResourceId = new ArmParser(appId).hybridResourceId;
        //? `https://management.azure.com/${hybridResourceId}/invoke?api-version=2024-02-02-preview`
        const results = await axios.post<RunList>(`${mockHybridUri}/${mockHybridResourceId}/invoke?api-version=2024-02-02-preview`, null, {
          headers: {
            Authorization: `Bearer ${environment.armToken}`,
            'x-logicapps-proxy-path': `/runtime/webhooks/workflow/api/management/workflows/${workflowName}/runs`,
            'x-logicapps-proxy-method': 'GET',
          },
        });
        return results.data;
      }
      const results = await axios.get<RunList>(
        `https://management.azure.com${appId}/hostruntime/runtime/webhooks/workflow/api/management/workflows/${workflowName}/runs?api-version=2018-11-01`,
        {
          headers: { Authorization: `Bearer ${environment.armToken}` },
        }
      );
      return results.data;
    },
    { enabled: !!workflowName && !!isMonitoringView }
  );
};
