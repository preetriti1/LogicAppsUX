import type { Workflow } from '../../../common/models/workflow';
import { getMDTable } from './markdown';

export const getWorkflowPropertiesTable = (workflow?: Workflow) => {
  return getMDTable(
    [
      ['1', 'Workflow kind', _getWorkflowKind(workflow)],
      ['2', 'Connector type - In App', 'TODO'],
      ['3', 'Connector type - Shared', 'TODO'],
      ['4', 'Connector type - Custom', 'TODO'],
      ['5', 'API Connections', _getNumberOfApiConnections(workflow)?.toString()],
    ],
    ['', 'Workflow Properties', 'Value']
  );
};

export const _getWorkflowKind = (workflow?: Workflow): string => {
  return workflow?.kind ?? '';
};

//TODO: Elaina -> returning dummy value
export const _getNumberOfApiConnections = (workflow?: Workflow): number => {
  return workflow ? 1 : 0;
};
