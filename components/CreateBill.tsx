import React, { useState, useEffect } from 'react';
import { Product, Customer, InvoiceItem, Invoice } from '../types';
import { Plus, Trash2, Save, FileText } from 'lucide-react';
import { PdfService } from '../services/pdfService';
import { useLanguage } from '../contexts/LanguageContext';

interface CreateBillProps {
  products: Product[];
  customers: Customer[];
  onSave: (invoice: Invoice) => void;
  initialInvoice?: Invoice | null;
  shopName: string;
}

export const CreateBill: React.FC<CreateBillProps> = ({ products, customers, onSave, initialInvoice, shopName }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    if (initialInvoice) {
      setSelectedCustomerId(initialInvoice.customerId);
      setItems(initialInvoice.items);
    } else {
      setSelectedCustomerId('');
      setItems([]);
    }
  }, [initialInvoice]);

  // Calculated totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxRate = 0; // 0% default
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const generateUniqueId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const addItem = () => {
    if (products.length === 0) return;
    const product = products[0];
    const newItem: InvoiceItem = {
      id: generateUniqueId(),
      productId: product.id,
      productName: product.name,
      unit: product.unit,
      quantity: 1,
      price: product.price,
      total: product.price
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        // If product changes, update details
        if (field === 'productId') {
          // Use string comparison for robustness
          const product = products.find(p => String(p.id) === String(value));
          if (product) {
            updated.productName = product.name;
            updated.price = product.price;
            updated.unit = product.unit;
            // Recalculate total immediately with new price
            updated.total = updated.quantity * product.price;
          }
        } else if (field === 'quantity' || field === 'price') {
           // Recalculate total if qty or price (manual) changes
           updated.total = updated.quantity * updated.price;
        }
        return updated;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleSave = (generatePdf: boolean) => {
    if (!selectedCustomerId || items.length === 0) {
      alert("Please select a customer and add at least one item.");
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomerId);
    if (!customer) return;

    const invoice: Invoice = {
      id: initialInvoice ? initialInvoice.id : generateUniqueId(),
      invoiceNumber: initialInvoice ? initialInvoice.invoiceNumber : `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: initialInvoice ? initialInvoice.date : new Date().toISOString(),
      customerId: customer.id,
      customerName: customer.name,
      customerAddress: customer.address,
      customerPhone: customer.phone,
      items,
      subtotal,
      taxRate,
      taxAmount,
      total,
      status: initialInvoice ? initialInvoice.status : 'pending'
    };

    onSave(invoice);
    if (generatePdf) {
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
      PdfService.generateInvoice(invoice, pdfLabels, shopName);
    }

    // Reset form if creating new, though usually we navigate away
    if (!initialInvoice) {
      setItems([]);
      setSelectedCustomerId('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {initialInvoice ? `${t('editInvoice')} ${initialInvoice.invoiceNumber}` : t('newInvoice')}
          </h1>
          <p className="text-gray-500">
            {initialInvoice ? t('updateBillDesc') : t('createBillDesc')}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('customer')}</label>
          <select 
            className="w-full md:w-1/2 p-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <option value="" className="text-gray-500">{t('selectCustomer')}</option>
            {customers.map(c => (
              <option key={c.id} value={c.id} className="text-gray-900">{c.name} ({c.email})</option>
            ))}
          </select>
        </div>

        <div className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">{t('billItems')}</h3>
            <button 
              type="button"
              onClick={addItem}
              className="text-sm flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <Plus size={16} /> <span>{t('addItem')}</span>
            </button>
          </div>

          <div className="space-y-3">
             {items.length === 0 && (
               <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                 No items added yet.
               </div>
             )}
             {items.map((item) => (
               <div key={item.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                 <div className="flex-1">
                   <label className="text-xs text-gray-500 md:hidden">{t('products')}</label>
                   <select 
                     className="w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                     value={item.productId}
                     onChange={(e) => updateItem(item.id, 'productId', e.target.value)}
                   >
                     {products.map(p => (
                       <option key={p.id} value={p.id}>{p.name}</option>
                     ))}
                     {!products.find(p => String(p.id) === String(item.productId)) && (
                       <option value={item.productId} disabled>{item.productName} (Deleted)</option>
                     )}
                   </select>
                 </div>
                 <div className="w-full md:w-32">
                    <label className="text-xs text-gray-500 md:hidden">{t('qty')}</label>
                    <div className="relative flex items-center">
                       <input 
                         type="number" 
                         min="0"
                         step="any"
                         className="w-full p-2 bg-white text-gray-900 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                         value={item.quantity}
                         onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                       />
                       {item.unit && (
                         <span className="ml-2 text-xs text-gray-500 font-medium whitespace-nowrap">{item.unit}</span>
                       )}
                    </div>
                 </div>
                 <div className="w-full md:w-32">
                   <label className="text-xs text-gray-500 md:hidden">{t('price')}</label>
                   <div className="relative">
                     <span className="absolute left-2 top-2 text-gray-500 text-sm">₹</span>
                     <input 
                        type="number"
                        disabled
                        className="w-full p-2 pl-5 bg-gray-100 text-gray-600 border border-gray-300 rounded-md text-sm"
                        value={item.price.toFixed(2)}
                     />
                   </div>
                 </div>
                 <div className="w-full md:w-32 text-right font-medium text-gray-700">
                   ₹{item.total.toFixed(2)}
                 </div>
                 <button 
                   type="button"
                   onClick={() => removeItem(item.id)}
                   className="text-red-400 hover:text-red-600 p-1"
                 >
                   <Trash2 size={18} />
                 </button>
               </div>
             ))}
          </div>

          <div className="mt-8 flex flex-col items-end space-y-2 text-sm">
            <div className="flex justify-between w-full md:w-64 text-gray-600">
              <span>{t('subtotal')}:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full md:w-64 text-gray-600">
              <span>{t('tax')} (10%):</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full md:w-64 text-lg font-bold text-indigo-900 pt-2 border-t border-gray-200">
              <span>{t('total')}:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row justify-end gap-3">
           <button 
             type="button"
             onClick={() => handleSave(false)}
             className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
           >
             <Save size={18} /> <span>{initialInvoice ? t('update') : t('saveOnly')}</span>
           </button>
           <button 
             type="button"
             onClick={() => handleSave(true)}
             className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-2"
           >
             <FileText size={18} /> <span>{initialInvoice ? t('updateDownload') : t('saveDownload')}</span>
           </button>
        </div>
      </div>
    </div>
  );
};