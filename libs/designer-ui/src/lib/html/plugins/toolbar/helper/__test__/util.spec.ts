import {
  cleanHtmlString,
  cleanStyleAttribute,
  decodeSegmentValueInDomContext,
  decodeSegmentValueInLexicalContext,
  encodeSegmentValueInDomContext,
  encodeSegmentValueInLexicalContext,
  isAttributeSupportedByHtmlEditor,
  isHtmlStringValueSafeForLexical,
  isTagNameSupportedByLexical,
} from '../util';
import type { ValueSegment } from '@microsoft/logic-apps-shared';
import { describe, vi, beforeEach, afterEach, beforeAll, afterAll, it, test, expect } from 'vitest';
describe('lib/html/plugins/toolbar/helper/util', () => {
  describe('cleanHtmlString', () => {
    it.each([
      ['<p class="editor-paragraph"><br></p>', '<p class="editor-paragraph"><br></p>'],
      ['<p>text1<span>\n</span>text2</p>', '<p>text1<br>text2</p>'],
      ['<p>line1<span>\n</span>line2<span>\n\n</span>line3<span>\n\n</span>line4</p>', '<p>line1<br>line2<br><br>line3<br><br>line4</p>'],
      ['<p>text</p>', '<p>text</p>'],
      ['<p>text1</p><p><br></p><p>text2</p>', '<p>text1</p><br><p>text2</p>'],
      ['<p>text1<br></p><p><br></p><p>text2</p>', '<p>text1</p><br><br><p>text2</p>'],
      ['<span>text</span>', 'text'],
      ['<span id="$[abc,variables(\'abc\'),#770bd6]$">text</span>', '<span id="$[abc,variables(\'abc\'),#770bd6]$">text</span>'],
      ['<span id="$[concat(),concat(\'&lt;\'),#ad008c]$">text</span>', '<span id="$[concat(),concat(\'&lt;\'),#ad008c]$">text</span>'],
      ['<span id="$[concat(),concat(\'%26lt;\'),#ad008c]$">text</span>', '<span id="$[concat(),concat(\'%26lt;\'),#ad008c]$">text</span>'],
      ['<span id="@{variables(\'abc\')}">text</span>', '<span id="@{variables(\'abc\')}">text</span>'],
      ['<span id="@{concat(\'&lt;\')}">text</span>', '<span id="@{concat(\'&lt;\')}">text</span>'],
      ['<span id="@{concat(\'%26lt;\')}">text</span>', '<span id="@{concat(\'%26lt;\')}">text</span>'],
    ])('should properly convert HTML: "%s"', (input, expected) => {
      expect(cleanHtmlString(input)).toBe(expected);
    });
  });

  describe('cleanStyleAttribute', () => {
    it.each<[string, string | undefined]>([
      ['', undefined],
      ['white-space: pre-wrap;', undefined],
      ['color: red; white-space: pre-wrap;', 'color: red;'],
      ['white-space: pre-wrap; color: red;', 'color: red;'],
    ])('should return style="%s" as "%s"', (input, expected) => {
      expect(cleanStyleAttribute(input)).toBe(expected);
    });
  });

  describe('decodeSegmentValueInDomContext', () => {
    it.each([
      ['plain text', 'plain text'],
      ['text with <>', 'text with <>'],
      ['text with %3C%3E', 'text with <>'],
      ["$[concat(...),concat('abc'),#AD008C]$", "$[concat(...),concat('abc'),#AD008C]$"],
      ["$[concat(...),concat('%3C()%3E'),#AD008C]$", "$[concat(...),concat('<()>'),#AD008C]$"],
      ["@{concat('abc')}", "@{concat('abc')}"],
      ["@{concat('%3C()%3E')}", "@{concat('<()>')}"],
    ])('should properly decode segments in: "%s"', (input, expected) => {
      expect(decodeSegmentValueInDomContext(input)).toBe(expected);
    });
  });

  describe('encodeSegmentValueInDomContext', () => {
    it.each([
      ['plain text', 'plain text'],
      ['text with <>', 'text with %3C%3E'],
      ['text with %3C%3E', 'text with %3C%3E'],
      ["$[concat(...),concat('abc'),#AD008C]$", "$[concat(...),concat('abc'),#AD008C]$"],
      ["$[concat(...),concat('<()>'),#AD008C]$", "$[concat(...),concat('%3C()%3E'),#AD008C]$"],
      ["@{concat('abc')}", "@{concat('abc')}"],
      ["@{concat('<()>')}", "@{concat('%3C()%3E')}"],
    ])('should properly encode segments in: "%s"', (input, expected) => {
      expect(encodeSegmentValueInDomContext(input)).toBe(expected);
    });
  });

  describe('decodeSegmentValueInLexicalContext', () => {
    it.each([
      ['plain text', 'plain text'],
      ['text with %26lt;%26gt;', 'text with &lt;&gt;'],
      ['text with %26noIdeaWhatThisIs;', 'text with &noIdeaWhatThisIs;'],
      ['text with %26#60;%26gt;', 'text with &#60;&gt;'],
      ['text with %26amp;lt;%26amp;gt;', 'text with &amp;lt;&amp;gt;'],
      ['text with %22%26quot;%22', 'text with "&quot;"'],
      ["$[concat(...),concat('abc'),#AD008C]$", "$[concat(...),concat('abc'),#AD008C]$"],
      ["$[concat(...),concat('%26lt;'),#AD008C]$", "$[concat(...),concat('&lt;'),#AD008C]$"],
      ["$[concat(...),concat('%26amp;lt;'),#AD008C]$", "$[concat(...),concat('&amp;lt;'),#AD008C]$"],
      ["@{concat('abc')}", "@{concat('abc')}"],
      ["@{concat('%26lt;')}", "@{concat('&lt;')}"],
      ["@{concat('%26amp;lt;')}", "@{concat('&amp;lt;')}"],
    ])('should properly decode segments in: "%s"', (input, expected) => {
      expect(decodeSegmentValueInLexicalContext(input)).toBe(expected);
    });
  });

  describe('encodeSegmentValueInLexicalContext', () => {
    it.each([
      ['plain text', 'plain text'],
      ['text with &lt;&gt;', 'text with %26lt;%26gt;'],
      ['text with &noIdeaWhatThisIs;', 'text with %26noIdeaWhatThisIs;'],
      ['text with &#60;&gt;', 'text with %26#60;%26gt;'],
      ['text with &amp;lt;&amp;gt;', 'text with %26amp;lt;%26amp;gt;'],
      ['text with "&quot;"', 'text with %22%26quot;%22'],
      ["$[concat(...),concat('abc'),#AD008C]$", "$[concat(...),concat('abc'),#AD008C]$"],
      ["$[concat(...),concat('&lt;'),#AD008C]$", "$[concat(...),concat('%26lt;'),#AD008C]$"],
      ["$[concat(...),concat('&amp;lt;'),#AD008C]$", "$[concat(...),concat('%26amp;lt;'),#AD008C]$"],
      ["@{concat('abc')}", "@{concat('abc')}"],
      ["@{concat('&lt;')}", "@{concat('%26lt;')}"],
      ["@{concat('&amp;lt;')}", "@{concat('%26amp;lt;')}"],
    ])('should properly encode segments in: "%s"', (input, expected) => {
      expect(encodeSegmentValueInLexicalContext(input)).toBe(expected);
    });
  });

  describe('isAttributeSupportedByHtmlEditor', () => {
    it.each<[string, string, boolean]>([
      ['', 'href', false],
      ['a', 'class', true],
      ['a', '', false],
      ['a', 'href', true],
      ['a', 'id', true],
      ['a', 'style', true],
      ['span', 'class', true],
      ['span', 'cellpadding', false],
      ['span', 'href', false],
      ['span', 'id', true],
      ['span', 'style', true],
      ['p', 'class', true],
      ['p', 'cellpadding', false],
      ['p', 'href', false],
      ['p', 'id', true],
      ['p', 'style', true],
      ['img', 'class', true],
      ['img', 'id', true],
      ['img', 'alt', true],
      ['img', 'script', false],
      ['img', 'src', true],
      ['table', 'class', true],
      ['table', 'cellpadding', true],
    ])('should return <%s %s="..." /> as supported="%s"', (inputTag, inputAttr, expected) => {
      expect(isAttributeSupportedByHtmlEditor(inputTag, inputAttr)).toBe(expected);
    });
  });

  describe('isHtmlStringValueSafeForLexical', () => {
    const case1 = '';
    const case2 = '<h1>hello</h1>';
    const case3 = `<h3>dfg<span style="background-color: rgb(184, 233, 134);">dfg</span><span style="background-color: rgb(184, 233, 134); font-size: 11px;">dfg</span><a href="https://www.bing.com"><span style="background-color: rgb(184, 233, 134); font-family: Georgia; font-size: 11px;">dfgdfg dfgdfg dg zd</span></a><span style="background-color: rgb(184, 233, 134); font-family: Georgia; font-size: 11px;"> </span><u>asa</u></h3>`;
    const case4 = '<section>hello</section>';
    const case5 = `<p style="background-color: rgb(184, 233, 134);">hello</p>`;
    const case6 = '<p class="editor-paragraph">hello</p>';

    it.each<[string, boolean, string]>([
      ['empty string', true, case1],
      ['small string using <h1>', true, case2],
      ['large string using <a>, <u>, <h3>, <span>', true, case3],
      ['small string using <section>', false, case4],
      ['style attribute inside <p>', false, case5],
      ['no style attribute inside <p>', true, case6],
    ])('should return "%s" as supported="%s"', (_caseName, expected, inputString) => {
      const nodeMap = new Map<string, ValueSegment>();
      expect(isHtmlStringValueSafeForLexical(inputString, nodeMap)).toBe(expected);
    });
  });

  describe('isTagNameSupportedByLexical', () => {
    it.each<[string, boolean]>([
      ['', false],
      ['*', false],
      ['SeCtIoN', false],
      ['section', false],
      ['script', false],
      ['style', false],
      ['a', true],
      ['A', true],
      ['b', true],
      ['br', true],
      ['em', true],
      ['h1', true],
      ['h2', true],
      ['h3', true],
      ['h4', true],
      ['h5', true],
      ['h6', true],
      ['i', true],
      ['img', false],
      ['li', true],
      ['ol', true],
      ['p', true],
      ['span', true],
      ['sTrOnG', true],
      ['strong', true],
      ['u', true],
      ['ul', true],
    ])('should return <%s /> as supported="%s"', (inputTag, expected) => {
      expect(isTagNameSupportedByLexical(inputTag)).toBe(expected);
    });
  });
});
