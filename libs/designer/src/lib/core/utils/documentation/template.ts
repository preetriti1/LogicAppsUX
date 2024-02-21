import type { Workflow } from '../../../common/models/workflow';

// import { DOC_HEADING, DOC_SUB_HEADING, MD_SYNTAX } from './constants';
// import { getMDHeadingFormat, getMDSubHeadingFormat } from './markdown';
// import { getWorkflowPropertiesTable } from './workflowProperties';
// import { useConnectorName, useNodeConnectionName, useOperationInfo } from '../../state/selectors/actionMetadataSelector';

export const getDocumentationTemplate = (workflow?: Workflow) => {
  //   let documentationTemplate = getMDHeadingFormat(DOC_HEADING.SUMMARY);
  //documentationTemplate += `${MD_SYNTAX.lineBreak}[TODO: an overview of what the workflow does]`;
  //   loopThroughActions(workflow?.definition.actions);
  //documentationTemplate += getWorkflowPropertiesTable(workflow);
  //documentationTemplate += MD_SYNTAX.lineBreak;
  //documentationTemplate += getMDHeadingFormat(DOC_HEADING.WORKFLOW_STEPS);
  //documentationTemplate += MD_SYNTAX.lineBreak;
  //documentationTemplate += getMDSubHeadingFormat(DOC_SUB_HEADING.HOW_WORKFLOW_STARTS);
  //documentationTemplate += MD_SYNTAX.lineBreak;

  injectConnectorTypesInActions(workflow?.definition.actions);

  return '';
};

export const injectConnectorTypesInActions = (actions?: any): any => {
  // let actionsDocumentation  = "";

  for (const actionName in actions) {
    console.log(actionName, actions[actionName]);
    // useNodeConnectionName(actionName);
    // actionsDocumentation += MD_SYNTAX.lineBreak;
  }

  return '';
};

// interface DocumentationData {
//     connectorTypeCount: {
//         inAppCount: number;
//         sharedCount: number;
//         customCount: number;
//     };
//     actionDocumentation: string;
// }

// export const loopThroughActions = (actions?: Actions): DocumentationData => {
//     let actionsDocumentation  = "";

//     for (const actionName in actions) {
//         console.log(actionName, actions[actionName])
//         actionsDocumentation += MD_SYNTAX.lineBreak;

//     }

//     return {
//         connectorTypeCount: {
//             inAppCount: 0,
//             sharedCount: 0,
//             customCount: 0
//         },
//         actionDocumentation: actionsDocumentation,
//     }
// }

// export const documentAction = (actionName: string, actionInputs: string) => {
//     let actionDocumentation = "";
//     actionDocumentation += `Action Name: ${actionName}`;
//     actionDocumentation += MD_SYNTAX.lineBreak;
//     //TODO: get action type somehow
//     const actionType = "TODO: actionType";
//     actionDocumentation += `Action Type: ${actionType}`;
//     actionDocumentation += MD_SYNTAX.lineBreak;
//     return actionDocumentation;
// }

// Iteration of the Graph 1
//TODO: Elaina - figuring the best way to loop on actions since actions is not an array
// export const getActionsTemplate = ()

// Iteration of the Graph 2
// total number of ApiConnection

//TODO: Elaina - figuring the best way to loop on trigger (or if there is a single trigger) since actions is not an array
// export const getTriggerTemplate = ()
