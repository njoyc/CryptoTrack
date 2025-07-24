// frontend/src/components/DownloadCSVButton.jsx
import React from 'react';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const DownloadCSVButton = ({ data, filename }) => {
  const downloadCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  };

  return (
    <button onClick={downloadCSV} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2">
      Download CSV
    </button>
  );
};

export default DownloadCSVButton;
