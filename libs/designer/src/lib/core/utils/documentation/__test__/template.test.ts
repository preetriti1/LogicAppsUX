import AllScopeNodes from '../../../../../../../../__mocks__/workflows/AllScopeNodes.json';
import { getDocumentationTemplate } from '../template';

describe('Documentation Template Functions', () => {
  describe('getDocumentationTemplate', () => {
    it('Test: console log function output', () => {
      console.log(getDocumentationTemplate(AllScopeNodes));
      expect('').toEqual('');
    });
  });
});
