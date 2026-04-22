'use client';

import { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';

export default function FileUpload({ label }: { label: string }) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="mt-4">
      <label className="block text-[10px] font-black text-gray-600 uppercase mb-2 tracking-widest">
        {label}
      </label>
      <div className="border-2 border-dashed border-gray-200 rounded-sm p-4 hover:border-[#004795] transition-colors cursor-pointer bg-gray-50">
        {!file ? (
          <label className="flex flex-col items-center justify-center cursor-pointer">
            <Upload className="w-6 h-6 text-gray-400 mb-2" />
            <span className="text-[10px] font-bold text-gray-500 uppercase">Clique para anexar arquivo</span>
            <input 
              type="file" 
              className="hidden" 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
            />
          </label>
        ) : (
          <div className="flex items-center justify-between bg-white p-2 border border-gray-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#004795]" />
              <span className="text-[10px] font-bold text-gray-700 truncate max-w-[150px] uppercase">
                {file.name}
              </span>
            </div>
            <button onClick={() => setFile(null)} className="text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}