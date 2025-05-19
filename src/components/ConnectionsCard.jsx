import React, { useMemo } from 'react';
import './Card.css';

const ConnectionsCard = ({ data }) => {
  // Process raw data into the required format
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return {
        total: 0,
        promoters: 0,
        neutral: 0,
        blockers: 0,
        conversionRates: {
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
    
    // Calculate conversion rates
    const calculateConversionRate = (successes, attempts) => {
      if (!attempts) return { success: 0, failure: 0 };
      const successRate = Math.round((successes / attempts) * 100);
      return { success: successRate, failure: 100 - successRate };
    };

    const conversionRates = {
      promoters: calculateConversionRate(stats.promoters.successes, stats.promoters.attempts),
      neutral: calculateConversionRate(stats.neutral.successes, stats.neutral.attempts),
      blockers: calculateConversionRate(stats.blockers.successes, stats.blockers.attempts)
    };

    // Calculate total conversion rate
    const totalSuccesses = Object.values(stats).reduce((sum, stat) => sum + stat.successes, 0);
    const totalAttempts = Object.values(stats).reduce((sum, stat) => sum + stat.attempts, 0);
    conversionRates.overall = calculateConversionRate(totalSuccesses, totalAttempts);

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
      conversionRates
    };
  }, [data]);

  return (
    <div className="connections-content">
      <div className="card-top">
        <div className="card-value">{processedData.total}</div>
        <div className="card-breakdown">
          <div className="breakdown-header">
            <div className="breakdown-header-label">Attitude Type</div>
            <div className="breakdown-header-value">Count (Success/Failure)</div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label promoter">Promoters</div>
            <div className="breakdown-value">
              {processedData.promoters} 
              <span className="conversion-rate promoter">
                {" "}(S:{processedData.conversionRates.promoters.success} F:{processedData.conversionRates.promoters.failure})
              </span>
            </div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label neutral">Neutral</div>
            <div className="breakdown-value">
              {processedData.neutral}
              <span className="conversion-rate neutral">
                {" "}(S:{processedData.conversionRates.neutral.success} F:{processedData.conversionRates.neutral.failure})
              </span>
            </div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label blockers">Blockers</div>
            <div className="breakdown-value">
              {processedData.blockers}
              <span className="conversion-rate blockers">
                {" "}(S:{processedData.conversionRates.blockers.success} F:{processedData.conversionRates.blockers.failure})
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="metrics-section">
        <div className="conversion-rate-box">
          <div className="conversion-rate-labels">
            <div className="conversion-rate-label">Conversion Rate:</div>
          </div>
          <div className="conversion-rate-values">
            <div className="success-rate-box">
              <div className="rate-label">Success</div>
              <div className="rate-value success">{processedData.conversionRates.overall.success}%</div>
            </div>
            <div className="failure-rate-box">
              <div className="rate-label">Failure</div>
              <div className="rate-value failure">{processedData.conversionRates.overall.failure}%</div>
            </div>
          </div>
          <div className="conversion-bars">
            <div 
              className="success-bar"
              style={{ width: `${processedData.conversionRates.overall.success}%` }}
            ></div>
            <div 
              className="failure-bar"
              style={{ width: `${processedData.conversionRates.overall.failure}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionsCard; 