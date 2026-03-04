import React from 'react';
import { useGithub } from '../context/GithubContext';
import { motion } from 'framer-motion';

const CommitCalendar = () => {
  const { userData } = useGithub();

  if (!userData) return null;

  const calendar = userData.contributionsCollection.contributionCalendar;
  const weeks = calendar.weeks;

  const getColor = (count) => {
    if (count === 0) return 'bg-[#161b22]';
    if (count < 3) return 'bg-[#0e4429]';
    if (count < 6) return 'bg-[#006d32]';
    if (count < 10) return 'bg-[#26a641]';
    return 'bg-[#39d353]';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 w-full overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Contribution Pulse</h3>
        <p className="text-sm text-github-muted">{calendar.totalContributions} contributions in the last year</p>
      </div>

      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-1 min-w-max">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col gap-1">
              {week.contributionDays.map((day, dIndex) => (
                <div
                  key={dIndex}
                  title={`${day.contributionCount} commits on ${day.date}`}
                  className={`w-3 h-3 rounded-sm ${getColor(day.contributionCount)} transition-all hover:scale-125 hover:z-10 cursor-pointer`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-github-muted">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-[#161b22]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#0e4429]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#006d32]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#26a641]"></div>
          <div className="w-3 h-3 rounded-sm bg-[#39d353]"></div>
        </div>
        <span>More</span>
      </div>
    </motion.div>
  );
};

export default CommitCalendar;
