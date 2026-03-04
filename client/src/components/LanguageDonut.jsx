import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useGithub } from '../context/GithubContext';
import { motion } from 'framer-motion';

const LanguageDonut = () => {
  const { userData } = useGithub();

  if (!userData) return null;

  const processLanguages = () => {
    const langMap = {};
    userData.repositories.nodes.forEach(repo => {
      repo.languages.edges.forEach(edge => {
        const { name, color } = edge.node;
        if (!langMap[name]) {
          langMap[name] = { name, value: 0, color };
        }
        langMap[name].value += edge.size;
      });
    });

    return Object.values(langMap)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const data = processLanguages();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 h-full flex flex-col"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Language Arsenal</h3>
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#58a6ff'} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#161b22', 
                border: '1px solid #30363d',
                borderRadius: '8px',
                color: '#c9d1d9'
              }} 
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default LanguageDonut;
