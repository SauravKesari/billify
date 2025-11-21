import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ProductList } from './components/ProductList';
import { CustomerList } from './components/CustomerList';
import { CreateBill } from './components/CreateBill';
import { InvoiceList } from './components/InvoiceList';
import { Auth } from './components/Auth';
import { Product, Customer, Invoice, ViewState, User } from './types';
import { StorageService } from './services/storage';
import { AuthService } from './services/auth';
import { LanguageProvider } from './contexts/LanguageContext';

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Check for active session on load
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Load Data when user changes (logs in)
  useEffect(() => {
    if (user) {
      StorageService.seedData(); // Seed data for this specific user if needed
      refreshData();
      setCurrentView('dashboard');
    } else {
      // Clear sensitive state on logout
      setProducts([]);
      setCustomers([]);
      setInvoices([]);
    }
  }, [user]);

  const refreshData = () => {
    setProducts(StorageService.getProducts());
    setCustomers(StorageService.getCustomers());
    setInvoices(StorageService.getInvoices());
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  // Navigation handler to ensure state is reset when entering "Create Invoice" manually
  const handleNavigate = (view: ViewState) => {
    if (view === 'create-invoice') {
      setEditingInvoice(null);
    }
    setCurrentView(view);
  };

  // Handlers using a cleaner update pattern to ensure state and storage are always in sync
  const handleAddProduct = (product: Product) => {
    const updated = [product, ...products];
    setProducts(updated);
    StorageService.saveProducts(updated);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    // Use strict string comparison for safety
    const updated = products.map(p => String(p.id) === String(updatedProduct.id) ? updatedProduct : p);
    setProducts(updated);
    StorageService.saveProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    // Use strict string comparison to fix potential delete issues
    const updated = products.filter(p => String(p.id) !== String(id));
    setProducts(updated);
    StorageService.saveProducts(updated);
  };

  const handleAddCustomer = (customer: Customer) => {
    const updated = [customer, ...customers];
    setCustomers(updated);
    StorageService.saveCustomers(updated);
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    const updated = customers.map(c => String(c.id) === String(updatedCustomer.id) ? updatedCustomer : c);
    setCustomers(updated);
    StorageService.saveCustomers(updated);
  };

  const handleDeleteCustomer = (id: string) => {
    const updated = customers.filter(c => String(c.id) !== String(id));
    setCustomers(updated);
    StorageService.saveCustomers(updated);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setCurrentView('create-invoice');
  };

  const handleSaveInvoice = (invoice: Invoice) => {
    if (editingInvoice) {
      // Update existing invoice
      const updated = invoices.map(inv => String(inv.id) === String(invoice.id) ? invoice : inv);
      setInvoices(updated);
      StorageService.saveInvoices(updated);
      setEditingInvoice(null);
    } else {
      // Create new invoice
      const updated = [invoice, ...invoices];
      setInvoices(updated);
      StorageService.saveInvoices(updated);
    }
    setCurrentView('invoices');
  };

  const handleUpdateInvoiceStatus = (id: string, status: 'paid' | 'pending' | 'draft') => {
    const updated = invoices.map(inv => 
        String(inv.id) === String(id) ? { ...inv, status } : inv
    );
    setInvoices(updated);
    StorageService.saveInvoices(updated);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard invoices={invoices} />;
      case 'products':
        return <ProductList 
          products={products} 
          onAddProduct={handleAddProduct} 
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
        />;
      case 'customers':
        return <CustomerList 
          customers={customers} 
          onAddCustomer={handleAddCustomer} 
          onUpdateCustomer={handleUpdateCustomer}
          onDeleteCustomer={handleDeleteCustomer}
        />;
      case 'create-invoice':
        return <CreateBill 
          products={products} 
          customers={customers} 
          onSave={handleSaveInvoice} 
          initialInvoice={editingInvoice}
          shopName={user?.shopName || 'NovaBill'}
        />;
      case 'invoices':
        return <InvoiceList 
          invoices={invoices} 
          onUpdateStatus={handleUpdateInvoiceStatus}
          onEditInvoice={handleEditInvoice}
          shopName={user?.shopName || 'NovaBill'}
        />;
      default:
        return <Dashboard invoices={invoices} />;
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout currentView={currentView} onNavigate={handleNavigate} user={user} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;