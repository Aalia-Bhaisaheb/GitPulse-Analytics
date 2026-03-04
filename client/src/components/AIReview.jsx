import React, { useState } from 'react';
import { useGithub } from '../context/GithubContext';
import { Sparkles, Zap, Ghost, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIReview = () => {
  const { userData } = useGithub();
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(null); // 'roast' or 'toast'

  const handleAIReview = async (reviewType) => {
    if (!userData) return;
    setLoading(true);
    setType(reviewType);
    setReview(''); // Clear previous review
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/ai-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData, type: reviewType }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setReview(data.review);
      } else {
        throw new Error(data.error || 'Failed to fetch review');
      }
    } catch (err) {
      console.error('AI Review Fetch Error:', err);
      setReview("The AI is too intimidated by your profile to speak right now. Check your API key!");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 h-full flex flex-col justify-between"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-github-neon-purple" />
          AI Pulse Review
        </h3>
        
        <AnimatePresence mode="wait">
          {!review && !loading ? (
            <motion.p 
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-github-muted"
            >
              Choose your destiny. Should I honor your achievements or humble your commits?
            </motion.p>
          ) : loading ? (
            <motion.div 
              key="loading"
              className="flex flex-col items-center justify-center py-8 space-y-3"
            >
              <RefreshCw className="w-8 h-8 text-github-neon-purple animate-spin" />
              <p className="text-sm text-github-muted">Analyzing the digital footprint...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-lg border ${type === 'roast' ? 'bg-red-500/10 border-red-500/20' : 'bg-github-green/10 border-github-green/20'}`}
            >
              <p className="text-github-text italic leading-relaxed">"{review}"</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <button
          onClick={() => handleAIReview('roast')}
          disabled={loading}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all font-semibold disabled:opacity-50"
        >
          <Ghost className="w-5 h-5" />
          Roast Me
        </button>
        <button
          onClick={() => handleAIReview('toast')}
          disabled={loading}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-github-green/10 hover:bg-github-green/20 text-github-neon-green border border-github-green/20 transition-all font-semibold disabled:opacity-50"
        >
          <Zap className="w-5 h-5" />
          Toast Me
        </button>
      </div>
    </motion.div>
  );
};

export default AIReview;
