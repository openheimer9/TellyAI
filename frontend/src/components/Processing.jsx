import React from 'react';

export function Processing({ message = 'Extracting invoice data using AI…' }) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-700" role="status" aria-live="polite">
      <span className="inline-block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" aria-hidden />
      <span>{message}</span>
      <span className="text-gray-400">Typically less than 20 seconds for PDFs/Images.</span>
    </div>
  );
}



