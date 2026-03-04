import React, { useState } from 'react';
import { Search, Github, Calendar, MapPin, Link as LinkIcon } from 'lucide-react';
import { useGithub } from '../context/GithubContext';
import { motion } from 'framer-motion';

const PulseHeader = () => {
  const [username, setUsername] = useState('');
  const { fetchUser, userData, loading, error } = useGithub();

  const handleSearch = (e) => {
    e.preventDefault();
    if (username.trim()) {
      fetchUser(username);
    }
  };

  return (
    <div className="w-full space-y-8">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-github-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-github-purple/20 rounded-lg">
            <Github className="w-8 h-8 text-github-neon-purple" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Git<span className="text-github-neon-purple">Pulse</span>
          </h1>
        </div>

        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Search GitHub User..."
              className="w-full bg-github-header border border-github-border rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-github-accent/50 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-github-muted" />
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-github-neon-purple border-t-transparent"></div>
              </div>
            )}
          </form>
          {error && (
            <motion.p 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs text-red-400 font-medium mt-1 mr-4"
            >
              {error}
            </motion.p>
          )}
        </div>
      </header>

      {userData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 flex flex-col md:flex-row items-center gap-8"
        >
          <div className="relative">
            <img 
              src={userData.avatarUrl} 
              alt={userData.login}
              className="w-32 h-32 rounded-full border-4 border-github-border neon-purple-glow"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <h2 className="text-3xl font-bold text-white">{userData.name || userData.login}</h2>
              <p className="text-github-accent font-medium">@{userData.login}</p>
            </div>
            {userData.bio && <p className="text-github-text max-w-2xl">{userData.bio}</p>}
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-github-muted">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(userData.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PulseHeader;
