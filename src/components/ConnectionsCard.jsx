import React, { useState, useMemo } from 'react';
import './Card.css';

const ConnectionsCard = ({ data }) => {
  const [activeTab, setActiveTab] = useState('promoters');

  // Process raw data into the required format
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return {
        total: 0,
        promoters: 0,
        neutral: 0,
        blockers: 0,
        successRates: {
          promoters: '0%',
          neutral: '0%',
          blockers: '0%',
          overall: '0%'
        }
      };
    }

    // Categorize connections based on value vs target ratio
    const stats = data.reduce(
      (acc, item) => {
        if (item.type === 'promoter') {
          acc.promoters.count++;
          acc.promoters.attempts += item.attempts || 0;
          acc.promoters.successes += item.successes || 0;
        } else if (item.type === 'neutral') {
          acc.neutral.count++;
          acc.neutral.attempts += item.attempts || 0;
          acc.neutral.successes += item.successes || 0;
        } else {
          acc.blockers.count++;
          acc.blockers.attempts += item.attempts || 0;
          acc.blockers.successes += item.successes || 0;
        }
        return acc;
      },
      { 
        promoters: { count: 0, attempts: 0, successes: 0 }, 
        neutral: { count: 0, attempts: 0, successes: 0 },
        blockers: { count: 0, attempts: 0, successes: 0 }
      }
    );
    
    // Calculate success rates
    const calculateSuccessRate = (successes, attempts) => {
      if (!attempts) return '0%';
      return `${Math.round((successes / attempts) * 100)}%`;
    };

    const successRates = {
      promoters: calculateSuccessRate(stats.promoters.successes, stats.promoters.attempts),
      neutral: calculateSuccessRate(stats.neutral.successes, stats.neutral.attempts),
      blockers: calculateSuccessRate(stats.blockers.successes, stats.blockers.attempts)
    };

    // Calculate total success rate
    const totalSuccesses = Object.values(stats).reduce((sum, stat) => sum + stat.successes, 0);
    const totalAttempts = Object.values(stats).reduce((sum, stat) => sum + stat.attempts, 0);
    successRates.overall = calculateSuccessRate(totalSuccesses, totalAttempts);

    // Calculate totals for each category
    const counts = {
      promoters: stats.promoters.count,
      neutral: stats.neutral.count,
      blockers: stats.blockers.count
    };
    const total = counts.promoters + counts.neutral + counts.blockers;
    
    return {
      total,
      ...counts,
      successRates
    };
  }, [data]);

  return (
    <div className="connections-content">
      <div className="card-top">
        <div className="card-value">{processedData.total}</div>
        <div className="card-breakdown">
          <div className="breakdown-item">
            <div className="breakdown-label promoter">Promoters</div>
            <div className="breakdown-value">{processedData.promoters}</div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label neutral">Neutral</div>
            <div className="breakdown-value">{processedData.neutral}</div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label blockers">Blockers</div>
            <div className="breakdown-value">{processedData.blockers}</div>
          </div>
        </div>
      </div>
      
      <div className="metrics-section">
        <div className="tab-row">
          <div 
            className={`tab ${activeTab === 'promoters' ? 'active promoter' : ''}`}
            onClick={() => setActiveTab('promoters')}
          >
            Promoters
          </div>
          <div 
            className={`tab ${activeTab === 'neutral' ? 'active neutral' : ''}`}
            onClick={() => setActiveTab('neutral')}
          >
            Neutral
          </div>
          <div 
            className={`tab ${activeTab === 'blockers' ? 'active blockers' : ''}`}
            onClick={() => setActiveTab('blockers')}
          >
            Blockers
          </div>
        </div>
        
        <div className="success-rate-container">
          <div className="success-rate-label">Success Rate:</div>
          <div className="success-rate-value">{activeTab === 'promoters' 
            ? processedData.successRates.promoters
            : activeTab === 'neutral' 
            ? processedData.successRates.neutral
            : processedData.successRates.blockers}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionsCard; 