import type { Workflow } from '../../../common/models/workflow';
import { DOC_HEADING, DOC_SUB_HEADING, MD_SYNTAX } from './constants';
import { getMDHeadingFormat, getMDSubHeadingFormat } from './markdown';
import { getWorkflowPropertiesTable } from './workflowProperties';

export const getDocumentationTemplate = (workflow?: Workflow) => {
  let documentationTemplate = getMDHeadingFormat(DOC_HEADING.SUMMARY);
  documentationTemplate += `${MD_SYNTAX.lineBreak}[TODO: an overview of what the workflow does]`;
  documentationTemplate += getWorkflowPropertiesTable(workflow);
  documentationTemplate += MD_SYNTAX.lineBreak;
  documentationTemplate += getMDHeadingFormat(DOC_HEADING.WORKFLOW_STEPS);
  documentationTemplate += MD_SYNTAX.lineBreak;
  documentationTemplate += getMDSubHeadingFormat(DOC_SUB_HEADING.HOW_WORKFLOW_STARTS);
  documentationTemplate += MD_SYNTAX.lineBreak;

  return documentationTemplate;
};

//TODO: Elaina - figuring the best way to loop on actions since actions is not an array
// export const getActionsTemplate = ()

//TODO: Elaina - figuring the best way to loop on trigger (or if there is a single trigger) since actions is not an array
// export const getTriggerTemplate = ()
