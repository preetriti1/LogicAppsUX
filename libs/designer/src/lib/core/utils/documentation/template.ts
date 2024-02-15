import type { Workflow } from '../../../common/models/workflow';
import { DOC_HEADING, MD_SYNTAX } from './constants';
import { getWorkflowPropertiesTable } from './workflowProperties';

export const getDocumentationTemplate = (workflow?: Workflow) => {
  let documentationTemplate = DOC_HEADING.SUMMARY;
  documentationTemplate += `${MD_SYNTAX.lineBreak}[TODO: an overview of what the workflow does]`;
  //   documentationTemplate += workflow?.definition.$schema;
  documentationTemplate += getWorkflowPropertiesTable(workflow);
  return documentationTemplate;
};
