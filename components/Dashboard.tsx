import React, { useState, useMemo } from 'react';
import { Invoice } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { TrendingUp, DollarSign, FileText, Sparkles, RefreshCw } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  invoices: Invoice[];
}

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ invoices }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const { t } = useLanguage();

  // Calculate Stats
  const totalRevenue = useMemo(() => invoices.reduce((sum, inv) => sum + inv.total, 0), [invoices]);
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === 'paid').length;
  
  // Prepare Chart Data (Daily Revenue)
  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    invoices.forEach(inv => {
      const date = new Date(inv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      map.set(date, (map.get(date) || 0) + inv.total);
    });
    // Sort by date needed ideally, simplistic sorting for now
    return Array.from(map.entries()).map(([date, amount]) => ({ date, amount }));
  }, [invoices]);

  const handleGenerateInsights = async () => {
    setIsLoadingAI(true);
    try {
      const text = await GeminiService.generateSalesInsights(invoices);
      setInsights(text || "No insights generated.");
    } catch (e) {
        setInsights("Failed to generate insights.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard')}</h1>
        <p className="text-gray-500">{t('overview')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title={t('totalRevenue')} 
          value={`₹${totalRevenue.toFixed(2)}`} 
          icon={DollarSign} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title={t('totalInvoices')} 
          value={totalInvoices} 
          icon={FileText} 
          color="bg-blue-500" 
        />
        <StatCard 
          title={t('paidInvoices')} 
          value={paidInvoices} 
          icon={TrendingUp} 
          color="bg-indigo-500" 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">{t('revenueTrend')}</h3>
          <div className="h-72">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: number) => [`₹${value}`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    dot={{r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}} 
                    activeDot={{r: 6}} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No invoice data to display.
              </div>
            )}
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Sparkles className="text-indigo-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-800">{t('geminiInsights')}</h3>
                </div>
                <button 
                    onClick={handleGenerateInsights}
                    disabled={isLoadingAI}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1 disabled:opacity-50"
                >
                    {isLoadingAI ? <RefreshCw className="animate-spin" size={16} /> : t('refresh')}
                </button>
            </div>
            
            <div className="flex-1 bg-indigo-50/50 rounded-lg p-4 overflow-y-auto max-h-64 border border-indigo-50">
                {isLoadingAI ? (
                    <div className="space-y-3 animate-pulse">
                        <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                        <div className="h-4 bg-indigo-200 rounded w-1/2"></div>
                        <div className="h-4 bg-indigo-200 rounded w-full"></div>
                    </div>
                ) : insights ? (
                    <div className="prose prose-sm prose-indigo text-gray-700 whitespace-pre-line">
                        {insights}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic text-center mt-8">
                        Click refresh to ask Gemini AI for an analysis of your sales performance.
                    </p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
