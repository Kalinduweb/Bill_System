import React, { useRef } from 'react';
import { InvoiceBranding } from '../types';
import { Palette, X, RotateCcw, Image, Sparkles } from 'lucide-react';
import { IdkPrismLogo } from './IdkPrismLogo';

interface BrandingSettingsModalProps {
  branding: InvoiceBranding;
  onUpdateBranding: (updated: InvoiceBranding) => void;
  isOpen: boolean;
  onClose: () => void;
  currency: string;
  majorUnit: string;
  minorUnit: string;
  onUpdateCurrency: (curr: { currency: string; majorUnit: string; minorUnit: string }) => void;
  onResetToDefault: () => void;
}

const INK_PRESETS = [
  { name: 'Charcoal Ink', color: '#111827' },
  { name: 'Pure Black', color: '#000000' },
  { name: 'Deep Navy', color: '#1e3a8a' },
  { name: 'Dark Emerald', color: '#064e3b' },
  { name: 'Burgundy', color: '#831843' },
];

const CURRENCY_PRESETS = [
  { code: 'LKR', major: 'Rs.', minor: 'Cts.', label: 'Sri Lanka Rupee (Rs. / Cts.)' },
  { code: 'USD', major: '$', minor: '¢', label: 'US Dollar ($ / ¢)' },
  { code: 'EUR', major: '€', minor: 'c', label: 'Euro (€ / c)' },
  { code: 'GBP', major: '£', minor: 'p', label: 'British Pound (£ / p)' },
  { code: 'INR', major: '₹', minor: 'p', label: 'Indian Rupee (₹ / p)' },
  { code: 'AED', major: 'AED', minor: 'Fils', label: 'UAE Dirham (AED / Fils)' },
];

export const BrandingSettingsModal: React.FC<BrandingSettingsModalProps> = ({
  branding,
  onUpdateBranding,
  isOpen,
  onClose,
  currency,
  majorUnit,
  minorUnit,
  onUpdateCurrency,
  onResetToDefault,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          onUpdateBranding({
            ...branding,
            logoType: 'custom-image',
            customLogoUrl: uploadEvent.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-black text-white rounded-lg">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Custom Branding & Template Settings</h2>
              <p className="text-xs text-gray-700">Configure business identity, typography, and paper layout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Logo Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Brand Logo
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* IDK Prism Logo Preset */}
              <button
                type="button"
                onClick={() => onUpdateBranding({ ...branding, logoType: 'idk-prism' })}
                className={`p-3 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                  branding.logoType === 'idk-prism'
                    ? 'border-black bg-gray-50 ring-1 ring-black'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <IdkPrismLogo size={36} color={branding.accentColor} />
                <span className="text-xs font-semibold text-gray-800">IDK Prism Logo</span>
                <span className="text-[10px] text-gray-700">Authentic Bill Style</span>
              </button>

              {/* Upload Custom Image */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-3 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                  branding.logoType === 'custom-image'
                    ? 'border-black bg-gray-50 ring-1 ring-black'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {branding.customLogoUrl ? (
                  <img
                    src={branding.customLogoUrl}
                    alt="Logo"
                    className="h-9 max-w-[80px] object-contain"
                  />
                ) : (
                  <Image className="w-7 h-7 text-gray-400" />
                )}
                <span className="text-xs font-semibold text-gray-800">Upload Your Logo</span>
                <span className="text-[10px] text-gray-700">PNG, JPG or SVG</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Monogram */}
              <button
                type="button"
                onClick={() => onUpdateBranding({ ...branding, logoType: 'minimal-monogram' })}
                className={`p-3 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                  branding.logoType === 'minimal-monogram'
                    ? 'border-black bg-gray-50 ring-1 ring-black'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-8 h-8 rounded border border-gray-800 flex items-center justify-center font-bold text-xs">
                  {branding.companyName.slice(0, 3)}
                </div>
                <span className="text-xs font-semibold text-gray-800">Monogram Initials</span>
                <span className="text-[10px] text-gray-700">Minimal Clean</span>
              </button>
            </div>
          </div>

          {/* Business Details */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Company / Business Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Company / Store Name</label>
                <input
                  type="text"
                  value={branding.companyName}
                  onChange={(e) => onUpdateBranding({ ...branding, companyName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subtitle / Department</label>
                <input
                  type="text"
                  value={branding.subName}
                  onChange={(e) => onUpdateBranding({ ...branding, subName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Business Registration No.</label>
                <input
                  type="text"
                  value={branding.regNo}
                  onChange={(e) => onUpdateBranding({ ...branding, regNo: e.target.value })}
                  placeholder="e.g. වි.වි.03537 or REG-8921"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone Numbers</label>
                <input
                  type="text"
                  value={branding.phoneNumbers}
                  onChange={(e) => onUpdateBranding({ ...branding, phoneNumbers: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={branding.address}
                onChange={(e) => onUpdateBranding({ ...branding, address: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={branding.email}
                onChange={(e) => onUpdateBranding({ ...branding, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
          </div>

          {/* Bilingual Tagline / Products */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Products & Services Banner Line
              </h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-600">
                <input
                  type="checkbox"
                  checked={branding.showBilingualTagline}
                  onChange={(e) => onUpdateBranding({ ...branding, showBilingualTagline: e.target.checked })}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                Show on Invoice
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Sinhala / Native Tagline</label>
              <input
                type="text"
                value={branding.taglineSinhala}
                onChange={(e) => onUpdateBranding({ ...branding, taglineSinhala: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">English Tagline</label>
              <input
                type="text"
                value={branding.taglineEnglish}
                onChange={(e) => onUpdateBranding({ ...branding, taglineEnglish: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
          </div>

          {/* Ink & Color Theme */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Print Ink Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {INK_PRESETS.map((preset) => (
                <button
                  key={preset.color}
                  type="button"
                  onClick={() => onUpdateBranding({ ...branding, accentColor: preset.color })}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                    branding.accentColor === preset.color
                      ? 'border-black ring-1 ring-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20"
                    style={{ backgroundColor: preset.color }}
                  />
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Font Typography Style */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Typography Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onUpdateBranding({ ...branding, fontStyle: 'classic-serif' })}
                className={`p-3 rounded-lg border text-left transition-all ${
                  branding.fontStyle === 'classic-serif'
                    ? 'border-black bg-gray-50 ring-1 ring-black'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-cinzel text-sm font-bold text-gray-900">CLASSIC PRINT SHOP</div>
                <div className="text-[11px] text-gray-700 mt-0.5">Cinzel & Cormorant Garamond (Authentic Bill Book)</div>
              </button>

              <button
                type="button"
                onClick={() => onUpdateBranding({ ...branding, fontStyle: 'modern-sans' })}
                className={`p-3 rounded-lg border text-left transition-all ${
                  branding.fontStyle === 'modern-sans'
                    ? 'border-black bg-gray-50 ring-1 ring-black'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-sans text-sm font-bold text-gray-900">MODERN CORPORATE</div>
                <div className="text-[11px] text-gray-700 mt-0.5">Plus Jakarta Sans clean modern display</div>
              </button>
            </div>
          </div>

          {/* Currency Configuration */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Currency & Units
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CURRENCY_PRESETS.map((p) => (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => onUpdateCurrency({ currency: p.code, majorUnit: p.major, minorUnit: p.minor })}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    currency === p.code
                      ? 'border-black bg-gray-50 ring-1 ring-black'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xs font-bold text-gray-900">{p.code} ({p.major} / {p.minor})</div>
                  <div className="text-[10px] text-gray-700 truncate">{p.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onResetToDefault}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-black font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to IDK Template
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            Save & Apply Branding
          </button>
        </div>
      </div>
    </div>
  );
};
