'use client';

import { useState, ChangeEvent } from 'react';
import Papa from 'papaparse';

interface CSVUploaderProps {
  onDataLoaded: (data: Record<string, string>[]) => void;
}

const CSVUploader = ({ onDataLoaded }: CSVUploaderProps) => {
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [emailColumn, setEmailColumn] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Papa.parse(e.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setData(result.data as Record<string, string>[]);
          setColumns(Object.keys(result.data[0]));
          onDataLoaded(result.data as Record<string, string>[]);
        },
      });
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
    </div>
  );
};

export default CSVUploader;
