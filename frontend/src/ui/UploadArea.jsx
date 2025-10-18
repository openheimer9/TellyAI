import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '../services/api';

export function UploadArea({ onUploaded, disabled }) {
  const [uploading, setUploading] = useState(false);
  const onDrop = useCallback(async (accepted) => {
    if (!accepted.length) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', accepted[0]);
      const { data } = await api.postForm('/api/upload', form);
      onUploaded(data);
    } finally {
      setUploading(false);
    }
  }, [onUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false, disabled });

  return (
    <div {...getRootProps()} className={`border-2 border-dashed rounded p-8 text-center ${isDragActive ? 'border-indigo-500' : 'border-gray-300'} ${disabled ? 'opacity-50' : ''}`}>
      <input {...getInputProps()} />
      <p className="text-sm text-gray-600">Drag & drop or click to select a file</p>
      {uploading && <p className="text-xs text-gray-500 mt-2">Uploading…</p>}
    </div>
  );
}


