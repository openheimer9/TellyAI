import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadArea } from '../ui/UploadArea';
import { useAppStore } from '../state/appStore';
import { api } from '../services/api';

export function Upload() {
  const navigate = useNavigate();
  const { uploads, setUpload, setExtraction, clearUploads } = useAppStore();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  async function handleUploaded(meta) {
    setError('');
    setUpload({
      filename: meta.upload.filename,
      size: meta.upload.size,
      type: meta.upload.mimetype,
      status: 'uploaded',
    });
    setProcessing(true);
    try {
      const { data } = await api.post('/api/process', { filename: meta.upload.filename });
      setExtraction(meta.upload.filename, data.extraction);
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Processing failed');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="grid md:grid-cols-4 gap-6">
      <div className="md:col-span-3 space-y-4">
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="font-medium mb-2">Upload Files</h2>
          <p className="text-sm text-gray-600 mb-3">Supported: .pdf, .jpg, .jpeg, .png, .heic (25MB max each)</p>
          <UploadArea onUploaded={handleUploaded} />
          {processing && <div className="text-sm text-indigo-700 mt-3">Extraction in progress…</div>}
          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
          <div className="mt-4 flex gap-2">
            <button className="px-3 py-1.5 rounded bg-indigo-600 text-white" onClick={() => navigate('/review')}>Continue to Review</button>
            <button className="px-3 py-1.5 rounded bg-gray-100" onClick={() => clearUploads()}>Clear All</button>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-medium mb-2">Previews</h3>
          <div className="grid md:grid-cols-3 gap-3 text-sm">
            {uploads.length === 0 && <div className="text-gray-500">No files yet. Try uploading a sample invoice.</div>}
            {uploads.map((u, i) => (
              <div key={i} className="border rounded p-3">
                <div className="font-mono text-xs break-all">{u.filename}</div>
                <div className="text-gray-600 text-xs">{u.type} · {(u.size/1024).toFixed(1)} KB</div>
                <div className="text-xs mt-1">Status: <span className="font-medium">{u.status}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <aside className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="font-medium mb-2">Recent Uploads</h3>
          <ul className="text-xs text-gray-700 space-y-1">
            {uploads.slice(-5).map((u, i) => (
              <li key={i} className="flex justify-between"><span className="truncate">{u.filename}</span><span>{u.status}</span></li>
            ))}
            {uploads.length === 0 && <li className="text-gray-500">None yet</li>}
          </ul>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="font-medium mb-2">Tips for Better Extraction</h3>
          <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
            <li>Use clear scans with readable text.</li>
            <li>Prefer original PDFs over photos.</li>
            <li>Upload one invoice per file for best accuracy.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}


