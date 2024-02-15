import type { Workflow } from '../../../common/models/workflow';
import { DOC_HEADING } from './constants';

export const getDocumentationTemplate = (workflow?: Workflow) => {
  let documentationTemplate = DOC_HEADING.SUMMARY;
  documentationTemplate += '[TODO: an overview of what the workflow does]';
  documentationTemplate += workflow?.definition.$schema;

  return documentationTemplate;
};
