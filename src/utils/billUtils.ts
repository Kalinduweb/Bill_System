import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceData } from '../types';

export interface InvoiceCalculations {
  subtotal: number;
  discountAmount: number;
  netTotal: number;
  advancePaid: number;
  balanceDue: number;
  majorUnit: string;
  minorUnit: string;
  splitSubtotal: { major: string; minor: string };
  splitNetTotal: { major: string; minor: string };
  splitAdvance: { major: string; minor: string };
  splitBalance: { major: string; minor: string };
}

export function formatMajorMinor(value: number): { major: string; minor: string } {
  if (isNaN(value) || value === null || value === undefined) {
    return { major: '0', minor: '00' };
  }
  const rounded = Math.round(value * 100) / 100;
  const parts = rounded.toFixed(2).split('.');
  const majorFormatted = Number(parts[0]).toLocaleString('en-US');
  const minorFormatted = parts[1] || '00';
  return { major: majorFormatted, minor: minorFormatted };
}

export function calculateInvoiceTotals(invoice: InvoiceData): InvoiceCalculations {
  const subtotal = invoice.items.reduce((acc, item) => {
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;
    const itemAmount = item.amount !== undefined && !isNaN(item.amount) && item.amount > 0 
      ? item.amount 
      : qty * rate;
    return acc + itemAmount;
  }, 0);

  const discountAmount = Number(invoice.discount) || 0;
  const netTotal = Math.max(0, subtotal - discountAmount);
  const advancePaid = Number(invoice.advancePaid) || 0;
  const balanceDue = Math.max(0, netTotal - advancePaid);

  return {
    subtotal,
    discountAmount,
    netTotal,
    advancePaid,
    balanceDue,
    majorUnit: invoice.majorUnit || 'Rs.',
    minorUnit: invoice.minorUnit || 'Cts.',
    splitSubtotal: formatMajorMinor(subtotal),
    splitNetTotal: formatMajorMinor(netTotal),
    splitAdvance: formatMajorMinor(advancePaid),
    splitBalance: formatMajorMinor(balanceDue),
  };
}

export async function exportBillToPdf(
  elementId: string,
  invoiceNumber: string,
  paperSize: 'a4' | 'a5' = 'a4'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Invoice preview element not found');
  }

  // Create high-res canvas representation
  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 1024,
  });

  const imgData = canvas.toDataURL('image/png', 1.0);

  const pdfWidth = paperSize === 'a4' ? 210 : 148;
  const pdfHeight = paperSize === 'a4' ? 297 : 210;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: paperSize,
  });

  // Center on page with 8mm margin
  const margin = 8;
  const contentWidth = pdfWidth - margin * 2;
  const contentHeight = (canvas.height * contentWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, Math.min(contentHeight, pdfHeight - margin * 2));
  
  const cleanInvNo = invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, '_');
  pdf.save(`Bill_${cleanInvNo}.pdf`);
  return true;
}

export function numberToWords(amount: number, currencyName = 'Rupees'): string {
  if (amount === 0) return `Zero ${currencyName} Only`;

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertLessThanOneThousand(n: number): string {
    let result = '';
    if (n >= 100) {
      result += units[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 10 && n <= 19) {
      result += teens[n - 10] + ' ';
    } else if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      if (n % 10 > 0) {
        result += units[n % 10] + ' ';
      }
    } else if (n > 0) {
      result += units[n] + ' ';
    }
    return result.trim();
  }

  const intPart = Math.floor(amount);
  const centsPart = Math.round((amount - intPart) * 100);

  let remaining = intPart;
  let words = '';

  const crores = Math.floor(remaining / 10000000);
  if (crores > 0) {
    words += convertLessThanOneThousand(crores) + ' Crore ';
    remaining %= 10000000;
  }

  const lakhs = Math.floor(remaining / 100000);
  if (lakhs > 0) {
    words += convertLessThanOneThousand(lakhs) + ' Lakh ';
    remaining %= 100000;
  }

  const thousands = Math.floor(remaining / 1000);
  if (thousands > 0) {
    words += convertLessThanOneThousand(thousands) + ' Thousand ';
    remaining %= 1000;
  }

  if (remaining > 0) {
    words += convertLessThanOneThousand(remaining) + ' ';
  }

  let finalWords = words.trim() + ` ${currencyName}`;
  if (centsPart > 0) {
    finalWords += ` and ${convertLessThanOneThousand(centsPart)} Cents`;
  }
  finalWords += ' Only';

  return finalWords;
}
