export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  description?: string;
  category?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  customerAddress?: string;
  customerPhone?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'paid' | 'pending' | 'draft';
}

export interface User {
  id: string;
  email: string;
  shopName: string;
  password?: string; // In a real app, never store plain text. For this demo, we simulate it.
}

export type ViewState = 'dashboard' | 'products' | 'customers' | 'create-invoice' | 'invoices';