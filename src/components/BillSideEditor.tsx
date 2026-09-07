import React from 'react';
import { InvoiceData, InvoiceItem } from '../types';
import { Plus, Trash2, Calendar, User, MapPin, Hash, DollarSign } from 'lucide-react';
import { calculateInvoiceTotals } from '../utils/billUtils';

interface BillSideEditorProps {
  invoice: InvoiceData;
  onUpdateInvoice: (updated: InvoiceData) => void;
}

export const BillSideEditor: React.FC<BillSideEditorProps> = ({
  invoice,
  onUpdateInvoice,
}) => {
  const totals = calculateInvoiceTotals(invoice);

  const handleItemChange = (index: number, field: keyof InvoiceItem, val: string | number) => {
    const newItems = [...invoice.items];
    const current = { ...newItems[index] };

    if (field === 'qty') {
      const numQty = val === '' ? '' : Number(val);
      current.qty = isNaN(Number(numQty)) ? val : numQty;
      current.amount = (Number(current.qty) || 0) * (Number(current.rate) || 0);
    } else if (field === 'rate') {
      const numRate = val === '' ? '' : Number(val);
      current.rate = isNaN(Number(numRate)) ? val : numRate;
      current.amount = (Number(current.qty) || 0) * (Number(current.rate) || 0);
    } else if (field === 'description') {
      current.description = String(val);
    }

    newItems[index] = current;
    onUpdateInvoice({ ...invoice, items: newItems });
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      qty: 1,
      description: '',
      rate: 0,
      amount: 0,
    };
    onUpdateInvoice({ ...invoice, items: [...invoice.items, newItem] });
  };

  const handleRemoveItem = (index: number) => {
    if (invoice.items.length <= 1) {
      onUpdateInvoice({
        ...invoice,
        items: [{ id: `item-${Date.now()}`, qty: '', description: '', rate: '', amount: 0 }],
      });
      return;
    }
    const updated = invoice.items.filter((_, i) => i !== index);
    onUpdateInvoice({ ...invoice, items: updated });
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 divide-y divide-gray-100">
      {/* Customer & Invoice Meta */}
      <div className="p-4 space-y-3">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-gray-700" />
          Customer & Bill Details
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Bill / Invoice No</label>
            <div className="relative">
              <Hash className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={invoice.invoiceNumber}
                onChange={(e) => onUpdateInvoice({ ...invoice, invoiceNumber: e.target.value })}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black font-mono font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Date</label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={invoice.date}
                onChange={(e) => onUpdateInvoice({ ...invoice, date: e.target.value })}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black font-medium"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Customer Name (M/s)</label>
          <input
            type="text"
            value={invoice.customerName}
            onChange={(e) => onUpdateInvoice({ ...invoice, customerName: e.target.value })}
            placeholder="e.g. Liyanage Wedding Planners"
            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black font-semibold"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Customer Address</label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-2 text-gray-400" />
            <input
              type="text"
              value={invoice.customerAddress}
              onChange={(e) => onUpdateInvoice({ ...invoice, customerAddress: e.target.value })}
              placeholder="e.g. No 45, Temple Road, Padukka"
              className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Customer Email</label>
            <input
              type="email"
              value={invoice.customerEmail}
              onChange={(e) => onUpdateInvoice({ ...invoice, customerEmail: e.target.value })}
              placeholder="client@mail.com"
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Customer Phone</label>
            <input
              type="text"
              value={invoice.customerPhone}
              onChange={(e) => onUpdateInvoice({ ...invoice, customerPhone: e.target.value })}
              placeholder="077 123 4567"
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Bill Items Manager */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            Bill Items ({invoice.items.length})
          </h3>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1 text-xs text-black font-semibold hover:underline bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
          >
            <Plus className="w-3 h-3" /> Add Item
          </button>
        </div>

        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {invoice.items.map((item, idx) => {
            const lineTotal = (Number(item.qty) || 0) * (Number(item.rate) || 0);

            return (
              <div
                key={item.id || idx}
                className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg space-y-1.5 text-xs hover:border-gray-300 transition-all"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[10px] font-mono text-gray-600 font-bold">#{idx + 1}</span>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    placeholder="Item description (e.g. Wedding Cards)"
                    className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs focus:ring-1 focus:ring-black font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    title="Remove item"
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <div>
                    <span className="text-[10px] text-gray-700 block">Qty</span>
                    <input
                      type="text"
                      value={item.qty}
                      onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-xs text-center font-mono"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-700 block">Rate ({totals.majorUnit})</span>
                    <input
                      type="text"
                      value={item.rate}
                      onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-xs text-right font-mono"
                    />
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-700 block">Amount</span>
                    <span className="font-bold text-gray-900 text-xs font-mono block pt-1">
                      {lineTotal > 0 ? lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Adjustments & Totals */}
      <div className="p-4 space-y-2.5 bg-gray-50/50">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5 text-gray-700" />
          Financial Adjustments
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-medium text-gray-700 mb-0.5">
              Advance Paid ({totals.majorUnit})
            </label>
            <input
              type="number"
              value={invoice.advancePaid || ''}
              onChange={(e) =>
                onUpdateInvoice({ ...invoice, advancePaid: Number(e.target.value) || 0 })
              }
              placeholder="0"
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-700 mb-0.5">
              Discount ({totals.majorUnit})
            </label>
            <input
              type="number"
              value={invoice.discount || ''}
              onChange={(e) =>
                onUpdateInvoice({ ...invoice, discount: Number(e.target.value) || 0 })
              }
              placeholder="0"
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black font-mono"
            />
          </div>
        </div>

        {/* Live Calculation Summary Box */}
        <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-1.5 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span className="font-mono font-medium">
              {totals.majorUnit} {totals.splitSubtotal.major}.{totals.splitSubtotal.minor}
            </span>
          </div>

          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Discount:</span>
              <span className="font-mono text-emerald-600">
                - {totals.majorUnit} {totals.discountAmount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-100">
            <span>Total Bill Amount:</span>
            <span className="font-mono text-sm text-black">
              {totals.majorUnit} {totals.splitNetTotal.major}.{totals.splitNetTotal.minor}
            </span>
          </div>

          {totals.advancePaid > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Advance Paid:</span>
              <span className="font-mono">
                {totals.majorUnit} {totals.splitAdvance.major}.{totals.splitAdvance.minor}
              </span>
            </div>
          )}

          <div className="flex justify-between font-bold text-red-900 bg-red-50/70 p-1.5 rounded -mx-1">
            <span>Balance Due:</span>
            <span className="font-mono text-sm">
              {totals.majorUnit} {totals.splitBalance.major}.{totals.splitBalance.minor}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
