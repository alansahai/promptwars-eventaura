import React from 'react';
import { EventProvider } from './context/EventContext';
import { useEvent } from './hooks/useEvent';
import { Navbar } from './components/layout/Navbar';
import { TabNav } from './components/layout/TabNav';
import { Footer } from './components/layout/Footer';
import { OverviewHeader } from './components/dashboard/OverviewHeader';
import { BudgetOverview } from './components/budget/BudgetOverview';
import { TimelineView } from './components/timeline/TimelineView';
import { VendorList } from './components/vendors/VendorList';
import { IdeasShowcase } from './components/ideas/IdeasShowcase';
import { WhatIfSimulator } from './components/scenario/WhatIfSimulator';
import { RunOfShowView } from './components/timeline/RunOfShowView';
import { ApiKeyModal } from './components/common/ApiKeyModal';
import { IntakeWizard } from './components/wizard/IntakeWizard';
import { Loader2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, isLoading, loadingMessage } = useEvent();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <TabNav />

      {/* Main Tab View */}
      <main className="container flex-1" style={{ paddingBottom: '2rem' }}>
        {isLoading ? (
          <div
            className="glass-panel p-12 flex flex-col items-center justify-center text-center animate-fade-in"
            style={{ minHeight: '380px', gap: '1rem' }}
          >
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.15)',
                color: 'var(--accent-gold)',
              }}
            >
              <Loader2 size={36} className="animate-spin" />
            </div>
            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Orchestrating Event Intelligence</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '500px' }}>
              {loadingMessage || 'GenAI is synthesizing interconnected budget, timeline, and vendor constraints...'}
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <OverviewHeader />}
            {activeTab === 'budget' && <BudgetOverview />}
            {activeTab === 'timeline' && <TimelineView />}
            {activeTab === 'vendors' && <VendorList />}
            {activeTab === 'ideas' && <IdeasShowcase />}
            {activeTab === 'whatif' && <WhatIfSimulator />}
            {activeTab === 'runofshow' && <RunOfShowView />}
          </>
        )}
      </main>

      <Footer />

      {/* Modals */}
      <ApiKeyModal />
      <IntakeWizard />
    </div>
  );
};

export function App() {
  return (
    <EventProvider>
      <MainContent />
    </EventProvider>
  );
}

export default App;
