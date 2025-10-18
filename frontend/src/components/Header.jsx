import React, { useState } from 'react';

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-indigo-600" aria-hidden />
        <div>
          <div className="text-xl font-semibold">TallyBridge AI</div>
          <div className="text-xs text-gray-500">Upload, Check, Push – Automated Tally voucher entry from any invoice.</div>
        </div>
      </div>
      <button className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-controls="help-modal">Help / FAQ</button>

      {open && (
        <div role="dialog" id="help-modal" aria-modal="true" className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white max-w-2xl w-full rounded shadow p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-medium">Help / FAQ</h2>
              <button className="text-gray-500" onClick={() => setOpen(false)} aria-label="Close">✕</button>
            </div>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Supported: .pdf, .jpg, .jpeg, .png, .heic, .xlsx, .xls, .csv, .ods, Google Sheet link</li>
              <li>Max file size: 25 MB. Batch uploads supported.</li>
              <li>Your data stays local; Claude is used only for extraction.</li>
              <li>Review highlighted fields before pushing to Tally.</li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}



