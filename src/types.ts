export interface InvoiceItem {
  id: string;
  qty: number | string;
  description: string;
  rate: number | string;
  amount: number;
}

export interface InvoiceBranding {
  companyName: string;
  subName: string;
  regNo: string;
  address: string;
  phoneNumbers: string;
  email: string;
  taglineSinhala: string;
  taglineEnglish: string;
  logoType: 'idk-prism' | 'custom-image' | 'minimal-monogram';
  customLogoUrl?: string;
  accentColor: string;
  fontStyle: 'classic-serif' | 'modern-sans';
  showBilingualTagline: boolean;
  showRegNo: boolean;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  currency: string;
  majorUnit: string; // e.g. "Rs." or "$"
  minorUnit: string; // e.g. "Cts." or "¢"
  items: InvoiceItem[];
  advancePaid: number;
  discount: number;
  notes: string;
  terms: string;
  status: 'draft' | 'issued' | 'paid' | 'sent';
  branding: InvoiceBranding;
  minRows: number; // default number of grid lines (e.g., 12)
}

export interface EmailDeliveryLog {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'delivered' | 'sent' | 'scheduled';
  includePdf: boolean;
  totalAmount: string;
}

export interface AutomatedEmailSettings {
  autoSendOnSave: boolean;
  sendCopyTOMyEmail: boolean;
  senderName: string;
  replyToEmail: string;
  defaultEmailSubject: string;
  defaultEmailMessage: string;
  paymentInstructions: string;
}
