import React from 'react';
import { ChevronDown } from 'lucide-react';

const getValue = (obj, key) => {
    return key.split('.').reduce((acc, part) => acc && acc[part], obj);
  };
  
  const DataTable = ({ columns, data, isLoading }) => {
    if (isLoading) {
      return (
        <div className="w-full h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
  
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-x-4">
                {columns.map((column) => (
                  <div
                    key={column.key}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900 flex items-center gap-2"
                  >
                    {column.label}
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Body */}
            <div className="divide-y divide-gray-200 bg-white">
              {data.map((row, rowIndex) => (
                <div 
                  key={rowIndex}
                  className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-x-4 hover:bg-gray-50"
                >
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className="px-6 py-4 text-sm text-gray-900 truncate"
                    >
                      {getValue(row, column.key) || "-"} 
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default DataTable;
  