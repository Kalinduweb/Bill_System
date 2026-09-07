import React, { useState, useEffect } from 'react';
import { InvoiceData, EmailDeliveryLog, InvoiceBranding, AutomatedEmailSettings } from './types';
import { sampleInvoice, defaultSettings } from './initialData';
import { BillPreview } from './components/BillPreview';
import { BillToolbar } from './components/BillToolbar';
import { BillSideEditor } from './components/BillSideEditor';
import { BrandingSettingsModal } from './components/BrandingSettingsModal';
import { EmailDeliveryModal } from './components/EmailDeliveryModal';
import { EmailHistoryDrawer } from './components/EmailHistoryDrawer';
import { SavedInvoicesModal } from './components/SavedInvoicesModal';
import { exportBillToPdf } from './utils/billUtils';
import { Sparkles, CheckCircle2, AlertCircle, FileText, Info } from 'lucide-react';

const STORAGE_INVOICES_KEY = 'idk_bill_generator_invoices_v1';
const STORAGE_EMAIL_LOGS_KEY = 'idk_bill_generator_email_logs_v1';
const STORAGE_CURRENT_ID_KEY = 'idk_bill_generator_current_id_v1';

export default function App() {
  // Invoices list in localStorage
  const [invoices, setInvoices] = useState<InvoiceData[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_INVOICES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading invoices from storage', e);
    }
    return [sampleInvoice];
  });

  // Current active invoice
  const [currentId, setCurrentId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CURRENT_ID_KEY);
      if (stored) return stored;
    } catch (e) {}
    return sampleInvoice.id;
  });

  // Email delivery logs
  const [emailLogs, setEmailLogs] = useState<EmailDeliveryLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_EMAIL_LOGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading email logs', e);
    }
    return [];
  });

  // Email settings
  const [emailSettings, setEmailSettings] = useState<AutomatedEmailSettings>(defaultSettings);

  // Active invoice object
  const currentInvoice = invoices.find((inv) => inv.id === currentId) || invoices[0] || sampleInvoice;

  // View & UI states
  const [scale, setScale] = useState(1);
  const [showSideEditor, setShowSideEditor] = useState(true);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & Drawers
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_INVOICES_KEY, JSON.stringify(invoices));
    } catch (e) {
      console.error('Failed to save invoices', e);
    }
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CURRENT_ID_KEY, currentId);
    } catch (e) {}
  }, [currentId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_EMAIL_LOGS_KEY, JSON.stringify(emailLogs));
    } catch (e) {}
  }, [emailLogs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleUpdateCurrentInvoice = (updated: InvoiceData) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === updated.id ? updated : inv)));
  };

  const handleUpdateBranding = (branding: InvoiceBranding) => {
    handleUpdateCurrentInvoice({
      ...currentInvoice,
      branding,
    });
    showToast('Branding updated successfully!');
  };

  const handleUpdateCurrency = ({
    currency,
    majorUnit,
    minorUnit,
  }: {
    currency: string;
    majorUnit: string;
    minorUnit: string;
  }) => {
    handleUpdateCurrentInvoice({
      ...currentInvoice,
      currency,
      majorUnit,
      minorUnit,
    });
    showToast(`Currency updated to ${currency} (${majorUnit}/${minorUnit})`);
  };

  const handleResetToDefaultTemplate = () => {
    if (confirm('Reset branding and template to the authentic IDK DESIGN & PRINTERS preset?')) {
      handleUpdateCurrentInvoice({
        ...currentInvoice,
        branding: sampleInvoice.branding,
        majorUnit: sampleInvoice.majorUnit,
        minorUnit: sampleInvoice.minorUnit,
        currency: sampleInvoice.currency,
      });
      showToast('Reset to original IDK template');
    }
  };

  const handleExportPdf = async (paperSize: 'a4' | 'a5' = 'a4') => {
    setIsExportingPdf(true);
    try {
      await exportBillToPdf(
        'bill-paper-container',
        currentInvoice.invoiceNumber || '03537',
        paperSize
      );
      showToast(`Bill #${currentInvoice.invoiceNumber || '03537'} exported to PDF!`);
    } catch (err) {
      console.error('PDF export error:', err);
      showToast('Failed to export PDF. Try Print -> Save as PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailSent = (log: EmailDeliveryLog) => {
    setEmailLogs((prev) => [log, ...prev]);
    handleUpdateCurrentInvoice({
      ...currentInvoice,
      status: 'sent',
    });
    showToast(`Invoice #${currentInvoice.invoiceNumber} delivered to ${log.recipientEmail}!`);
  };

  const handleCreateNewInvoice = () => {
    const newInv: InvoiceData = {
      ...sampleInvoice,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      customerName: '',
      customerAddress: '',
      customerEmail: '',
      customerPhone: '',
      advancePaid: 0,
      discount: 0,
      status: 'draft',
      items: [
        { id: `item-1`, qty: 1, description: '', rate: 0, amount: 0 },
        { id: `item-2`, qty: 1, description: '', rate: 0, amount: 0 },
        { id: `item-3`, qty: 1, description: '', rate: 0, amount: 0 },
      ],
    };
    setInvoices((prev) => [newInv, ...prev]);
    setCurrentId(newInv.id);
    showToast('New blank bill created!');
  };

  const handleDuplicateInvoice = (invoiceToDuplicate: InvoiceData) => {
    const dup: InvoiceData = {
      ...invoiceToDuplicate,
      id: `inv-${Date.now()}`,
      invoiceNumber: `${invoiceToDuplicate.invoiceNumber}-COPY`,
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
    };
    setInvoices((prev) => [dup, ...prev]);
    setCurrentId(dup.id);
    showToast(`Duplicated as #${dup.invoiceNumber}`);
  };

  const handleDeleteInvoice = (idToDelete: string) => {
    if (invoices.length <= 1) {
      alert('You must have at least one invoice.');
      return;
    }
    if (confirm('Delete this saved invoice?')) {
      const remaining = invoices.filter((i) => i.id !== idToDelete);
      setInvoices(remaining);
      if (currentId === idToDelete) {
        setCurrentId(remaining[0].id);
      }
      showToast('Invoice deleted');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 text-gray-900 flex flex-col font-sans">
      {/* Top Application Toolbar */}
      <BillToolbar
        onExportPdf={handleExportPdf}
        onPrint={handlePrint}
        onOpenEmailModal={() => setIsEmailModalOpen(true)}
        onOpenBrandingModal={() => setIsBrandingModalOpen(true)}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryDrawerOpen(true)}
        onCreateNew={handleCreateNewInvoice}
        isExportingPdf={isExportingPdf}
        scale={scale}
        onScaleChange={setScale}
        showSideEditor={showSideEditor}
        onToggleSideEditor={() => setShowSideEditor(!showSideEditor)}
        emailLogsCount={emailLogs.length}
        savedInvoicesCount={invoices.length}
        invoiceStatus={currentInvoice.status}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 items-start justify-center">
        {/* Left Side: Form Editor (collapsible) */}
        {showSideEditor && (
          <aside className="no-print w-full lg:w-[380px] shrink-0">
            <div className="sticky top-20">
              <BillSideEditor
                invoice={currentInvoice}
                onUpdateInvoice={handleUpdateCurrentInvoice}
              />
            </div>
          </aside>
        )}

        {/* Right Side: Interactive Authentic Bill Paper */}
        <section className="flex-1 w-full flex flex-col items-center justify-start overflow-x-auto pb-16">
          {/* Quick Notice Banner */}
          <div className="no-print w-full max-w-[780px] mb-3 flex items-center justify-between text-xs text-gray-700 bg-white/90 border border-gray-200/80 px-4 py-2 rounded-lg shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                <strong>Live Interactive Bill Book:</strong> Click directly on rows or fields to edit in-place.
              </span>
            </div>
            <span className="hidden sm:inline font-mono font-bold text-gray-700">
              Bill #{currentInvoice.invoiceNumber || '03537'}
            </span>
          </div>

          {/* Authentic Bill Canvas Container */}
          <div className="w-full flex justify-center py-2">
            <BillPreview
              invoice={currentInvoice}
              onUpdateInvoice={handleUpdateCurrentInvoice}
              isInteractive={true}
              scale={scale}
            />
          </div>
        </section>
      </main>

      {/* Modals & Drawers */}
      <BrandingSettingsModal
        branding={currentInvoice.branding}
        onUpdateBranding={handleUpdateBranding}
        isOpen={isBrandingModalOpen}
        onClose={() => setIsBrandingModalOpen(false)}
        currency={currentInvoice.currency}
        majorUnit={currentInvoice.majorUnit}
        minorUnit={currentInvoice.minorUnit}
        onUpdateCurrency={handleUpdateCurrency}
        onResetToDefault={handleResetToDefaultTemplate}
      />

      <EmailDeliveryModal
        invoice={currentInvoice}
        settings={emailSettings}
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onEmailSent={handleEmailSent}
      />

      <SavedInvoicesModal
        invoices={invoices}
        currentInvoiceId={currentInvoice.id}
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onSelectInvoice={(inv) => setCurrentId(inv.id)}
        onCreateNewInvoice={handleCreateNewInvoice}
        onDuplicateInvoice={handleDuplicateInvoice}
        onDeleteInvoice={handleDeleteInvoice}
      />

      <EmailHistoryDrawer
        logs={emailLogs}
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        onResend={(log) => {
          setIsHistoryDrawerOpen(false);
          setIsEmailModalOpen(true);
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="no-print fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
