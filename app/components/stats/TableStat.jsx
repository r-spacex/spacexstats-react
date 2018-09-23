import React from 'react';
import PropTypes from 'prop-types';

import './TableStat.styl';

const TableStat = ({ config, data, noDataMessage }) => (
  <div className="Table__container">
    <table className="Table">
      <thead className="Table__header">
        <tr>
          {config.map(({ width, header = '', align = 'left' }, index) => (
            <th key={index} width={width} align={align} className="Table__cell">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((rowData, rowIndex) => (
          <tr key={rowIndex} className="Table__body__row">
            {config.map(({ width, renderCell, align = 'left' }, colIndex) => (
              <td key={colIndex} width={width} align={align} className="Table__cell">
                {renderCell(rowData)}
              </td>
            ))}
          </tr>
        ))}
        {data.length === 0 && (
          <tr width="100%">
            <td colSpan={config.length}>
              {noDataMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
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
