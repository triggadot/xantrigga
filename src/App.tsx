
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Accounts from '@/pages/Accounts';
import AccountDetail from '@/pages/AccountDetail';
import Sync from '@/pages/Sync';
import ProductSync from '@/pages/ProductSync';
import { AuthProvider } from '@/contexts/AuthProvider';
import Index from '@/pages/Index';

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Index />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Layout><Dashboard /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/accounts" 
                element={
                  <ProtectedRoute>
                    <Layout><Accounts /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/accounts/:id" 
                element={
                  <ProtectedRoute>
                    <Layout><AccountDetail /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sync" 
                element={
                  <ProtectedRoute>
                    <Layout><Sync /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sync/products/:mappingId" 
                element={
                  <ProtectedRoute>
                    <Layout><ProductSync /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
