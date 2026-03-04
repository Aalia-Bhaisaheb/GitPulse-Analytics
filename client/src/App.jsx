import React from 'react';
import { GithubProvider } from './context/GithubContext';
import PulseHeader from './components/PulseHeader';
import LanguageDonut from './components/LanguageDonut';
import AIReview from './components/AIReview';
import CommitCalendar from './components/CommitCalendar';

function App() {
  return (
    <GithubProvider>
      <div className="min-h-screen bg-github-bg text-github-text px-4 py-8 md:px-8 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12">
          <PulseHeader />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LanguageDonut />
            <AIReview />
          </div>
          
          <CommitCalendar />
        </div>
      </div>
    </GithubProvider>
  );
}

export default App;
