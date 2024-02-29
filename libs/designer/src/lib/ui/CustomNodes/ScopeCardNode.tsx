import constants from '../../common/constants';
import { getMonitoringError } from '../../common/utilities/error';
import { moveOperation } from '../../core/actions/bjsworkflow/move';
import { useMonitoringView, useReadOnly } from '../../core/state/designerOptions/designerOptionsSelectors';
import { setShowDeleteModal } from '../../core/state/designerView/designerViewSlice';
import { useBrandColor, useIconUri, useParameterValidationErrors } from '../../core/state/operation/operationSelector';
import { useIsNodeSelected } from '../../core/state/panel/panelSelectors';
import { changePanelNode, setSelectedNodeId } from '../../core/state/panel/panelSlice';
import { useAllOperations, useOperationQuery } from '../../core/state/selectors/actionMetadataSelector';
import { useSettingValidationErrors } from '../../core/state/setting/settingSelector';
import {
  useActionMetadata,
  useIsGraphCollapsed,
  useIsLeafNode,
  useNodeDisplayName,
  useNodeMetadata,
  useNodesMetadata,
  useRunData,
  useParentRunIndex,
  useRunInstance,
  useParentRunId,
} from '../../core/state/workflow/workflowSelectors';
import { setRepetitionRunData, toggleCollapsedGraphId } from '../../core/state/workflow/workflowSlice';
import type { AppDispatch } from '../../core/store';
import { LoopsPager } from '../common/LoopsPager/LoopsPager';
import { getRepetitionName } from '../common/LoopsPager/helper';
import { DropZone } from '../connections/dropzone';
import { DeleteMenuItem } from '../menuItems/deleteMenuItem';
import { ResubmitMenuItem } from '../menuItems/resubmitMenuItem';
import { MessageBarType } from '@fluentui/react';
import { RunService, WorkflowService } from '@microsoft/designer-client-services-logic-apps';
import { ScopeCard } from '@microsoft/designer-ui';
import type { LogicAppsV2 } from '@microsoft/logic-apps-shared';
import { removeIdTag } from '@microsoft/logic-apps-shared';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ScopeCardNode = ({ data, targetPosition = Position.Top, sourcePosition = Position.Bottom, id }: NodeProps) => {
  const scopeId = removeIdTag(id);

  const node = useActionMetadata(scopeId);
  const operationsInfo = useAllOperations();

  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const readOnly = useReadOnly();
  const isMonitoringView = useMonitoringView();

  const metadata = useNodeMetadata(scopeId);
  const parentRunIndex = useParentRunIndex(scopeId);
  const runInstance = useRunInstance();
  const runData = useRunData(scopeId);
  const parentRunId = useParentRunId(scopeId);
  const parenRunData = useRunData(parentRunId ?? '');
  const nodesMetaData = useNodesMetadata();
  const repetitionName = getRepetitionName(parentRunIndex, scopeId, nodesMetaData, operationsInfo);

  const { status: statusRun, error: errorRun, code: codeRun, repetitionCount } = runData ?? {};

  const getRunRepetition = () => {
    if (parenRunData?.status === constants.FLOW_STATUS.SKIPPED) {
      return {
        properties: {
          status: constants.FLOW_STATUS.SKIPPED,
          inputsLink: null,
          outputsLink: null,
          startTime: null,
          endTime: null,
          trackingId: null,
          correlation: null,
        },
      };
    }
    return RunService().getRepetition({ nodeId: scopeId, runId: runInstance?.id }, repetitionName);
  };

  const onRunRepetitionSuccess = async (runDefinition: LogicAppsV2.RunRepetition) => {
    dispatch(setRepetitionRunData({ nodeId: scopeId, runData: runDefinition.properties as LogicAppsV2.WorkflowRunAction }));
  };

  const {
    refetch,
    isLoading: isRepetitionLoading,
    isRefetching: isRepetitionRefetching,
  } = useQuery<any>(
    ['runInstance', { nodeId: scopeId, runId: runInstance?.id, repetitionName, parentStatus: parenRunData?.status }],
    getRunRepetition,
    {
      refetchOnWindowFocus: false,
      initialData: null,
      refetchOnMount: true,
      onSuccess: onRunRepetitionSuccess,
      enabled: parentRunIndex !== undefined && isMonitoringView && repetitionCount !== undefined,
    }
  );

  useEffect(() => {
    if (parentRunIndex !== undefined && isMonitoringView) {
      refetch();
    }
  }, [dispatch, parentRunIndex, isMonitoringView, refetch, repetitionName, parenRunData?.status]);

  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: 'BOX',
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<{
          graphId: string;
          parentId: string;
          childId: string;
        }>();
        if (item && dropResult) {
          dispatch(
            moveOperation({
              nodeId: scopeId,
              oldGraphId: metadata?.graphId ?? 'root',
              newGraphId: dropResult.graphId,
              relationshipIds: dropResult,
            })
          );
        }
      },
      item: {
        id: scopeId,
      },
      canDrag: !readOnly,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [readOnly, metadata]
  );

  const selected = useIsNodeSelected(scopeId);
  const brandColor = useBrandColor(scopeId);
  const iconUri = useIconUri(scopeId);
  const isLeaf = useIsLeafNode(id);

  const label = useNodeDisplayName(scopeId);
  const nodeClick = useCallback(() => {
    dispatch(changePanelNode(scopeId));
  }, [dispatch, scopeId]);

  const graphCollapsed = useIsGraphCollapsed(scopeId);
  const handleGraphCollapse = useCallback(() => {
    dispatch(toggleCollapsedGraphId(scopeId));
  }, [dispatch, scopeId]);

  const deleteClick = useCallback(() => {
    dispatch(setSelectedNodeId(id));
    dispatch(setShowDeleteModal(true));
  }, [dispatch, id]);

  const resubmitClick = useCallback(() => {
    WorkflowService().resubmitWorkflow?.(runInstance?.name ?? '', [id]);
  }, [runInstance, id]);

  const contextMenuItems: JSX.Element[] = useMemo(
    () => [
      <DeleteMenuItem key={'delete'} onClick={deleteClick} showKey />,
      ...(runData?.canResubmit ? [<ResubmitMenuItem key={'resubmit'} onClick={resubmitClick} />] : []),
    ],
    [deleteClick, resubmitClick, runData?.canResubmit]
  );

  const opQuery = useOperationQuery(scopeId);

  const isLoading = useMemo(
    () => isRepetitionLoading || isRepetitionRefetching || opQuery.isLoading || (!brandColor && !iconUri),
    [brandColor, iconUri, opQuery.isLoading, isRepetitionLoading, isRepetitionRefetching]
  );

  const opManifestErrorText = intl.formatMessage({
    defaultMessage: 'Error fetching manifest',
    description: 'Error message when manifest fails to load',
  });

  const settingValidationErrors = useSettingValidationErrors(scopeId);
  const settingValidationErrorText = intl.formatMessage({
    defaultMessage: 'Invalid settings',
    description: 'Text to explain that there are invalid settings for this node',
  });

  const parameterValidationErrors = useParameterValidationErrors(scopeId);
  const parameterValidationErrorText = intl.formatMessage({
    defaultMessage: 'Invalid parameters',
    description: 'Text to explain that there are invalid parameters for this node',
  });

  const { errorMessage, errorLevel } = useMemo(() => {
    if (opQuery?.isError) return { errorMessage: opManifestErrorText, errorLevel: MessageBarType.error };
    if (settingValidationErrors?.length > 0) return { errorMessage: settingValidationErrorText, errorLevel: MessageBarType.severeWarning };
    if (parameterValidationErrors?.length > 0)
      return { errorMessage: parameterValidationErrorText, errorLevel: MessageBarType.severeWarning };

    if (isMonitoringView) {
      return getMonitoringError(errorRun, statusRun, codeRun);
    }

    return { errorMessage: undefined, errorLevel: undefined };
  }, [
    opQuery?.isError,
    opManifestErrorText,
    settingValidationErrors?.length,
    settingValidationErrorText,
    parameterValidationErrors?.length,
    parameterValidationErrorText,
    errorRun,
    isMonitoringView,
    codeRun,
    statusRun,
  ]);

  if (!node) {
    return null;
  }

  const normalizedType = node?.type.toLowerCase();
  const actionCount = metadata?.actionCount ?? 0;

  const actionString = intl.formatMessage(
    {
      defaultMessage: '{actionCount, plural, one {# Action} =0 {0 Actions} other {# Actions}}',
      description: 'This is the number of actions to be completed in a group',
    },
    { actionCount }
  );

  const caseString = intl.formatMessage(
    {
      defaultMessage: '{actionCount, plural, one {# Case} =0 {0 Cases} other {# Cases}}',
      description: 'This is the number of cases or options the program can take',
    },
    { actionCount }
  );

  const collapsedText =
    normalizedType === constants.NODE.TYPE.SWITCH || normalizedType === constants.NODE.TYPE.IF ? caseString : actionString;

  const isFooter = id.endsWith('#footer');
  const showEmptyGraphComponents = isLeaf && !graphCollapsed && !isFooter;

  const implementedGraphTypes = [
    constants.NODE.TYPE.IF,
    constants.NODE.TYPE.SWITCH,
    constants.NODE.TYPE.FOREACH,
    constants.NODE.TYPE.SCOPE,
    constants.NODE.TYPE.UNTIL,
  ];
  if (implementedGraphTypes.includes(normalizedType)) {
    return (
      <>
        <div className="msla-scope-card nopan">
          <Handle className="node-handle top" type="target" position={targetPosition} isConnectable={false} />
          <ScopeCard
            brandColor={brandColor}
            icon={iconUri}
            isLoading={isLoading}
            collapsed={graphCollapsed}
            handleCollapse={handleGraphCollapse}
            drag={drag}
            draggable={!readOnly}
            dragPreview={dragPreview}
            errorLevel={errorLevel}
            errorMessage={errorMessage}
            isDragging={isDragging}
            id={scopeId}
            isMonitoringView={isMonitoringView}
            title={label}
            readOnly={readOnly}
            onClick={nodeClick}
            onDeleteClick={deleteClick}
            selected={selected}
            contextMenuItems={contextMenuItems}
            runData={runData}
          />
          {isMonitoringView && normalizedType === constants.NODE.TYPE.FOREACH ? (
            <LoopsPager metadata={metadata} scopeId={scopeId} collapsed={graphCollapsed} />
          ) : null}
          <Handle className="node-handle bottom" type="source" position={sourcePosition} isConnectable={false} />
        </div>
        {graphCollapsed && !isFooter ? <p className="no-actions-text">{collapsedText}</p> : null}
        {showEmptyGraphComponents ? (
          !readOnly ? (
            <div className={'edge-drop-zone-container'}>
              <DropZone graphId={scopeId} parentId={id} isLeaf={isLeaf} />
            </div>
          ) : (
            <p className="no-actions-text">No Actions</p>
          )
        ) : null}
      </>
    );
  } else {
    return <h1>{'GENERIC'}</h1>;
  }
};

ScopeCardNode.displayName = 'ScopeNode';

export default memo(ScopeCardNode);
