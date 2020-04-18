import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { colorUsages } from 'stylesheet';

const Table = styled.table`
  text-align: left;
  width: 100%;
  border-collapse: collapse;
`;

const Wrapper = styled.div`
  min-height: 15rem;
  max-height: calc(100vh - 24rem);
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const BodyRow = styled.tr`
  border-top: 1px solid ${colorUsages.tableBorder};
`;

const Cell = styled.td`
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
`;

const TableStat = ({ config, data, noDataMessage }) => (
  <Wrapper>
    <Table>
      <thead>
        <tr>
          {config.map(({ width, header = '', align = 'left' }, index) => (
            <Cell as="th" key={index} width={width} align={align}>
              {header}
            </Cell>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((rowData, rowIndex) => (
          <BodyRow key={rowIndex}>
            {config.map(({ width, renderCell, align = 'left' }, colIndex) => (
              <Cell key={colIndex} width={width} align={align}>
                {renderCell(rowData)}
              </Cell>
            ))}
          </BodyRow>
        ))}
        {data.length === 0 && (
          <BodyRow width="100%">
            <td colSpan={config.length}>{noDataMessage}</td>
          </BodyRow>
        )}
      </tbody>
    </Table>
  </Wrapper>
);

TableStat.propTypes = {
  config: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  noDataMessage: PropTypes.string,
};

TableStat.defaultProps = {
  noDataMessage: 'Nothing to display.',
};

export default TableStat;
