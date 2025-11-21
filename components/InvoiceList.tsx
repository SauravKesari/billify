import React from 'react';
import { Invoice } from '../types';
import { FileText, Download, CheckCircle, XCircle, Pencil } from 'lucide-react';
import { PdfService } from '../services/pdfService';
import { useLanguage } from '../contexts/LanguageContext';

interface InvoiceListProps {
  invoices: Invoice[];
  onUpdateStatus: (id: string, status: 'paid' | 'pending' | 'draft') => void;
  onEditInvoice: (invoice: Invoice) => void;
  shopName: string;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onUpdateStatus, onEditInvoice, shopName }) => {
  const sortedInvoices = [...invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const { t } = useLanguage();

  const handleDownloadPdf = (inv: Invoice) => {
    // Force English labels for PDF
    const pdfLabels = {
      title: "INVOICE",
      invoiceNum: "Invoice #",
      date: "Date",
      billTo: "Bill To",
      item: "Item",
      quantity: "Qty",
      price: "Price",
      total: "Total",
      subtotal: "Subtotal",
      tax: "Tax",
      grandTotal: "Grand Total"
    };
    PdfService.generateInvoice(inv, pdfLabels, shopName);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('invoiceHistory')}</h1>
        <p className="text-gray-500">{t('manageInvoices')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{t('invoiceNum')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{t('date')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{t('customer')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{t('status')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">{t('amount')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-indigo-600">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(inv.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{inv.customerName}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      inv.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">
                    ₹{inv.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-3">
                        <button 
                          onClick={() => onEditInvoice(inv)}
                          className="text-blue-500 hover:text-blue-600 transition-colors"
                          title={t('edit')}
                        >
                          <Pencil size={18} />
                        </button>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <button 
                            onClick={() => onUpdateStatus(inv.id, inv.status === 'paid' ? 'pending' : 'paid')}
                            className={`${inv.status === 'paid' ? 'text-yellow-500 hover:text-yellow-600' : 'text-green-500 hover:text-green-600'} transition-colors`}
                            title={inv.status === 'paid' ? t('markPending') : t('markPaid')}
                        >
                           {inv.status === 'paid' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                        </button>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <button 
                          onClick={() => handleDownloadPdf(inv)}
                          className="text-gray-400 hover:text-indigo-600 transition-colors"
                          title={t('downloadPdf')}
                        >
                          <Download size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    <FileText size={48} className="mx-auto mb-2 opacity-20" />
                    <p>{t('noInvoices')}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};