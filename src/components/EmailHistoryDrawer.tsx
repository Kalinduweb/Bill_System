import React from 'react';
import { EmailDeliveryLog } from '../types';
import { Mail, CheckCircle2, Clock, X, RefreshCw, Send } from 'lucide-react';

interface EmailHistoryDrawerProps {
  logs: EmailDeliveryLog[];
  isOpen: boolean;
  onClose: () => void;
  onResend: (log: EmailDeliveryLog) => void;
}

export const EmailHistoryDrawer: React.FC<EmailHistoryDrawerProps> = ({
  logs,
  isOpen,
  onClose,
  onResend,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-black text-white rounded-md">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Email Delivery Logs</h2>
              <p className="text-xs text-gray-500">Automated dispatch status and history</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {logs.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <Mail className="w-10 h-10 mb-2 stroke-1 text-gray-300" />
              <p className="text-sm font-medium text-gray-600">No emails dispatched yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Click "Send Email" to automatically deliver your invoice to clients.
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 shadow-xs space-y-2.5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Delivered
                  </span>
                  <span className="text-[11px] text-gray-600 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />
                    {log.timestamp}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-900 truncate">
                    {log.subject}
                  </div>
                  <div className="text-[12px] text-gray-600 mt-0.5">
                    To: <span className="font-mono text-gray-800">{log.recipientEmail}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100 text-gray-500">
                  <span>Bill #{log.invoiceNumber} • {log.totalAmount}</span>
                  <button
                    type="button"
                    onClick={() => onResend(log)}
                    className="flex items-center gap-1 text-xs text-black font-semibold hover:underline"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Resend
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>{logs.length} emails dispatched</span>
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Service Active
          </span>
        </div>
      </div>
    </div>
  );
};
