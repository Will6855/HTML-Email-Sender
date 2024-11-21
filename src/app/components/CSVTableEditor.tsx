'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface CSVTableEditorProps {
  data: Record<string, string>[];
  onDataChange: (data: Record<string, string>[]) => void;
  emailColumn: string;
  onEmailColumnChange: (column: string) => void;
}

const CSVTableEditor: React.FC<CSVTableEditorProps> = ({ 
  data, 
  onDataChange, 
  emailColumn, 
  onEmailColumnChange 
}) => {
  const [rows, setRows] = useState<Record<string, string>[]>(data);
  const [headers, setHeaders] = useState<string[]>(Object.keys(data[0] || []));
  const [editingCell, setEditingCell] = useState<{ row: number; col: string; value: string } | null>(null);
  const [editingHeader, setEditingHeader] = useState<{ oldHeader: string; newHeader: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRows(data);
    if (data.length > 0) {
      setHeaders(Object.keys(data[0]));
    }
  }, [data]);

  const handleCellEditStart = useCallback((rowIndex: number, column: string, value: string) => {
    setEditingCell({ row: rowIndex, col: column, value });
  }, []);

  const handleCellEditChange = useCallback((value: string) => {
    setEditingCell(prev => prev ? { ...prev, value } : null);
  }, []);

  const handleCellEditComplete = useCallback(() => {
    if (editingCell) {
      const { row, col, value } = editingCell;
      setRows(prevRows => {
        const newRows = prevRows.map((r, index) =>
          index === row ? { ...r, [col]: value } : r
        );
        onDataChange(newRows);
        return newRows;
      });
      setEditingCell(null);
    }
  }, [editingCell, onDataChange]);

  const handleHeaderEditStart = useCallback((header: string) => {
    setEditingHeader({ oldHeader: header, newHeader: header });
  }, []);

  const handleHeaderEditChange = useCallback((value: string) => {
    setEditingHeader(prev => prev ? { ...prev, newHeader: value } : null);
  }, []);

  const handleHeaderEditComplete = useCallback(() => {
    if (editingHeader && editingHeader.oldHeader !== editingHeader.newHeader) {
      const { oldHeader, newHeader } = editingHeader;
      setHeaders(prevHeaders =>
        prevHeaders.map(h => h === oldHeader ? newHeader : h)
      );
      setRows(prevRows => {
        const newRows = prevRows.map(row => {
          const newRow = { ...row };
          if (oldHeader in newRow) {
            newRow[newHeader] = newRow[oldHeader];
            delete newRow[oldHeader];
          }
          return newRow;
        });
        onDataChange(newRows);
        return newRows;
      });
    }
    setEditingHeader(null);
  }, [editingHeader, onDataChange]);

  const handleAddRow = useCallback(() => {
    setRows(prevRows => {
      const newRow = headers.reduce((acc, header) => ({ ...acc, [header]: '' }), {});
      const newRows = [...prevRows, newRow];
      onDataChange(newRows);
      return newRows;
    });
  }, [headers, onDataChange]);

  const handleAddColumn = useCallback(() => {
    const newHeader = `Column ${headers.length + 1}`;
    setHeaders(prevHeaders => {
      const updatedHeaders = [...prevHeaders, newHeader];
      setRows(prevRows => {
        const newRows = prevRows.map(row => ({ ...row, [newHeader]: '' }));
        onDataChange(newRows);
        return newRows;
      });
      return updatedHeaders;
    });
  }, [headers, onDataChange]);

  const handleRemoveRow = useCallback((rowIndex: number) => {
    setRows(prevRows => {
      const newRows = prevRows.filter((_, index) => index !== rowIndex);
      onDataChange(newRows);
      return newRows;
    });
  }, [onDataChange]);

  const handleRemoveColumn = useCallback((columnToRemove: string) => {
    setHeaders(prevHeaders => prevHeaders.filter(header => header !== columnToRemove));
    setRows(prevRows => {
      const newRows = prevRows.map(row => {
        const newRow = { ...row };
        delete newRow[columnToRemove];
        return newRow;
      });
      onDataChange(newRows);
      return newRows;
    });
  }, [onDataChange]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(header => header.trim());
      
      const newRows: Record<string, string>[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',').map(value => value.trim());
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        newRows.push(row);
      }

      onDataChange(newRows);
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [onDataChange]);

  const handleExportCSV = useCallback(() => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => headers.map(header => row[header] || '').join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'contacts.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [headers, rows]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">📊 CSV Management</h2>
        <div className="flex space-x-2">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Import CSV
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Export CSV
          </button>
        </div>
      </div>

      {headers.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Email Column
          </label>
          <select
            value={emailColumn}
            onChange={(e) => onEmailColumnChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select column...</option>
            {headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="overflow-auto max-h-[300px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {editingHeader && editingHeader.oldHeader === header ? (
                    <input
                      type="text"
                      value={editingHeader.newHeader}
                      onChange={(e) => handleHeaderEditChange(e.target.value)}
                      onBlur={handleHeaderEditComplete}
                      onKeyPress={(e) => e.key === 'Enter' && handleHeaderEditComplete()}
                      autoFocus
                      className="border-b border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-2 py-1 w-full"
                    />
                  ) : (
                    <div onClick={() => handleHeaderEditStart(header)} className="cursor-pointer">
                      {header}
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveColumn(header)}
                    className="mt-1 text-xs text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={handleAddColumn}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Add Column
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((header) => (
                    <td key={header} className="px-6 py-4 whitespace-nowrap">
                      {editingCell && editingCell.row === rowIndex && editingCell.col === header ? (
                        <input
                          type="text"
                          value={editingCell.value}
                          onChange={(e) => handleCellEditChange(e.target.value)}
                          onBlur={handleCellEditComplete}
                          onKeyPress={(e) => e.key === 'Enter' && handleCellEditComplete()}
                          autoFocus
                          className="border-b border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-2 py-1 w-full"
                        />
                      ) : (
                        <div
                          onClick={() => handleCellEditStart(rowIndex, header, row[header] || '')}
                          className="cursor-pointer min-h-[40px] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        >
                          {row[header] || ''}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleRemoveRow(rowIndex)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove Row
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length + 1} className="px-6 py-4 text-center text-gray-500">
                  No rows available
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={headers.length + 1} className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={handleAddRow}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Add Row
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default CSVTableEditor;
