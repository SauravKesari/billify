import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'hi';

const translations = {
  en: {
    dashboard: "Dashboard",
    createInvoice: "Create Invoice",
    invoices: "Invoices",
    customers: "Customers",
    products: "Products",
    overview: "Overview of your billing performance",
    totalRevenue: "Total Revenue",
    totalInvoices: "Total Invoices",
    paidInvoices: "Paid Invoices",
    revenueTrend: "Revenue Trend",
    geminiInsights: "Gemini Insights",
    refresh: "Refresh",
    invoiceHistory: "Invoice History",
    manageInvoices: "View and manage your generated bills",
    invoiceNum: "Invoice #",
    date: "Date",
    customer: "Customer",
    status: "Status",
    amount: "Amount",
    action: "Action",
    productsServices: "Products & Services",
    manageInventory: "Manage your inventory and pricing",
    addProduct: "Add Product",
    searchProducts: "Search products...",
    productName: "Product Name",
    category: "Category",
    unitPrice: "Unit Price",
    description: "Description",
    actions: "Actions",
    manageClients: "Manage your client base",
    addCustomer: "Add Customer",
    searchCustomers: "Search customers...",
    newInvoice: "New Invoice",
    editInvoice: "Edit Invoice",
    createBillDesc: "Create a new bill for your customer",
    updateBillDesc: "Update invoice details",
    selectCustomer: "Select a customer...",
    billItems: "Bill Items",
    addItem: "Add Item",
    qty: "Qty",
    price: "Price",
    subtotal: "Subtotal",
    tax: "Tax",
    total: "Total",
    saveOnly: "Save Only",
    update: "Update",
    saveDownload: "Save & Download",
    updateDownload: "Update & Download",
    loggedInAs: "Logged in as",
    adminUser: "Admin User",
    unit: "Unit",
    name: "Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    cancel: "Cancel",
    save: "Save",
    noProducts: "No products found.",
    noInvoices: "No invoices generated yet.",
    markPaid: "Mark as Paid",
    markPending: "Mark as Pending",
    edit: "Edit",
    delete: "Delete",
    downloadPdf: "Download PDF",
    billTo: "Bill To",
    item: "Item"
  },
  hi: {
    dashboard: "डैशबोर्ड",
    createInvoice: "इनवॉइस बनाएं",
    invoices: "इनवॉइस",
    customers: "ग्राहक",
    products: "उत्पाद",
    overview: "अपने बिलिंग प्रदर्शन का अवलोकन",
    totalRevenue: "कुल राजस्व",
    totalInvoices: "कुल इनवॉइस",
    paidInvoices: "भुगतान पूर्ण",
    revenueTrend: "राजस्व रुझान",
    geminiInsights: "जेमिनी इनसाइट्स",
    refresh: "ताज़ा करें",
    invoiceHistory: "इनवॉइस इतिहास",
    manageInvoices: "अपने उत्पन्न बिल देखें और प्रबंधित करें",
    invoiceNum: "इनवॉइस #",
    date: "दिनांक",
    customer: "ग्राहक",
    status: "स्थिति",
    amount: "राशि",
    action: "क्रिया",
    productsServices: "उत्पाद और सेवाएँ",
    manageInventory: "अपनी इन्वेंट्री और मूल्य निर्धारण प्रबंधित करें",
    addProduct: "उत्पाद जोड़ें",
    searchProducts: "उत्पाद खोजें...",
    productName: "उत्पाद का नाम",
    category: "श्रेणी",
    unitPrice: "इकाई मूल्य",
    description: "विवरण",
    actions: "क्रियाएँ",
    manageClients: "अपना ग्राहक आधार प्रबंधित करें",
    addCustomer: "ग्राहक जोड़ें",
    searchCustomers: "ग्राहक खोजें...",
    newInvoice: "नया इनवॉइस",
    editInvoice: "इनवॉइस संपादित करें",
    createBillDesc: "अपने ग्राहक के लिए नया बिल बनाएं",
    updateBillDesc: "इनवॉइस विवरण अपडेट करें",
    selectCustomer: "ग्राहक चुनें...",
    billItems: "बिल आइटम",
    addItem: "आइटम जोड़ें",
    qty: "मात्रा",
    price: "कीमत",
    subtotal: "उप-योग",
    tax: "कर",
    total: "कुल",
    saveOnly: "केवल सहेजें",
    update: "अपडेट करें",
    saveDownload: "सहेजें और डाउनलोड करें",
    updateDownload: "अपडेट और डाउनलोड करें",
    loggedInAs: "लॉग इन किया है",
    adminUser: "व्यवस्थापक",
    unit: "इकाई",
    name: "नाम",
    email: "ईमेल",
    phone: "फ़ोन",
    address: "पता",
    cancel: "रद्द करें",
    save: "सहेजें",
    noProducts: "कोई उत्पाद नहीं मिला।",
    noInvoices: "अभी तक कोई इनवॉइस नहीं है।",
    markPaid: "भुगतान किया गया चिह्नित करें",
    markPending: "लंबित चिह्नित करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    downloadPdf: "पीडीएफ डाउनलोड करें",
    billTo: "बिल प्रति",
    item: "वस्तु"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};