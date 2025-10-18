import React from 'react';

export function Help() {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded p-6 shadow">
        <h2 className="text-xl font-semibold mb-2">Help & FAQ</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <div className="font-medium">How do I upload?</div>
            <div>Go to Upload page, drag & drop or click to select files.</div>
          </div>
          <div>
            <div className="font-medium">What formats are supported?</div>
            <div>PDF, JPG, PNG, HEIC. Spreadsheet support can be enabled later.</div>
          </div>
          <div>
            <div className="font-medium">Is my data private?</div>
            <div>Your Claude API key is kept in backend; files are processed securely.</div>
          </div>
        </div>
      </section>
      <section className="bg-white rounded p-6 shadow">
        <h3 className="font-medium mb-2">Contact & Support</h3>
        <form className="grid md:grid-cols-2 gap-3 text-sm">
          <input className="border rounded p-2" placeholder="Name" />
          <input className="border rounded p-2" placeholder="Email" />
          <textarea className="border rounded p-2 md:col-span-2" rows={4} placeholder="Message" />
          <button className="px-3 py-1.5 rounded bg-indigo-600 text-white w-max">Send</button>
        </form>
      </section>
    </div>
  );
}


