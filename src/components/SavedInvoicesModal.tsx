import React, { useState } from 'react';
import { InvoiceData } from '../types';
import { FileText, Plus, Trash2, Copy, X, Search, Check } from 'lucide-react';
import { calculateInvoiceTotals } from '../utils/billUtils';

interface SavedInvoicesModalProps {
  invoices: InvoiceData[];
  currentInvoiceId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectInvoice: (invoice: InvoiceData) => void;
  onCreateNewInvoice: () => void;
  onDuplicateInvoice: (invoice: InvoiceData) => void;
  onDeleteInvoice: (id: string) => void;
}

export const SavedInvoicesModal: React.FC<SavedInvoicesModalProps> = ({
  invoices,
  currentInvoiceId,
  isOpen,
  onClose,
  onSelectInvoice,
  onCreateNewInvoice,
  onDuplicateInvoice,
  onDeleteInvoice,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      inv.date.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-black text-white rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Saved Invoices & Bills</h2>
              <p className="text-xs text-gray-700">Browse, duplicate or create new bill books</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3 bg-white">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by bill #, customer, date..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              onCreateNewInvoice();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Create New Bill
          </button>
        </div>

        {/* List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No matching invoices found
            </div>
          ) : (
            filtered.map((inv) => {
              const totals = calculateInvoiceTotals(inv);
              const isSelected = inv.id === currentInvoiceId;

              return (
                <div
                  key={inv.id}
                  className={`p-3.5 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-black bg-gray-50/70 ring-1 ring-black'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div
                    onClick={() => {
                      onSelectInvoice(inv);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">
                        #{inv.invoiceNumber || 'No #'}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-medium">
                          <Check className="w-2.5 h-2.5" /> Active
                        </span>
                      )}
                      <span className="text-xs text-gray-700 font-medium">• {inv.date}</span>
                    </div>

                    <div className="text-xs text-gray-700 font-medium mt-0.5 truncate max-w-md">
                      M/s : {inv.customerName || 'Unnamed Customer'}
                    </div>

                    <div className="text-xs font-bold text-emerald-800 mt-1">
                      {totals.majorUnit} {totals.splitNetTotal.major}.{totals.splitNetTotal.minor}
                      <span className="text-[11px] font-normal text-gray-600 ml-2">
                        ({inv.items.length} items)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onDuplicateInvoice(inv)}
                      title="Duplicate Bill"
                      className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {invoices.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteInvoice(inv.id)}
                        title="Delete Bill"
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
