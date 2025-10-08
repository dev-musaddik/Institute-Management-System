import React from "react";

function Table({ headers, data, renderRow, actions }) {
  return (
    <div className="overflow-x-auto bg-white bg-opacity-10 rounded-lg shadow-lg border border-gray-700 p-4">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800 bg-opacity-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {data?.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length + (actions ? actions.length : 0)}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-center"
              >
                No data available
              </td>
            </tr>
          ) : (
            data?.map((item, index) => renderRow(item, index))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
