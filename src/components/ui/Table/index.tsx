import styled from 'styled-components';
import { palette } from 'stylesheet';

export const TableContainer = styled.div`
  min-height: 15rem;
  max-height: calc(100vh - 24rem);
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Table = styled.table`
  text-align: left;
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.thead``;

export const TableBody = styled.tbody``;

export const TableHeaderRow = styled.tr``;

export const TableRow = styled.tr`
  border-top: 1px solid ${palette.lightGrey};
`;

export const TableCell = styled.td`
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
`;
