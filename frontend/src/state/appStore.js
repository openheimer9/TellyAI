import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  uploads: [], // { filename, size, type, status }
  extractions: {}, // filename -> extraction
  setUpload(meta) {
    set((s) => ({ uploads: [...s.uploads, meta] }));
  },
  setExtraction(filename, extraction) {
    set((s) => ({ extractions: { ...s.extractions, [filename]: extraction } }));
  },
  clearUploads() {
    set({ uploads: [], extractions: {} });
  },
}));


