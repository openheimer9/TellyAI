import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../state/appStore';
import { EditableTable } from '../ui/EditableTable';
import { api } from '../services/api';

export function Review() {
  const navigate = useNavigate();
  const { uploads, extractions } = useAppStore();
  const [active, setActive] = useState(uploads[0]?.filename || null);
  const extraction = active ? extractions[active] : null;

  const summary = useMemo(() => {
    if (!extraction) return { invoices: 0, total: 0, warnings: 0 };
    const invoices = extraction.invoices?.length || 0;
    const total = (extraction.invoices || []).reduce((s, inv) => s + Number(inv?.totals?.grandTotal || 0), 0);
    const warnings = (extraction.warnings || []).length;
    return { invoices, total, warnings };
  }, [extraction]);

  async function downloadXml() {
    if (!extraction) return;
    const res = await api.postXml('/api/voucher/preview', { extraction });
    const blob = new Blob([res], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tally.xml';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">Summary: {summary.invoices} invoices · ₹{summary.total.toFixed(2)} · {summary.warnings} warnings</div>
        <div className="space-x-2">
          <button className="px-3 py-1.5 rounded bg-gray-100" onClick={() => navigate('/upload')}>Back to Uploads</button>
          <button className="px-3 py-1.5 rounded bg-indigo-600 text-white" onClick={downloadXml}>Download XML</button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {uploads.map((u) => (
          <button key={u.filename} className={`px-3 py-1.5 rounded border ${active === u.filename ? 'bg-indigo-600 text-white' : 'bg-white'}`} onClick={() => setActive(u.filename)}>
            {u.filename}
          </button>
        ))}
        {uploads.length === 0 && <div className="text-sm text-gray-500">No uploads yet. Please upload files.</div>}
      </div>

      <div className="bg-white rounded-lg p-4 shadow">
        {!extraction && <div className="text-sm text-gray-500">No extraction available. Upload a file to begin.</div>}
        {extraction && (
          <EditableTable data={extraction} onChange={() => {}} />
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded p-3 shadow">
          <div className="font-medium mb-1">Smart Suggestions</div>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>HSN code missing for some items</li>
            <li>Party match: ABC Traders vs ABC Trading Co.</li>
          </ul>
        </div>
        <div className="bg-white rounded p-3 shadow">
          <div className="font-medium mb-1">Status</div>
          <div className="text-xs text-gray-700">Ready</div>
        </div>
        <div className="bg-white rounded p-3 shadow">
          <div className="font-medium mb-1">Actions</div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded bg-gray-100">Accept All Suggestions</button>
            <button className="px-3 py-1.5 rounded bg-gray-100">Review Next Issue</button>
          </div>
        </div>
      </div>
    </div>
  );
}


