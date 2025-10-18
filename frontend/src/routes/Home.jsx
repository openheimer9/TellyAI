import React from 'react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="space-y-10">
      <section className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-lg p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">TallyBridge AI – Automated Invoice to Tally Voucher Entry</h1>
            <p className="text-gray-700 text-sm md:text-base mb-4">Eliminate manual invoice entry! Upload any invoice and get validated vouchers ready to push to Tally.</p>
            <div className="flex gap-3">
              <Link to="/upload" className="px-4 py-2 rounded bg-indigo-600 text-white">Start</Link>
              <a href="#how" className="px-4 py-2 rounded bg-gray-900 text-white">How it Works</a>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-full h-48 bg-white rounded-lg shadow flex items-center justify-center text-gray-500">Explainer Graphic</div>
          </div>
        </div>
      </section>

      <section id="how" className="grid md:grid-cols-3 gap-6">
        {[
          { n: '1. Upload', d: 'Drop PDFs/Images/Spreadsheets or link a Google Sheet.' },
          { n: '2. Review', d: 'Correct low-confidence fields; accept AI suggestions.' },
          { n: '3. Push to Tally', d: 'Download Tally XML or push to Tally directly.' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-lg p-5 shadow">
            <div className="text-lg font-medium mb-1">{s.n}</div>
            <div className="text-sm text-gray-600">{s.d}</div>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-lg p-6 shadow">
        <div className="text-center text-sm text-gray-700">Supported Formats</div>
        <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-3 text-xs text-gray-600">
          {['PDF', 'JPG', 'PNG', 'XLSX', 'XLS', 'CSV'].map((x) => (
            <div key={x} className="border rounded p-3 text-center">{x}</div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-5 shadow">
            <div className="text-sm text-gray-700 mb-2">“Great tool! Reduced manual work by 90%.”</div>
            <div className="text-xs text-gray-500">— Example Client {i}</div>
          </div>
        ))}
      </section>
    </div>
  );
}


