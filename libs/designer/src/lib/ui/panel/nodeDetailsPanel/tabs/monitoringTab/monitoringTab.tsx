import constants from '../../../../../common/constants';
import { getMonitoringTabError } from '../../../../../common/utilities/error';
import { useBrandColor } from '../../../../../core/state/operation/operationSelector';
import { useSelectedNodeId } from '../../../../../core/state/panel/panelSelectors';
import { useRunData } from '../../../../../core/state/workflow/workflowSelectors';
import { InputsPanel } from './inputsPanel';
import { OutputsPanel } from './outputsPanel';
import { PropertiesPanel } from './propertiesPanel';
import { RunService, WorkflowService, isNullOrUndefined } from '@microsoft/logic-apps-shared';
import { ErrorSection } from '@microsoft/designer-ui';
import type { PanelTabFn } from '@microsoft/designer-ui';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Button } from '@fluentui/react-components';
import { useIntl } from 'react-intl';

export const MonitoringPanel: React.FC = () => {
  const selectedNodeId = useSelectedNodeId();
  const brandColor = useBrandColor(selectedNodeId);
  const runMetaData = useRunData(selectedNodeId);
  const { status: statusRun, error: errorRun, code: codeRun } = runMetaData ?? {};
  const error = getMonitoringTabError(errorRun, statusRun, codeRun);

  const getActionInputsOutputs = () => {
    return RunService().getActionLinks(runMetaData, selectedNodeId);
  };

  const {
    data: inputOutputs,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery<any>(['actionInputsOutputs', { nodeId: selectedNodeId }], getActionInputsOutputs, {
    refetchOnWindowFocus: false,
    initialData: { inputs: {}, outputs: {} },
  });

  const runId = inputOutputs.outputs.headers?.value?.['x-ms-workflow-run-id'];
  const canOpenNestedRun = !isNullOrUndefined(runId); // add type check for selectedNodeId (workflow type)
  useEffect(() => {
    refetch();
  }, [runMetaData, refetch]);
  const intl = useIntl();
  const openRunDetails = intl.formatMessage({
    defaultMessage: 'Show Logic Apps run details',
    id: 'ibdoS4',
    description: 'Button label for opening the logic app details page for the run',
  });

  return isNullOrUndefined(runMetaData) ? null : (
    <div>
      {canOpenNestedRun && (
        <Button style={{ marginLeft: '19px' }} onClick={() => WorkflowService().openWorkflowRun?.(`${selectedNodeId}/runs/${runId}`)}>
          {openRunDetails}
        </Button>
      )}

      <ErrorSection error={error} />
      <InputsPanel
        runMetaData={runMetaData}
        brandColor={brandColor}
        isLoading={isFetching || isLoading}
        isError={isError}
        nodeId={selectedNodeId}
        values={inputOutputs.inputs}
      />
      <OutputsPanel
        runMetaData={runMetaData}
        brandColor={brandColor}
        isLoading={isFetching || isLoading}
        isError={isError}
        nodeId={selectedNodeId}
        values={inputOutputs.outputs}
      />
      <PropertiesPanel properties={runMetaData} brandColor={brandColor} nodeId={selectedNodeId} />
    </div>
  );
};

export const monitoringTab: PanelTabFn = (intl) => ({
  id: constants.PANEL_TAB_NAMES.MONITORING,
  title: intl.formatMessage({
    defaultMessage: 'Parameters',
    id: 'xi2tn6',
    description: 'The tab label for the monitoring parameters tab on the operation panel',
  }),
  description: intl.formatMessage({
    defaultMessage: 'Monitoring Tab',
    id: 'l536iI',
    description: 'An accessability label that describes the monitoring tab',
  }),
  visible: true,
  content: <MonitoringPanel />,
  order: 0,
  icon: 'Info',
});
