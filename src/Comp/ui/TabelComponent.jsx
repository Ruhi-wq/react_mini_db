import React from 'react';

const TableComponent = (props) => {
  data = props.data

  return (
    <table border="1">
      <tbody>
        {/* Loop through each row in the data */}
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {/* Loop through each cell in the row */}
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;