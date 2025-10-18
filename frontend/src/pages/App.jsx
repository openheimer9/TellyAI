import React, { useState } from 'react';
import { UploadArea } from '../ui/UploadArea';
import { EditableTable } from '../ui/EditableTable';
import { Header } from '../components/Header';
import { Processing } from '../components/Processing';
import { api } from '../services/api';

export default function App() {
  const [extraction, setExtraction] = useState(null);
  const [uploadMeta, setUploadMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onUploaded(meta) {
    setUploadMeta(meta);
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Processing uploaded file:', meta.upload.filename);
      const { data } = await api.post('/api/process', { filename: meta.upload.filename });
      console.log('✅ Processing completed:', data);
      setExtraction(data.extraction);
    } catch (err) {
      console.error('❌ Processing failed:', err);
      setError(err.response?.data?.error || err.message || 'Processing failed');
    } finally {
      setLoading(false);
    }
  }

  async function previewXml() {
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
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <Header />

      <section className="space-y-2">
        <h2 className="font-medium">Upload Invoice(s)</h2>
        <p className="text-sm text-gray-600">
          Supported: .pdf, .jpg, .png, .jpeg, .heic (max 25MB)
        </p>
        <UploadArea onUploaded={onUploaded} disabled={loading} />
      </section>

      {loading && <Processing />}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <h3 className="font-medium text-red-800">Error</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
          <button 
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {extraction && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Preview & Edit</h2>
            <div className="space-x-2">
              <button 
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" 
                onClick={previewXml}
              >
                Download Tally XML
              </button>
            </div>
          </div>
          <EditableTable data={extraction} onChange={setExtraction} />
        </section>
      )}
    </div>
  );
}


