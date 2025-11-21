import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Plus, Package, Search, Check, X, Pencil, Trash2 } from 'lucide-react';
import { StorageService } from '../services/storage';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductListProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const { t } = useLanguage();
  
  // Unit management state
  const [availableUnits, setAvailableUnits] = useState<string[]>([]);
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');

  useEffect(() => {
    setAvailableUnits(StorageService.getUnits());
  }, []);

  const handleAddUnit = () => {
    if (newUnitName.trim()) {
      const updatedUnits = [...availableUnits, newUnitName.trim()];
      setAvailableUnits(updatedUnits);
      StorageService.saveUnits(updatedUnits);
      setNewProduct({ ...newProduct, unit: newUnitName.trim() });
      setNewUnitName('');
      setIsAddingUnit(false);
    }
  };

  const handleAddClick = () => {
    setNewProduct({});
    setEditingId(null);
    setNewUnitName('');
    setIsAddingUnit(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setNewProduct({});
    setEditingId(null);
    setIsModalOpen(false);
    setNewUnitName('');
    setIsAddingUnit(false);
  };

  const handleEditClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setNewProduct({ ...product });
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Stop row click events
    onDeleteProduct(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      const productData: Product = {
        id: editingId || (Date.now().toString() + Math.random().toString(36).substr(2, 5)),
        name: newProduct.name,
        price: Number(newProduct.price),
        unit: newProduct.unit || 'pcs',
        category: newProduct.category || 'General', // Preserve existing or default
        description: newProduct.description
      };

      if (editingId) {
        onUpdateProduct(productData);
      } else {
        onAddProduct(productData);
      }
      handleCloseModal();
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('productsServices')}</h1>
          <p className="text-gray-500">{t('manageInventory')}</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors shadow-md"
        >
          <Plus size={18} />
          <span>{t('addProduct')}</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder={t('searchProducts')} 
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('productName')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('category')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('unitPrice')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('description')}</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded flex items-center justify-center text-indigo-600 mr-3">
                        <Package size={16} />
                      </div>
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    ₹{product.price.toFixed(2)} <span className="text-gray-400 text-sm font-normal">/ {product.unit}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                    {product.description || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        type="button"
                        onClick={(e) => handleEditClick(e, product)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                        title={t('edit')}
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => handleDeleteClick(e, product.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title={t('delete')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    {t('noProducts')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? t('edit') + ' ' + t('products') : t('addProduct')}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                <input required type="text" className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={newProduct.name || ''} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">{t('price')}</label>
                   <input required type="number" step="0.01" className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none" 
                     value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">{t('unit')}</label>
                   {isAddingUnit ? (
                     <div className="flex space-x-1">
                       <input 
                         type="text" 
                         autoFocus
                         className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                         placeholder="e.g. box"
                         value={newUnitName}
                         onChange={(e) => setNewUnitName(e.target.value)}
                       />
                       <button type="button" onClick={handleAddUnit} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                         <Check size={18} />
                       </button>
                       <button type="button" onClick={() => setIsAddingUnit(false)} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                         <X size={18} />
                       </button>
                     </div>
                   ) : (
                     <div className="flex space-x-1">
                        <select 
                          className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={newProduct.unit || ''}
                          onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                        >
                          <option value="" disabled>{t('unit')}</option>
                          {availableUnits.map(u => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                        <button 
                          type="button" 
                          onClick={() => setIsAddingUnit(true)}
                          className="p-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
                          title="Add new unit type"
                        >
                          <Plus size={18} />
                        </button>
                     </div>
                   )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
                <textarea className="w-full p-2 border rounded-lg h-24 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={newProduct.description || ''} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200">{t('cancel')}</button>
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
