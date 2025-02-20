'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { FiFilter } from 'react-icons/fi';

interface CSVTableEditorProps {
  data: Record<string, string>[];
  headers: string[];
  onDataChange: (data: Record<string, string>[]) => void;
  onFilteredDataChange?: (filteredData: Record<string, string>[]) => void;
  emailColumn: string;
  onEmailColumnChange: (column: string) => void;
}

type FilterCondition = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';

interface FilterRule {
  column: string;
  condition: FilterCondition;
  value: string;
}

const CSVTableEditor: React.FC<CSVTableEditorProps> = ({ 
  data, 
  headers, 
  onDataChange, 
  onFilteredDataChange, 
  emailColumn, 
  onEmailColumnChange 
}) => {
  const [rows, setRows] = useState<Record<string, string>[]>(data);
  const [editingCell, setEditingCell] = useState<{ row: number; col: string; value: string } | null>(null);
  const [editingHeader, setEditingHeader] = useState<{ oldHeader: string; newHeader: string } | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    setRows(data);
  }, [data]);

  const handleCellEditStart = useCallback((row: number, col: string, initialValue: string = '') => {
    setEditingCell({ row, col, value: initialValue });
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
    const newRow = headers.reduce((acc, header) => {
      acc[header] = '';
      return acc;
    }, {} as Record<string, string>);
    
    setRows(prevRows => {
      const newRows = [...prevRows, newRow];
        onDataChange(newRows);
      return newRows;
    });
  }, [headers, onDataChange]);

  const handleAddColumn = useCallback(() => {
    const newHeader = `Column ${headers.length + 1}`;
    setRows(prevRows => {
      const newRows = prevRows.map(row => ({ ...row, [newHeader]: '' }));
      onDataChange(newRows);
      return newRows;
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

  const filteredRows = useMemo(() => {
    const filtered = filterRules.length === 0 
      ? rows 
      : rows.filter(row => 
          filterRules.every(rule => {
            const cellValue = (row[rule.column] || '').toString().toLowerCase();
            const ruleValue = rule.value.toLowerCase();

            switch (rule.condition) {
              case 'contains':
                return cellValue.includes(ruleValue);
              case 'equals':
                return cellValue === ruleValue;
              case 'startsWith':
                return cellValue.startsWith(ruleValue);
              case 'endsWith':
                return cellValue.endsWith(ruleValue);
              case 'greaterThan':
                return parseFloat(cellValue) > parseFloat(ruleValue);
              case 'lessThan':
                return parseFloat(cellValue) < parseFloat(ruleValue);
              default:
                return true;
            }
          })
        );
    
    // Call onFilteredDataChange if provided
    if (onFilteredDataChange) {
      onFilteredDataChange(filtered);
    }
    
    return filtered;
  }, [rows, filterRules, onFilteredDataChange]);

  const openFilterModal = useCallback(() => {
    setIsFilterModalOpen(true);
  }, []);

  const closeFilterModal = useCallback(() => {
    setIsFilterModalOpen(false);
  }, []);

  const addFilterRule = useCallback(() => {
    setFilterRules(prev => [...prev, { 
      column: headers[0], 
      condition: 'contains', 
      value: '' 
    }]);
  }, [headers]);

  const updateFilterRule = useCallback((index: number, updates: Partial<FilterRule>) => {
    setFilterRules(prev => 
      prev.map((rule, i) => i === index ? { ...rule, ...updates } : rule)
    );
  }, []);

  const removeFilterRule = useCallback((index: number) => {
    setFilterRules(prev => prev.filter((_, i) => i !== index));
  }, []);

  const applyFilters = useCallback(() => {
    closeFilterModal();
  }, [closeFilterModal]);

  const resetFilters = useCallback(() => {
    setFilterRules([]);
    closeFilterModal();
  }, [closeFilterModal]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">📊 {t('csvManagement')}</h2>
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
            {t('importCsv')}
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {t('exportCsv')}
          </button>
          <button 
            onClick={openFilterModal}
            className="text-gray-600 hover:text-gray-900"
            title={t('advancedFilter')}
          >
            <FiFilter className="h-6 w-6" />
          </button>
        </div>
      </div>

      {headers.length > 0 && (
        <div className="flex items-center space-x-2 mb-2 text-sm">
          <span className="text-gray-600">{t('emailColumnLabel')}</span>
          <div className="flex space-x-1 overflow-x-auto">
            {headers.map((header) => (
              <button
                key={header}
                onClick={() => onEmailColumnChange(header)}
                className={`px-2 py-1 rounded ${
                  emailColumn === header
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {header}
              </button>
            ))}
          </div>
        </div>
      )}

      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center h-full w-full z-50">
          <div className="p-5 border w-[600px] shadow-lg rounded-md bg-white">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{t('advancedFilters')}</h3>
                <button
                  onClick={closeFilterModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ✕
                </button>
              </div>

              {/* Filter Rules */}
              {filterRules.map((rule, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <select
                    value={rule.column}
                    onChange={(e) => updateFilterRule(index, { column: e.target.value })}
                    className="border rounded px-2 py-1"
                  >
                    {headers.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>

                  <select
                    value={rule.condition}
                    onChange={(e) => updateFilterRule(index, { condition: e.target.value as FilterCondition })}
                    className="border rounded px-2 py-1"
                  >
                    <option value="contains">{t('contains')}</option>
                    <option value="equals">{t('equals')}</option>
                    <option value="startsWith">{t('startsWith')}</option>
                    <option value="endsWith">{t('endsWith')}</option>
                    <option value="greaterThan">{t('greaterThan')}</option>
                    <option value="lessThan">{t('lessThan')}</option>
                  </select>

                  <input
                    type="text"
                    value={rule.value}
                    onChange={(e) => updateFilterRule(index, { value: e.target.value })}
                    placeholder={t('filterValue')}
                    className="border rounded px-2 py-1 flex-grow"
                  />

                  <button 
                    onClick={() => removeFilterRule(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Add Rule Button */}
              <button 
                onClick={addFilterRule}
                className="mb-4 text-blue-500 hover:text-blue-700"
              >
                + {t('addFilterRule')}
              </button>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  {t('resetFilters')}
                </button>
                <button 
                  onClick={applyFilters}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {t('applyFilters')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-auto max-h-[400px] border border-gray-200 rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th key={header} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-b border-r border-gray-200 ${
                  emailColumn === header ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'
                }`}>
                  {editingHeader && editingHeader.oldHeader === header ? (
                    <input
                      type="text"
                      value={editingHeader.newHeader}
                      onChange={(e) => handleHeaderEditChange(e.target.value)}
                      onBlur={handleHeaderEditComplete}
                      onKeyPress={(e) => e.key === 'Enter' && handleHeaderEditComplete()}
                      autoFocus
                      className="border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-2 py-1 w-full rounded-md"
                    />
                  ) : (
                    <>
                      <div onClick={() => handleHeaderEditStart(header)} className="cursor-pointer">
                        {header}
                      </div>
                      <button
                        onClick={() => handleRemoveColumn(header)}
                        className="mt-1 text-xs text-red-600 hover:text-red-800"
                      >
                        {t('removeColumn')}
                      </button>
                    </>
                  )}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <button
                  onClick={handleAddColumn}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  {t('addColumn')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredRows.length > 0 ? (
              filteredRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-200">
                  {headers.map((header) => (
                    <td key={header} className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                      {editingCell && editingCell.row === rowIndex && editingCell.col === header ? (
                        <input
                          type="text"
                          value={editingCell.value}
                          onChange={(e) => handleCellEditChange(e.target.value)}
                          onBlur={handleCellEditComplete}
                          onKeyPress={(e) => e.key === 'Enter' && handleCellEditComplete()}
                          autoFocus
                          className="border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 px-2 py-1 w-full rounded-md"
                        />
                      ) : (
                        <div
                          onClick={() => handleCellEditStart(rowIndex, header, row[header])}
                          className="cursor-pointer min-h-[24px]"
                        >
                          {row[header] || ''}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 font-medium whitespace-nowrap">
                    <button
                      onClick={() => handleRemoveRow(rowIndex)}
                      className="mt-1 text-xs text-red-600 hover:text-red-800"
                    >
                      {t('removeRow')}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length + 1} className="px-6 py-4 text-center text-gray-500">
                  {t('noRows')}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="px-6 py-3 text-left text-xs font-medium bg-gray-50 text-gray-500 uppercase tracking-wider border-t border-gray-200">
            <tr>
              <td colSpan={headers.length + 1} className="px-6 py-4">
                <button
                  onClick={handleAddRow}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  {t('addRow')}
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
