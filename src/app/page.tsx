'use client';

import { useState, useEffect } from 'react';

interface TableColumn {
  column_name: string;
  data_type: string;
  column_key: string;
  is_nullable: string;
}

interface TableData {
  [key: string]: any;
}

export default function Tables() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available tables when component mounts
  useEffect(() => {
    async function fetchTables() {
      try {
        setLoading(true);
        const response = await fetch('/api/tables');
        if (!response.ok) {
          throw new Error('Failed to fetch tables');
        }
        const data = await response.json();
        setTables(data.tables || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTables();
  }, []);

  // Fetch table data when a table is selected
  useEffect(() => {
    if (!selectedTable) return;

    async function fetchTableData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/table/${selectedTable}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data for table: ${selectedTable}`);
        }
        const data = await response.json();
        setColumns(data.columns || []);
        setTableData(data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTableData();
  }, [selectedTable]);

  // Handle table selection
  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">SQL Visualizer</h1>
        <p className="text-gray-600">View and manage your MariaDB database tables</p>
      </header>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          <p className="font-medium">Error: {error}</p>
          <button 
            className="underline text-sm mt-1" 
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Table Selector Sidebar */}
        <div className="w-full md:w-1/4 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium mb-3">Database Tables</h2>
          
          {loading && tables.length === 0 ? (
            <p className="text-gray-500">Loading tables...</p>
          ) : tables.length > 0 ? (
            <ul className="space-y-1">
              {tables.map((table) => (
                <li key={table}>
                  <button
                    onClick={() => handleTableSelect(table)}
                    className={`w-full text-left px-3 py-2 rounded ${
                      selectedTable === table
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {table}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tables found in database</p>
          )}
        </div>

        {/* Table Data Display */}
        <div className="w-full md:w-3/4">
          {selectedTable ? (
            <div className="bg-white rounded shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Table: {selectedTable}
                </h2>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              ) : tableData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {columns.map((column) => (
                          <th
                            key={column.column_name}
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {column.column_name}
                            {column.column_key === 'PRI' && ' 🔑'}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {columns.map((column) => (
                            <td
                              key={`${rowIndex}-${column.column_name}`}
                              className="px-4 py-3 whitespace-nowrap text-sm text-gray-500"
                            >
                              {row[column.column_name] !== null
                                ? String(row[column.column_name])
                                : 'NULL'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No data available in this table</p>
              )}
            </div>
          ) : (
            <div className="bg-white rounded shadow p-8 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                />
              </svg>
              <p className="text-lg text-gray-500">Select a table from the sidebar to view its data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}