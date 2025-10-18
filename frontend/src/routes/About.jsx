import React from 'react';

export function About() {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded p-6 shadow">
        <h2 className="text-xl font-semibold mb-2">About TallyBridge AI</h2>
        <p className="text-sm text-gray-700">Built using Claude Vision API to automate invoice-to-Tally voucher conversion. Our mission is to eliminate manual entry for businesses.</p>
      </section>
      <section className="bg-white rounded p-6 shadow">
        <h3 className="font-medium mb-2">Contact</h3>
        <form className="grid md:grid-cols-2 gap-3 text-sm">
          <input className="border rounded p-2" placeholder="Company" />
          <input className="border rounded p-2" placeholder="Email" />
          <input className="border rounded p-2 md:col-span-2" placeholder="Phone" />
          <textarea className="border rounded p-2 md:col-span-2" rows={4} placeholder="Tell us your needs" />
          <button className="px-3 py-1.5 rounded bg-emerald-600 text-white w-max">Request Demo</button>
        </form>
      </section>
    </div>
  );
}


