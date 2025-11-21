import { Product, Customer, Invoice } from '../types';

// Helper to get current user ID to prefix keys
const getCurrentUserId = () => {
  const session = localStorage.getItem('novabill_current_session');
  if (!session) return 'public';
  try {
    const user = JSON.parse(session);
    return user.id;
  } catch {
    return 'public';
  }
};

const getKeys = () => {
  const prefix = `novabill_${getCurrentUserId()}_`;
  return {
    PRODUCTS: `${prefix}products`,
    CUSTOMERS: `${prefix}customers`,
    INVOICES: `${prefix}invoices`,
    UNITS: `${prefix}units`,
  };
};

// Helper to ensure all IDs are strings to prevent mismatch errors
const sanitizeId = (item: any) => ({ ...item, id: String(item.id) });

export const StorageService = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem(getKeys().PRODUCTS);
    return data ? JSON.parse(data).map(sanitizeId) : [];
  },
  saveProducts: (products: Product[]) => {
    localStorage.setItem(getKeys().PRODUCTS, JSON.stringify(products));
  },
  getCustomers: (): Customer[] => {
    const data = localStorage.getItem(getKeys().CUSTOMERS);
    return data ? JSON.parse(data).map(sanitizeId) : [];
  },
  saveCustomers: (customers: Customer[]) => {
    localStorage.setItem(getKeys().CUSTOMERS, JSON.stringify(customers));
  },
  getInvoices: (): Invoice[] => {
    const data = localStorage.getItem(getKeys().INVOICES);
    return data ? JSON.parse(data).map(sanitizeId) : [];
  },
  saveInvoices: (invoices: Invoice[]) => {
    localStorage.setItem(getKeys().INVOICES, JSON.stringify(invoices));
  },
  getUnits: (): string[] => {
    const data = localStorage.getItem(getKeys().UNITS);
    return data ? JSON.parse(data) : ['pcs', 'hrs', 'kg', 'lb', 'box', 'service'];
  },
  saveUnits: (units: string[]) => {
    localStorage.setItem(getKeys().UNITS, JSON.stringify(units));
  },
  // Seed data if empty (Per User)
  seedData: () => {
    const KEYS = getKeys();
    if (!localStorage.getItem(KEYS.PRODUCTS)) {
      const defaultProducts: Product[] = [
        { id: '1', name: 'Web Design Basic', price: 500, unit: 'service', category: 'Service', description: '5 page static site' },
        { id: '2', name: 'SEO Audit', price: 250, unit: 'service', category: 'Consulting', description: 'Comprehensive site audit' },
        { id: '3', name: 'Logo Design', price: 150, unit: 'pcs', category: 'Design', description: 'Vector logo with 3 revisions' },
      ];
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(defaultProducts));
    }
    if (!localStorage.getItem(KEYS.CUSTOMERS)) {
      const defaultCustomers: Customer[] = [
        { id: '1', name: 'Acme Corp', email: 'billing@acme.com', phone: '555-0123', address: '123 Innovation Dr' },
        { id: '2', name: 'Jane Doe', email: 'jane@example.com', phone: '555-0199', address: '456 Resident St' },
      ];
      localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(defaultCustomers));
    }
  }
};