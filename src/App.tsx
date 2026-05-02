import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Onboarding } from './components/Onboarding';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import Portfolio from './pages/Portfolio';
import AIInsights from './pages/AIInsights';
import BudgetPlanner from './pages/BudgetPlanner';
import Settings from './pages/Settings';
import StockDetail from './pages/StockDetail';

export default function App() {
  return (
    <Router>
      <Onboarding />
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/insights" element={<AIInsights />} />
          <Route path="/budget" element={<BudgetPlanner />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/stock/:symbol" element={<StockDetail />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}
