import type { Workflow } from '../../../common/models/workflow';
import type { NodeOperation } from '../../state/operation/operationMetadataSlice';
import type { NodeTokens } from '../../state/tokens/tokensSlice';
import { getConnectorCategoryString } from '@microsoft/designer-ui';

export interface OperationMetadata {
  connectorCategoryString?: string;
  outputTokenIds: string[];
}

export interface SummaryMetadata {
  connectorCountByTypes: {
    [connectorCategory: string]: number;
  };
}

export interface DocumentationMetadataState {
  operationsMetadata: Record<string, OperationMetadata>;
  summary: SummaryMetadata;
}

export interface DocumentationRequestBody {
  createTime: string;
  queryId: string;
  queryType: 'documentation';
  query: {
    workflow: Workflow;
    operationsData: DocumentationMetadataState;
  };
}

export const getBackendResponse = async (documentRequestBody: DocumentationRequestBody) => {
  console.log(JSON.stringify(documentRequestBody));
  // const res = await axios.post("http://localhost:64648/api/query?api-version=2", documentRequestBody, {
  //   headers: {
  //     "Access-Control-Allow-Origin": "*"
  //   },
  // }, );
  // return res.data;
};

export const getSampleRequestBody = (
  workflow: Workflow,
  operationInfo: Record<string, NodeOperation>,
  outputTokens: Record<string, NodeTokens>,
  workflowKind?: string
): DocumentationRequestBody => {
  return {
    createTime: '2023-12-14T18:48:50.756Z',
    queryId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    queryType: 'documentation',
    query: {
      workflow: {
        kind: workflowKind,
        ...workflow,
      },
      operationsData: getDocumentationMetadata(operationInfo, outputTokens),
    },
  };
};

export const getDocumentationMetadata = (
  operationInfo: Record<string, NodeOperation>,
  outputTokens: Record<string, NodeTokens>
): DocumentationMetadataState => {
  const summary: SummaryMetadata = {
    connectorCountByTypes: {},
  };
  const operationsMetadata = Object.keys(operationInfo).reduce(
    (operationDocMetadata: Record<string, OperationMetadata>, nodeId: string) => {
      const connectorCategoryInString = getConnectorCategoryString(operationInfo[nodeId].connectorId);
      summary.connectorCountByTypes[connectorCategoryInString] = (summary.connectorCountByTypes[connectorCategoryInString] ?? 0) + 1;

      return {
        ...operationDocMetadata,
        [nodeId]: {
          connectorCategoryString: connectorCategoryInString,
          outputTokenIds: outputTokens[nodeId]?.upstreamNodeIds,
        },
      };
    },
    {}
  );

  return {
    operationsMetadata: operationsMetadata,
    summary: summary,
  };
};
