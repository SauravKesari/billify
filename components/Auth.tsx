import React, { useState } from 'react';
import { AuthService } from '../services/auth';
import { User } from '../types';
import { FileText, ArrowRight, Lock, Mail, Store } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = AuthService.login(email, password);
      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setError(result.message || 'Login failed');
      }
    } else {
      if (!shopName) {
        setError('Shop name is required');
        return;
      }
      const result = AuthService.register(email, password, shopName);
      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setError(result.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 text-white flex-col justify-center px-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-white"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <FileText className="text-indigo-600" size={28} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">NovaBill</h1>
          </div>
          <h2 className="text-3xl font-bold mb-4">Smart Invoicing for Growing Businesses</h2>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8">
            Create professional invoices, manage customers, and track your sales with AI-powered insights. 
            Join thousands of businesses using NovaBill today.
          </p>
          <div className="flex space-x-2 text-indigo-200 text-sm font-medium">
            <span>• Free to start</span>
            <span>• Secure data</span>
            <span>• Multi-currency</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-gray-500 mt-2">
              {isLogin ? 'Enter your credentials to access your account' : 'Start managing your invoices in seconds'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop / Business Name</label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
                    placeholder="My Awesome Store"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-2 group"
            >
              <span>{isLogin ? 'Sign In' : 'Get Started'}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};