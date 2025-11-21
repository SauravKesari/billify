import React, { useState } from 'react';
import { Customer } from '../types';
import { Plus, Mail, Phone, MapPin, Search, Pencil, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CustomerListProps {
  customers: Customer[];
  onAddCustomer: (c: Customer) => void;
  onUpdateCustomer: (c: Customer) => void;
  onDeleteCustomer: (id: string) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({ customers, onAddCustomer, onUpdateCustomer, onDeleteCustomer }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleAddClick = () => {
    setNewCustomer({});
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (customer: Customer) => {
    setNewCustomer({ ...customer });
    setEditingId(customer.id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    // if (window.confirm('Are you sure you want to delete this customer?')) {
      onDeleteCustomer(id);
    // }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustomer.name && newCustomer.email) {
      const customerData: Customer = {
        id: editingId || Date.now().toString(),
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address
      };

      if (editingId) {
        onUpdateCustomer(customerData);
      } else {
        onAddCustomer(customerData);
      }
      setNewCustomer({});
      setEditingId(null);
      setIsModalOpen(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('customers')}</h1>
          <p className="text-gray-500">{t('manageClients')}</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors shadow-md"
        >
          <Plus size={18} />
          <span>{t('addCustomer')}</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder={t('searchCustomers')} 
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-100 transition-colors group relative">
            
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleEditClick(customer)}
                className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
                title={t('edit')}
              >
                <Pencil size={14} />
              </button>
              <button 
                onClick={() => handleDeleteClick(customer.id)}
                className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                title={t('delete')}
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                {customer.name.charAt(0)}
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{customer.name}</h3>
            <div className="space-y-2 mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <Mail size={16} className="mr-2 text-gray-400" /> {customer.email}
              </div>
              {customer.phone && (
                <div className="flex items-center text-sm text-gray-500">
                  <Phone size={16} className="mr-2 text-gray-400" /> {customer.phone}
                </div>
              )}
              {customer.address && (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin size={16} className="mr-2 text-gray-400" /> <span className="truncate">{customer.address}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? t('edit') + ' ' + t('customer') : t('addCustomer')}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                <input required type="text" className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={newCustomer.name || ''} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                <input required type="email" className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={newCustomer.email || ''} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone')}</label>
                <input type="tel" className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={newCustomer.phone || ''} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('address')}</label>
                <input type="text" className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={newCustomer.address || ''} onChange={e => setNewCustomer({...newCustomer, address: e.target.value})} />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200">{t('cancel')}</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  {editingId ? t('update') : t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};