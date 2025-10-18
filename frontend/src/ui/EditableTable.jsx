import React from 'react';

export function EditableTable({ data, onChange }) {
  if (!data?.invoices?.length) return <p>No data to display</p>;

  function updateInvoice(i, field, value) {
    const copy = structuredClone(data);
    copy.invoices[i][field] = value;
    onChange(copy);
  }

  function updateItem(i, j, field, value) {
    const copy = structuredClone(data);
    copy.invoices[i].items[j][field] = value;
    onChange(copy);
  }

  function updateTotal(i, field, value) {
    const copy = structuredClone(data);
    copy.invoices[i].totals[field] = Number(value);
    onChange(copy);
  }

  return (
    <div className="space-y-6">
      {data.warnings?.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <h3 className="font-medium text-yellow-800">Warnings</h3>
          <ul className="text-sm text-yellow-700 mt-1">
            {data.warnings.map((w, i) => (
              <li key={i}>• {w}</li>
            ))}
          </ul>
        </div>
      )}

      {data.confidence && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <h3 className="font-medium text-blue-800">Extraction Confidence</h3>
          <p className="text-sm text-blue-700">
            {Math.round(data.confidence * 100)}% confidence in data extraction
          </p>
        </div>
      )}

      {data.invoices.map((inv, i) => (
        <div key={i} className="border rounded p-4 bg-white shadow-sm space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <L label="Invoice No">
              <input className="input" value={inv.invoiceNumber || ''} onChange={(e) => updateInvoice(i, 'invoiceNumber', e.target.value)} />
            </L>
            <L label="Date">
              <input className="input" type="date" value={inv.date || ''} onChange={(e) => updateInvoice(i, 'date', e.target.value)} />
            </L>
            <L label="Party">
              <input className="input" value={inv.partyName || ''} onChange={(e) => updateInvoice(i, 'partyName', e.target.value)} />
            </L>
            <L label="GSTIN">
              <input className="input" value={inv.partyGSTIN || ''} onChange={(e) => updateInvoice(i, 'partyGSTIN', e.target.value)} placeholder="27AAACR1234A1Z5" />
            </L>
            <L label="Type">
              <select className="input" value={inv.type || 'Purchase'} onChange={(e) => updateInvoice(i, 'type', e.target.value)}>
                <option value="Purchase">Purchase</option>
                <option value="Sales">Sales</option>
                <option value="Journal">Journal</option>
                <option value="Contra">Contra</option>
                <option value="Receipt">Receipt</option>
                <option value="Payment">Payment</option>
              </select>
            </L>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1 text-left">Item</th>
                  <th className="px-2 py-1 text-left">HSN</th>
                  <th className="px-2 py-1 text-right">Qty</th>
                  <th className="px-2 py-1 text-left">Unit</th>
                  <th className="px-2 py-1 text-right">Rate</th>
                  <th className="px-2 py-1 text-right">Amount</th>
                  <th className="px-2 py-1 text-right">GST %</th>
                </tr>
              </thead>
              <tbody>
                {inv.items?.map((it, j) => (
                  <tr key={j} className="border-b">
                    <td className="px-2 py-1">
                      <input className="input" value={it.description || ''} onChange={(e) => updateItem(i, j, 'description', e.target.value)} />
                    </td>
                    <td className="px-2 py-1">
                      <input className="input" value={it.hsnCode || ''} onChange={(e) => updateItem(i, j, 'hsnCode', e.target.value)} placeholder="1006" />
                    </td>
                    <td className="px-2 py-1 text-right">
                      <input className="input text-right" type="number" value={it.quantity || ''} onChange={(e) => updateItem(i, j, 'quantity', Number(e.target.value))} />
                    </td>
                    <td className="px-2 py-1">
                      <input className="input" value={it.unit || ''} onChange={(e) => updateItem(i, j, 'unit', e.target.value)} placeholder="Nos" />
                    </td>
                    <td className="px-2 py-1 text-right">
                      <input className="input text-right" type="number" step="0.01" value={it.rate || ''} onChange={(e) => updateItem(i, j, 'rate', Number(e.target.value))} />
                    </td>
                    <td className="px-2 py-1 text-right">
                      <input className="input text-right" type="number" step="0.01" value={it.amount || ''} onChange={(e) => updateItem(i, j, 'amount', Number(e.target.value))} />
                    </td>
                    <td className="px-2 py-1 text-right">
                      <input className="input text-right" type="number" value={it.gstRate || ''} onChange={(e) => updateItem(i, j, 'gstRate', Number(e.target.value))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t">
            <L label="Taxable Amount">
              <input className="input text-right" type="number" step="0.01" value={inv.totals?.taxable || ''} onChange={(e) => updateTotal(i, 'taxable', e.target.value)} />
            </L>
            <L label="CGST">
              <input className="input text-right" type="number" step="0.01" value={inv.totals?.cgst || ''} onChange={(e) => updateTotal(i, 'cgst', e.target.value)} />
            </L>
            <L label="SGST">
              <input className="input text-right" type="number" step="0.01" value={inv.totals?.sgst || ''} onChange={(e) => updateTotal(i, 'sgst', e.target.value)} />
            </L>
            <L label="IGST">
              <input className="input text-right" type="number" step="0.01" value={inv.totals?.igst || ''} onChange={(e) => updateTotal(i, 'igst', e.target.value)} />
            </L>
            <L label="Grand Total">
              <input className="input text-right font-semibold" type="number" step="0.01" value={inv.totals?.grandTotal || ''} onChange={(e) => updateTotal(i, 'grandTotal', e.target.value)} />
            </L>
          </div>
        </div>
      ))}
    </div>
  );
}

function L({ label, children }) {
  return (
    <label className="text-sm">
      <div className="text-gray-600 mb-1">{label}</div>
      <div className="">{children}</div>
      <style>{`.input{border:1px solid #d1d5db;border-radius:6px;padding:.4rem .6rem;width:100%;}`}</style>
    </label>
  );
}


