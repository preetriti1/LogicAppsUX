import type { NodeOperation } from '../../state/operation/operationMetadataSlice';
import { getConnectorCategoryString } from '@microsoft/designer-ui';

export interface OperationMetadata {
  connectorCategoryString?: string;
}

export interface SummaryMetadata {
  connectorCountByTypes: {
    [connectorCategory: string]: number;
  };
  apiConnectionsCount: number;
}

export interface DocumentationMetadataState {
  operationsMetadata: Record<string, OperationMetadata>;
  summary: SummaryMetadata;
}

export const getDocumentationMetadata = (operationInfo: Record<string, NodeOperation>): DocumentationMetadataState => {
  const summary: SummaryMetadata = {
    connectorCountByTypes: {},
    apiConnectionsCount: 0,
  };
  const operationsMetadata = Object.keys(operationInfo).reduce(
    (operationDocMetadata: Record<string, OperationMetadata>, nodeId: string) => {
      const connectorCategoryInString = getConnectorCategoryString(operationInfo[nodeId].connectorId);
      summary.connectorCountByTypes[connectorCategoryInString] = (summary.connectorCountByTypes[connectorCategoryInString] ?? 0) + 1;

      return {
        ...operationDocMetadata,
        [nodeId]: { connectorCategoryString: connectorCategoryInString },
      };
    },
    {}
  );

  return {
    operationsMetadata: operationsMetadata,
    summary: summary,
  };
};
