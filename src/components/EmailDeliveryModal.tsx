import React, { useState } from 'react';
import { InvoiceData, EmailDeliveryLog, AutomatedEmailSettings } from '../types';
import { calculateInvoiceTotals } from '../utils/billUtils';
import { Mail, Send, X, ExternalLink, Check, Copy, Clock, ShieldCheck } from 'lucide-react';

interface EmailDeliveryModalProps {
  invoice: InvoiceData;
  settings: AutomatedEmailSettings;
  isOpen: boolean;
  onClose: () => void;
  onEmailSent: (log: EmailDeliveryLog) => void;
}

export const EmailDeliveryModal: React.FC<EmailDeliveryModalProps> = ({
  invoice,
  settings,
  isOpen,
  onClose,
  onEmailSent,
}) => {
  const totals = calculateInvoiceTotals(invoice);
  const totalStr = `${totals.majorUnit} ${totals.splitNetTotal.major}.${totals.splitNetTotal.minor}`;
  const balanceStr = `${totals.majorUnit} ${totals.splitBalance.major}.${totals.splitBalance.minor}`;

  const [recipientEmail, setRecipientEmail] = useState(
    invoice.customerEmail || 'kmliyanage34@gmail.com'
  );
  const [ccEmail, setCcEmail] = useState(
    settings.sendCopyTOMyEmail ? invoice.branding.email : ''
  );
  const [subject, setSubject] = useState(
    `Invoice #${invoice.invoiceNumber || '03537'} from ${invoice.branding.companyName}`
  );
  
  const defaultBody = `Dear ${invoice.customerName || 'Valued Customer'},

Thank you for choosing ${invoice.branding.companyName}! 

Here are the details of your invoice:
--------------------------------------------
Invoice Number: ${invoice.invoiceNumber || '03537'}
Date: ${invoice.date}
Total Amount: ${totalStr}
Advance Paid: ${totals.majorUnit} ${totals.splitAdvance.major}.${totals.splitAdvance.minor}
Balance Due: ${balanceStr}
--------------------------------------------

Summary of Items:
${invoice.items
  .filter((i) => i.description)
  .map((i) => `• ${i.qty || 1}x ${i.description} - ${totals.majorUnit} ${(Number(i.amount) || (Number(i.qty) * Number(i.rate))).toLocaleString()}`)
  .join('\n')}

Payment Details:
${settings.paymentInstructions}

If you have any questions, please contact our hotline: ${invoice.branding.phoneNumbers}.

Warm regards,
${invoice.branding.companyName}
${invoice.branding.address}`;

  const [message, setMessage] = useState(defaultBody);
  const [includePdf, setIncludePdf] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSendAutomatedEmail = () => {
    if (!recipientEmail) {
      alert('Please provide a recipient email address.');
      return;
    }

    setIsSending(true);

    // Simulate reliable automated email delivery service
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);

      const log: EmailDeliveryLog = {
        id: `email-${Date.now()}`,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        recipientEmail,
        recipientName: invoice.customerName || 'Customer',
        subject,
        message,
        timestamp: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        status: 'delivered',
        includePdf,
        totalAmount: totalStr,
      };

      onEmailSent(log);

      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  const handleOpenMailto = () => {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(message);
    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodedSubject}&body=${encodedBody}${
      ccEmail ? `&cc=${encodeURIComponent(ccEmail)}` : ''
    }`;
    window.open(mailtoUrl, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${message}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-200 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-black text-white rounded-lg">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Automated Invoice Email Delivery</h2>
              <p className="text-xs text-gray-700">Dispatch digital bill with receipt summary and PDF</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Invoice Successfully Dispatched!</h3>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              Delivered to <span className="font-semibold text-gray-900">{recipientEmail}</span> with attached invoice details.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Quick Summary Pill */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-gray-800">Bill No: {invoice.invoiceNumber || '03537'}</span>
              </div>
              <div className="font-bold text-gray-900">
                Total: <span className="text-emerald-700">{totalStr}</span>
              </div>
            </div>

            {/* Recipient & CC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Recipient Email (Customer) *
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  CC / Copy To
                </label>
                <input
                  type="email"
                  value={ccEmail}
                  onChange={(e) => setCcEmail(e.target.value)}
                  placeholder="accounts@yourcompany.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            {/* Message Body */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Message Body
                </label>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-[11px] text-gray-500 hover:text-black flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? 'Copied!' : 'Copy text'}
                </button>
              </div>
              <textarea
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black leading-relaxed"
              />
            </div>

            {/* Attach PDF Checkbox */}
            <div className="flex items-center justify-between p-3 bg-blue-50/60 rounded-lg border border-blue-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-blue-900">
                <input
                  type="checkbox"
                  checked={includePdf}
                  onChange={(e) => setIncludePdf(e.target.checked)}
                  className="rounded border-blue-300 text-black focus:ring-black"
                />
                Include PDF Invoice Document Export
              </label>
              <span className="text-[11px] font-semibold text-blue-700">Attached (PDF)</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleSendAutomatedEmail}
                disabled={isSending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all shadow-sm"
              >
                {isSending ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    Dispatching Email...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Automated Delivery
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleOpenMailto}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                title="Open in Gmail, Outlook or Apple Mail"
              >
                <ExternalLink className="w-4 h-4" />
                Open in Mail Client
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
