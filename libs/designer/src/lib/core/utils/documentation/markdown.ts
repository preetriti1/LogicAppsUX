import { MD_TABLE_HTML } from './constants';

export const getMDTable = (rowVals: string[][], titleRow?: string[]) => {
  let output = `${MD_TABLE_HTML.tableStart}${MD_TABLE_HTML.tableBodyStart}`;
  if (titleRow) {
    output += getMDTableRow(titleRow, true);
  }
  for (const rowVal of rowVals) {
    output += getMDTableRow(rowVal);
  }

  output += `${MD_TABLE_HTML.tableBodyEnd}${MD_TABLE_HTML.tableEnd}`;
  return output;
};

export const getMDTableRow = (colVals: string[], isTitle?: boolean) => {
  let output = MD_TABLE_HTML.rowStart;
  for (const colVal of colVals) {
    output += `${isTitle ? MD_TABLE_HTML.titleColStart : MD_TABLE_HTML.colStart}${colVal}${
      isTitle ? MD_TABLE_HTML.titleColEnd : MD_TABLE_HTML.colEnd
    }`;
  }
  output += MD_TABLE_HTML.rowEnd;
  return output;
};
