import React from 'react';
import { LayoutDashboard, Users, Package, FileText, PlusCircle, Menu, X, Languages, LogOut } from 'lucide-react';
import { ViewState, User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  user: User | null;
  onLogout: () => void;
}

const NavItem = ({ 
  view, 
  current, 
  icon: Icon, 
  label, 
  onClick 
}: { 
  view: ViewState; 
  current: ViewState; 
  icon: any; 
  label: string; 
  onClick: (v: ViewState) => void 
}) => (
  <button
    onClick={() => onClick(view)}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      current === view 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-20 h-full w-64 bg-slate-900 text-white flex-shrink-0 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <FileText className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight truncate max-w-[150px]">
              {user?.shopName || 'NovaBill'}
            </span>
          </div>
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="px-4 mb-2">
          <button 
            onClick={toggleLanguage}
            className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium py-2 rounded-md text-slate-300 transition-colors border border-slate-700"
          >
            <Languages size={14} />
            <span>{language === 'en' ? 'Switch to Hindi' : 'Switch to English'}</span>
          </button>
        </div>

        <nav className="px-4 space-y-2 mt-4">
          <NavItem view="dashboard" current={currentView} icon={LayoutDashboard} label={t('dashboard')} onClick={onNavigate} />
          <NavItem view="create-invoice" current={currentView} icon={PlusCircle} label={t('createInvoice')} onClick={onNavigate} />
          <NavItem view="invoices" current={currentView} icon={FileText} label={t('invoices')} onClick={onNavigate} />
          <NavItem view="customers" current={currentView} icon={Users} label={t('customers')} onClick={onNavigate} />
          <NavItem view="products" current={currentView} icon={Package} label={t('products')} onClick={onNavigate} />
        </nav>
        
        <div className="absolute bottom-0 w-full p-6">
            <div className="bg-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-400">{t('loggedInAs')}</p>
                  <button onClick={onLogout} className="text-slate-400 hover:text-white transition-colors" title="Logout">
                    <LogOut size={14} />
                  </button>
                </div>
                <p className="text-sm font-semibold text-white truncate" title={user?.email}>
                  {user?.email}
                </p>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-gray-800 truncate max-w-[150px]">
            {user?.shopName || 'NovaBill'}
          </span>
          <button onClick={toggleLanguage} className="text-indigo-600 font-bold text-sm">
             {language === 'en' ? 'HI' : 'EN'}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </div>
      </main>
      
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};