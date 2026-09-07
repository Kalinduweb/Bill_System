import React, { useState } from 'react';
import {
  Download,
  Printer,
  Mail,
  Palette,
  FolderOpen,
  Plus,
  ZoomIn,
  ZoomOut,
  Layout,
  History,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface BillToolbarProps {
  onExportPdf: (paperSize: 'a4' | 'a5') => void;
  onPrint: () => void;
  onOpenEmailModal: () => void;
  onOpenBrandingModal: () => void;
  onOpenSavedModal: () => void;
  onOpenHistoryModal: () => void;
  onCreateNew: () => void;
  isExportingPdf: boolean;
  scale: number;
  onScaleChange: (scale: number) => void;
  showSideEditor: boolean;
  onToggleSideEditor: () => void;
  emailLogsCount: number;
  savedInvoicesCount: number;
  invoiceStatus: string;
}

export const BillToolbar: React.FC<BillToolbarProps> = ({
  onExportPdf,
  onPrint,
  onOpenEmailModal,
  onOpenBrandingModal,
  onOpenSavedModal,
  onOpenHistoryModal,
  onCreateNew,
  isExportingPdf,
  scale,
  onScaleChange,
  showSideEditor,
  onToggleSideEditor,
  emailLogsCount,
  savedInvoicesCount,
  invoiceStatus,
}) => {
  const [showPdfOptions, setShowPdfOptions] = useState(false);

  return (
    <header className="no-print bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand Identity & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-sm shadow-xs">
              IDK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-gray-900 tracking-tight">
                  Bill Filling & Invoice Generator
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  <FileCheck2 className="w-3 h-3 text-emerald-600" />
                  Print-Ready
                </span>
              </div>
              <p className="text-[11px] text-gray-700 hidden sm:block">
                Professional Bill Books • Custom Branding • PDF Export • Automated Email
              </p>
            </div>
          </div>
        </div>

        {/* Center: Zoom & View controls */}
        <div className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs">
          <button
            type="button"
            onClick={() => onScaleChange(Math.max(0.7, scale - 0.1))}
            className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-black transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 font-mono text-[11px] text-gray-600 font-medium">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => onScaleChange(Math.min(1.4, scale + 0.1))}
            className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-black transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={onToggleSideEditor}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors text-xs font-medium ${
              showSideEditor ? 'bg-white shadow-2xs text-black font-semibold' : 'text-gray-600 hover:text-black'
            }`}
            title="Toggle Sidebar Form"
          >
            <Layout className="w-3.5 h-3.5" />
            <span>{showSideEditor ? 'Hide Form' : 'Show Form'}</span>
          </button>
        </div>

        {/* Right: Primary Action Buttons */}
        <div className="flex items-center gap-2">
          {/* PWA Install Trigger */}
          <PWAInstallButton />

          {/* Branding Settings */}
          <button
            type="button"
            onClick={onOpenBrandingModal}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg text-xs font-medium transition-colors"
            title="Customize Company Name, Logo & Colors"
          >
            <Palette className="w-3.5 h-3.5 text-gray-600" />
            <span className="hidden sm:inline">Branding</span>
          </button>

          {/* Saved Invoices */}
          <button
            type="button"
            onClick={onOpenSavedModal}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg text-xs font-medium transition-colors"
            title="Saved Invoices"
          >
            <FolderOpen className="w-3.5 h-3.5 text-gray-600" />
            <span className="hidden sm:inline">Bills</span>
            <span className="bg-gray-200 text-gray-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {savedInvoicesCount}
            </span>
          </button>

          {/* Automated Email Delivery Button */}
          <button
            type="button"
            onClick={onOpenEmailModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
            title="Automated Email Delivery"
          >
            <Mail className="w-3.5 h-3.5 text-blue-700" />
            <span>Email Bill</span>
          </button>

          {/* Email Logs Button */}
          {emailLogsCount > 0 && (
            <button
              type="button"
              onClick={onOpenHistoryModal}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg text-xs font-medium transition-colors"
              title="Dispatched Email Logs"
            >
              <History className="w-3.5 h-3.5" />
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                {emailLogsCount} sent
              </span>
            </button>
          )}

          {/* Print Button */}
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg text-xs font-medium transition-colors"
            title="Print Physical Bill Book"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* PDF Export Dropdown/Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => onExportPdf('a4')}
              disabled={isExportingPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white hover:bg-gray-800 disabled:opacity-50 rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingPdf ? 'Exporting...' : 'PDF Export'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
