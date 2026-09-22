import React, { useState, useRef } from 'react';
import { ZoneData } from '../types/water';
import { parseWaterCsv } from '../services/csvParser';
import { Upload, FileText, AlertCircle, CheckCircle2, Download, X } from 'lucide-react';

interface DataUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (zones: ZoneData[]) => void;
}

export const DataUploaderModal: React.FC<DataUploaderModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
}) => {
  const [csvContent, setCsvContent] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const sampleCsvTemplate = `Zone,Supplied,Consumed,Lost,LossPct,Pressure,NightFlow
Zone A,20000,19000,1000,5.0,3.4,120
Zone B,20000,12000,8000,40.0,1.8,2450
Zone C,20000,18500,1500,7.5,3.3,180
Zone D,20000,14000,6000,30.0,4.1,920
Zone E,20000,14500,5500,27.5,2.9,650`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      processCsv(text);
    };
    reader.readAsText(file);
  };

  const processCsv = (text: string) => {
    const result = parseWaterCsv(text);
    if (result.errors.length > 0) {
      setErrors(result.errors);
      setSuccessCount(null);
    } else {
      setErrors([]);
      setSuccessCount(result.zones.length);
    }
  };

  const handleApply = () => {
    const result = parseWaterCsv(csvContent);
    if (result.zones.length > 0) {
      onDataLoaded(result.zones);
      onClose();
    }
  };

  const handleLoadSample = () => {
    setCsvContent(sampleCsvTemplate);
    processCsv(sampleCsvTemplate);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([sampleCsvTemplate], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'smart_waterguard_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Upload Custom Water Utility Dataset</h3>
              <p className="text-xs text-slate-300">Import your municipality or industrial SCADA / smart meter CSV.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          
          {/* Drag & Drop Box */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50/70 hover:bg-sky-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all space-y-2 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.txt"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-sky-100 text-sky-600 flex items-center justify-center mx-auto shadow-xs border border-slate-200">
              <Upload className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-slate-800 block">Click to browse or drop CSV file here</span>
            <span className="text-xs text-slate-500 block">Supported formats: .CSV with Zone, Supply, Consumption headers</span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={handleLoadSample}
              className="font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <FileText className="w-4 h-4" /> Load Sample Dataset
            </button>

            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <Download className="w-4 h-4" /> Download Sample CSV Template
            </button>
          </div>

          {/* CSV Text Input Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              CSV Content Preview / Direct Paste:
            </label>
            <textarea
              rows={5}
              value={csvContent}
              onChange={(e) => {
                setCsvContent(e.target.value);
                processCsv(e.target.value);
              }}
              placeholder="Zone,Supplied,Consumed,Lost,LossPct,Pressure..."
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Errors or Success */}
          {errors.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
              {errors.map((err, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}

          {successCount !== null && errors.length === 0 && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Successfully parsed <strong>{successCount} zones</strong> from CSV dataset!</span>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={successCount === null || errors.length > 0}
              className={`px-5 py-2 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 ${
                successCount !== null && errors.length === 0
                  ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Load Into WaterGuard</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
