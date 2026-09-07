import { InvoiceData, AutomatedEmailSettings } from './types';

export const defaultSettings: AutomatedEmailSettings = {
  autoSendOnSave: false,
  sendCopyTOMyEmail: true,
  senderName: 'IDK Design & Printers Accounts',
  replyToEmail: 'idkdesign628@gmail.com',
  defaultEmailSubject: 'Invoice {invoice_no} from {company_name}',
  defaultEmailMessage: `Dear {customer_name},

Please find attached your official invoice {invoice_no} for recent printing services.

Total Amount: {total_amount}
Due Date: {invoice_date}

Thank you for your business! If you have any questions or require modifications, please reply directly to this email or call our hotline.

Warm regards,
{company_name}
Hotline: 077 706 1415 | 076 006 2287`,
  paymentInstructions: 'Bank: Commercial Bank of Ceylon | A/C: 1000249581 | Branch: Padukka | Name: IDK Design & Printers',
};

export const sampleInvoice: InvoiceData = {
  id: 'inv-init-001',
  invoiceNumber: '03537-B',
  date: '2026-09-07',
  customerName: 'Liyanage Wedding Planners & Events',
  customerAddress: 'No. 45, Temple Road, Padukka',
  customerPhone: '077 123 4567',
  customerEmail: 'kmliyanage34@gmail.com',
  currency: 'LKR',
  majorUnit: 'Rs.',
  minorUnit: 'Cts.',
  advancePaid: 50000,
  discount: 0,
  notes: 'Goods once sold will not be taken back without original bill. Payment terms: 50% advance, balance on delivery.',
  terms: 'Thank you for choosing IDK Design & Printers!',
  status: 'issued',
  minRows: 14,
  branding: {
    companyName: 'IDK DESIGN & PRINTERS',
    subName: 'IDK DESIGN & Printers',
    regNo: 'වි.වි.03537',
    address: 'No : 139/A, Kurugala, Padukka.',
    phoneNumbers: '077 706 1415 | 076 006 2287 | 077 079 8810',
    email: 'idkdesign628@gmail.com',
    taglineSinhala: 'ජුවලරි පෙට්ටි, වෙඩින් කාඩ්, කේක් පෙට්ටි, තෑගි පෙට්ටි, බිල් පොත්, විසිටින් කාඩ්, බෑග්, ලිපිකවර',
    taglineEnglish: 'Jewelry Boxes, Wedding Invitations, Cake Boxes, Gift Boxes, Bill Books, Visiting Cards, Bags, Envelopes',
    logoType: 'idk-prism',
    accentColor: '#111827',
    fontStyle: 'classic-serif',
    showBilingualTagline: true,
    showRegNo: true,
  },
  items: [
    {
      id: 'item-1',
      qty: 1000,
      description: 'Wedding Invitation Cards (Embossed & Gold Foil)',
      rate: 125,
      amount: 125000,
    },
    {
      id: 'item-2',
      qty: 500,
      description: 'Custom Cake Boxes (Matte Finish 4x4x2")',
      rate: 65,
      amount: 32500,
    },
    {
      id: 'item-3',
      qty: 5,
      description: 'Duplicate Bill Books (Carbonless 100 Sheets)',
      rate: 1200,
      amount: 6000,
    },
    {
      id: 'item-4',
      qty: 1000,
      description: 'Visiting Cards (Spot UV & Double Sided 350gsm)',
      rate: 8.5,
      amount: 8500,
    },
  ],
};
