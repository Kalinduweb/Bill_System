import React from 'react';
import { InvoiceData, InvoiceItem } from '../types';
import { calculateInvoiceTotals, formatMajorMinor } from '../utils/billUtils';
import { IdkPrismLogo } from './IdkPrismLogo';
import { Plus, Trash2 } from 'lucide-react';

interface BillPreviewProps {
  invoice: InvoiceData;
  onUpdateInvoice?: (updated: InvoiceData) => void;
  isInteractive?: boolean;
  scale?: number;
}

export const BillPreview: React.FC<BillPreviewProps> = ({
  invoice,
  onUpdateInvoice,
  isInteractive = true,
  scale = 1,
}) => {
  const { branding, items } = invoice;
  const totals = calculateInvoiceTotals(invoice);

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    if (!onUpdateInvoice) return;
    const newItems = [...items];
    const currentItem = { ...newItems[index] };

    if (field === 'qty') {
      const numQty = value === '' ? '' : Number(value);
      currentItem.qty = isNaN(Number(numQty)) ? value : numQty;
      const rateVal = Number(currentItem.rate) || 0;
      currentItem.amount = (Number(currentItem.qty) || 0) * rateVal;
    } else if (field === 'rate') {
      const numRate = value === '' ? '' : Number(value);
      currentItem.rate = isNaN(Number(numRate)) ? value : numRate;
      const qtyVal = Number(currentItem.qty) || 0;
      currentItem.amount = qtyVal * (Number(currentItem.rate) || 0);
    } else if (field === 'description') {
      currentItem.description = String(value);
    }

    newItems[index] = currentItem;
    onUpdateInvoice({ ...invoice, items: newItems });
  };

  const handleAddItem = (afterIndex?: number) => {
    if (!onUpdateInvoice) return;
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      qty: 1,
      description: '',
      rate: 0,
      amount: 0,
    };
    if (afterIndex !== undefined) {
      const updated = [...items];
      updated.splice(afterIndex + 1, 0, newItem);
      onUpdateInvoice({ ...invoice, items: updated });
    } else {
      onUpdateInvoice({ ...invoice, items: [...items, newItem] });
    }
  };

  const handleRemoveItem = (index: number) => {
    if (!onUpdateInvoice) return;
    if (items.length <= 1) {
      // Clear instead of removing last item
      onUpdateInvoice({
        ...invoice,
        items: [{ id: `item-${Date.now()}`, qty: '', description: '', rate: '', amount: 0 }],
      });
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    onUpdateInvoice({ ...invoice, items: updated });
  };

  const totalDisplayRows = Math.max(invoice.minRows || 12, items.length);
  const emptyRowsCount = Math.max(0, totalDisplayRows - items.length);

  // Font class selection
  const fontHeading = branding.fontStyle === 'modern-sans' ? 'font-sans font-bold tracking-tight' : 'font-cinzel tracking-wider';
  const fontSerif = branding.fontStyle === 'modern-sans' ? 'font-sans' : 'font-serif-bill';

  return (
    <div
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      className="transition-transform duration-200"
    >
      <div
        id="bill-paper-container"
        className="bill-print-target bg-white text-black mx-auto shadow-xl border border-gray-300 rounded-sm p-6 sm:p-10 select-text"
        style={{
          width: '100%',
          maxWidth: '780px',
          minHeight: '1050px',
          color: branding.accentColor || '#111827',
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
        }}
      >
        {/* HEADER SECTION */}
        <div className="flex flex-row justify-between items-start gap-4">
          {/* Left Column: Logo + Sub branding + Reg No */}
          <div className="w-[38%] flex flex-col items-center text-center">
            {branding.logoType === 'idk-prism' && (
              <IdkPrismLogo
                size={82}
                color={branding.accentColor || '#111827'}
                className="mb-1"
              />
            )}
            {branding.logoType === 'custom-image' && branding.customLogoUrl && (
              <img
                src={branding.customLogoUrl}
                alt="Company Logo"
                className="max-h-20 max-w-[140px] object-contain mb-1.5"
              />
            )}
            {branding.logoType === 'minimal-monogram' && (
              <div
                className="w-16 h-16 rounded border-2 border-black flex items-center justify-center font-bold text-2xl mb-1"
                style={{ borderColor: branding.accentColor }}
              >
                {branding.companyName.slice(0, 3)}
              </div>
            )}

            <div className={`text-sm sm:text-base font-bold tracking-wide ${fontHeading} uppercase mt-0.5`}>
              {branding.subName || branding.companyName}
            </div>

            {branding.showRegNo && branding.regNo && (
              <div className="text-[12px] sm:text-[13px] text-gray-800 font-medium tracking-tight mt-0.5">
                Re.No : {branding.regNo}
              </div>
            )}
          </div>

          {/* Right Column: Big Title, Address, Phones, Email */}
          <div className="w-[60%] flex flex-col items-center text-center pl-2">
            <h1
              className={`text-2xl sm:text-3xl lg:text-[34px] leading-tight font-extrabold tracking-wide uppercase ${fontHeading}`}
              style={{ color: branding.accentColor }}
            >
              {branding.companyName}
            </h1>

            <div className="text-[13px] sm:text-[14px] font-medium text-gray-900 mt-2">
              {branding.address}
            </div>

            <div className="text-[12px] sm:text-[13px] font-semibold text-gray-900 tracking-tight mt-0.5">
              {branding.phoneNumbers}
            </div>

            {branding.email && (
              <div className="text-[12px] sm:text-[13px] text-gray-800 tracking-tight mt-0.5">
                {branding.email}
              </div>
            )}
          </div>
        </div>

        {/* TOP DIVIDER LINE */}
        <div className="w-full h-[1.5px] bg-black my-2.5" style={{ backgroundColor: branding.accentColor }} />

        {/* BILINGUAL TAGLINE (Sinhala & English) */}
        {branding.showBilingualTagline && (
          <div className="text-center my-1">
            {branding.taglineSinhala && (
              <p className="text-[11px] sm:text-[12px] text-gray-900 font-medium tracking-tight leading-relaxed">
                {branding.taglineSinhala}
              </p>
            )}
            {branding.taglineEnglish && (
              <p className={`text-[11.5px] sm:text-[12.5px] text-gray-900 leading-snug font-serif ${fontSerif}`}>
                {branding.taglineEnglish}
              </p>
            )}
          </div>
        )}

        {/* CUSTOMER INFO & DATE */}
        <div className="mt-3.5 mb-2.5 space-y-1.5 text-[13px] sm:text-[14px] text-gray-900 font-medium">
          <div className="flex flex-row items-baseline justify-between gap-3">
            <div className="flex-1 flex items-baseline">
              <span className="font-semibold whitespace-nowrap mr-1.5">M/s :</span>
              {isInteractive && onUpdateInvoice ? (
                <input
                  type="text"
                  value={invoice.customerName}
                  onChange={(e) =>
                    onUpdateInvoice({ ...invoice, customerName: e.target.value })
                  }
                  placeholder="Customer / Company Name"
                  className="w-full border-b border-dotted border-gray-500 focus:border-black focus:outline-none bg-transparent px-1 py-0.5 text-gray-900 font-semibold"
                />
              ) : (
                <span className="flex-1 border-b border-dotted border-gray-600 pb-0.5 font-semibold">
                  {invoice.customerName || '....................................................................................'}
                </span>
              )}
            </div>

            <div className="w-44 flex items-baseline justify-end">
              <span className="font-semibold whitespace-nowrap mr-1.5">Date :</span>
              {isInteractive && onUpdateInvoice ? (
                <input
                  type="text"
                  value={invoice.date}
                  onChange={(e) =>
                    onUpdateInvoice({ ...invoice, date: e.target.value })
                  }
                  placeholder="DD/MM/YYYY"
                  className="w-28 border-b border-dotted border-gray-500 focus:border-black focus:outline-none bg-transparent px-1 py-0.5 text-center text-gray-900 font-medium"
                />
              ) : (
                <span className="border-b border-dotted border-gray-600 pb-0.5 text-right w-24">
                  {invoice.date || '................'}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-row items-baseline justify-between gap-3">
            <div className="flex-1 flex items-baseline">
              <span className="font-semibold whitespace-nowrap mr-1.5">Address :</span>
              {isInteractive && onUpdateInvoice ? (
                <input
                  type="text"
                  value={invoice.customerAddress}
                  onChange={(e) =>
                    onUpdateInvoice({ ...invoice, customerAddress: e.target.value })
                  }
                  placeholder="Street, City, Postal Code"
                  className="w-full border-b border-dotted border-gray-500 focus:border-black focus:outline-none bg-transparent px-1 py-0.5 text-gray-900"
                />
              ) : (
                <span className="flex-1 border-b border-dotted border-gray-600 pb-0.5">
                  {invoice.customerAddress || '...............................................................................................................'}
                </span>
              )}
            </div>

            {invoice.invoiceNumber && (
              <div className="w-44 flex items-baseline justify-end text-[12px] text-gray-700">
                <span className="font-bold mr-1">No :</span>
                <span className="font-mono font-bold text-black">{invoice.invoiceNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* INVOICE TABLE (GRID) */}
        <div
          className="w-full border-[1.5px] border-black mt-2 text-[13px] sm:text-[14px]"
          style={{ borderColor: branding.accentColor }}
        >
          {/* Table Header */}
          <div
            className="flex flex-row font-bold border-b-[1.5px] border-black bg-gray-50/50 text-center uppercase tracking-tight py-1"
            style={{ borderColor: branding.accentColor }}
          >
            <div className="w-[11%] border-r border-black py-1 px-1 flex items-center justify-center">
              Qty
            </div>
            <div className="w-[55%] border-r border-black py-1 px-2 text-center">
              DESCRIPTION
            </div>
            <div className="w-[14%] border-r border-black py-1 px-1 flex items-center justify-center">
              Rate
            </div>
            <div className="w-[13%] border-r border-black py-1 px-1 flex items-center justify-center">
              {totals.majorUnit}
            </div>
            <div className="w-[7%] py-1 px-0.5 flex items-center justify-center text-[12px]">
              {totals.minorUnit}
            </div>
          </div>

          {/* Table Rows: Filled Items */}
          {items.map((item, idx) => {
            const qtyNum = Number(item.qty) || 0;
            const rateNum = Number(item.rate) || 0;
            const lineTotal = item.amount !== undefined && item.amount > 0 ? item.amount : qtyNum * rateNum;
            const split = formatMajorMinor(lineTotal);

            return (
              <div
                key={item.id || idx}
                className="group relative flex flex-row border-b border-black min-h-[28px] sm:min-h-[30px] items-stretch hover:bg-amber-50/20"
                style={{ borderColor: branding.accentColor }}
              >
                {/* Qty Cell */}
                <div className="w-[11%] border-r border-black px-1 py-1 flex items-center justify-center text-center">
                  {isInteractive && onUpdateInvoice ? (
                    <input
                      type="text"
                      value={item.qty}
                      onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                      className="w-full text-center bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-[13px]"
                    />
                  ) : (
                    <span>{item.qty !== 0 ? item.qty : ''}</span>
                  )}
                </div>

                {/* Description Cell */}
                <div className="w-[55%] border-r border-black px-2 py-1 flex items-center">
                  {isInteractive && onUpdateInvoice ? (
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      placeholder="Enter item description..."
                      className="w-full bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-[13px]"
                    />
                  ) : (
                    <span className="font-normal">{item.description}</span>
                  )}
                </div>

                {/* Rate Cell */}
                <div className="w-[14%] border-r border-black px-1.5 py-1 flex items-center justify-end text-right">
                  {isInteractive && onUpdateInvoice ? (
                    <input
                      type="text"
                      value={item.rate}
                      onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                      className="w-full text-right bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-black text-[13px]"
                    />
                  ) : (
                    <span>
                      {item.rate !== 0 ? Number(item.rate).toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}
                    </span>
                  )}
                </div>

                {/* Major Amount (Rs.) */}
                <div className="w-[13%] border-r border-black px-1.5 py-1 flex items-center justify-end font-medium text-right">
                  <span>{lineTotal > 0 ? split.major : ''}</span>
                </div>

                {/* Minor Amount (Cts.) */}
                <div className="w-[7%] px-0.5 py-1 flex items-center justify-center text-[12px] font-medium text-center">
                  <span>{lineTotal > 0 ? split.minor : ''}</span>
                </div>

                {/* Hover control for quick row manipulation in interactive view */}
                {isInteractive && onUpdateInvoice && (
                  <div className="no-print absolute -left-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-white shadow-sm border border-gray-300 rounded px-0.5 py-0.5 z-10">
                    <button
                      type="button"
                      onClick={() => handleAddItem(idx)}
                      title="Insert row below"
                      className="p-1 hover:bg-gray-100 rounded text-gray-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        title="Delete row"
                        className="p-1 hover:bg-red-50 rounded text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Blank Grid Lines for Physical Bill Book Realism */}
          {Array.from({ length: emptyRowsCount }).map((_, emptyIdx) => (
            <div
              key={`empty-${emptyIdx}`}
              className="flex flex-row border-b border-black min-h-[26px] sm:min-h-[28px]"
              style={{ borderColor: branding.accentColor }}
            >
              <div className="w-[11%] border-r border-black" />
              <div className="w-[55%] border-r border-black" />
              <div className="w-[14%] border-r border-black" />
              <div className="w-[13%] border-r border-black" />
              <div className="w-[7%]" />
            </div>
          ))}

          {/* BOTTOM ROW: AMOUNT (TOTAL) */}
          <div
            className="flex flex-row font-bold text-center border-t border-black bg-gray-50/30"
            style={{ borderColor: branding.accentColor }}
          >
            <div className="w-[80%] border-r border-black py-1.5 px-3 text-right uppercase tracking-wider text-[13px] sm:text-[14px]">
              AMOUNT
            </div>
            <div className="w-[13%] border-r border-black py-1.5 px-1.5 text-right font-bold text-[13px] sm:text-[14px]">
              {totals.splitSubtotal.major}
            </div>
            <div className="w-[7%] py-1.5 px-0.5 text-center font-bold text-[12px] flex items-center justify-center">
              {totals.splitSubtotal.minor}
            </div>
          </div>
        </div>

        {/* ADVANCE & BALANCE SUMMARY (IF APPLICABLE) */}
        {(totals.advancePaid > 0 || totals.discountAmount > 0) && (
          <div className="mt-2.5 flex justify-end">
            <div
              className="w-72 border border-black text-[12px] divide-y divide-black font-medium"
              style={{ borderColor: branding.accentColor }}
            >
              {totals.discountAmount > 0 && (
                <div className="flex justify-between px-2 py-0.5">
                  <span className="text-gray-700">Discount:</span>
                  <span>
                    - {totals.majorUnit} {totals.discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              {totals.advancePaid > 0 && (
                <div className="flex justify-between px-2 py-0.5 bg-emerald-50/50">
                  <span className="text-gray-700">Advance Paid:</span>
                  <span className="font-semibold text-emerald-800">
                    {totals.majorUnit} {totals.splitAdvance.major}.{totals.splitAdvance.minor}
                  </span>
                </div>
              )}
              <div className="flex justify-between px-2 py-1 font-bold bg-amber-50/40">
                <span>Balance Due:</span>
                <span className="text-[13px] text-red-900">
                  {totals.majorUnit} {totals.splitBalance.major}.{totals.splitBalance.minor}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SIGNATURE & FOOTER SECTION */}
        <div className="mt-12 pt-4 flex flex-row justify-between items-end text-[13px] text-gray-900">
          {/* Notes or Authorized Signature */}
          <div className="w-1/2 pr-4">
            {invoice.notes && (
              <p className="text-[11px] text-gray-600 leading-tight italic max-w-xs">
                {invoice.notes}
              </p>
            )}
          </div>

          {/* Customer Signature matching reference photo */}
          <div className="w-56 text-center flex flex-col items-center">
            <div className="w-48 border-b border-dotted border-gray-600 mb-1.5" />
            <div className="text-[13px] sm:text-[14px] font-serif font-semibold tracking-wide">
              Customer Sign
            </div>
          </div>
        </div>

        {/* WATERMARK / PRINT FOOTER */}
        <div className="mt-6 pt-2 text-center text-[10px] text-gray-500 border-t border-gray-100">
          {invoice.terms || 'Professional Print Quality • Thank you for your custom!'}
        </div>
      </div>
    </div>
  );
};
