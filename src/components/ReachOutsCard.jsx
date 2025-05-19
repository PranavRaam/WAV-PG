import React, { useMemo } from 'react';
import './Card.css';

const ReachOutsCard = ({ data }) => {
  // Transform raw data into the format needed by the component
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return {
        total: 0,
        calls: 0,
        emails: 0,
        linkedin: 0,
        others: 0,
        successRates: {
          calls: '0%',
          emails: '0%',
          linkedin: '0%',
          others: '0%',
          overall: '0%'
        }
      };
    }

    // Count items in each category and track responses/attempts
    const stats = data.reduce((acc, item) => {
      const category = item.category.toLowerCase();
      
      if (category === 'call') {
        acc.calls.count += item.value;
        acc.calls.responses += item.responses || 0;
        acc.calls.attempts += item.attempts || 0;
      } else if (category === 'email') {
        acc.emails.count += item.value;
        acc.emails.responses += item.responses || 0;
        acc.emails.attempts += item.attempts || 0;
      } else if (category === 'linkedin') {
        acc.linkedin.count += item.value;
        acc.linkedin.responses += item.responses || 0;
        acc.linkedin.attempts += item.attempts || 0;
      } else {
        // Meetings and other categories
        acc.others.count += item.value;
        acc.others.responses += item.responses || 0;
        acc.others.attempts += item.attempts || 0;
      }
      return acc;
    }, { 
      calls: { count: 0, responses: 0, attempts: 0 }, 
      emails: { count: 0, responses: 0, attempts: 0 },
      linkedin: { count: 0, responses: 0, attempts: 0 },
      others: { count: 0, responses: 0, attempts: 0 }
    });

    // Calculate success rates
    const calculateSuccessRate = (responses, attempts) => {
      if (!attempts) return '0%';
      return `${Math.round((responses / attempts) * 100)}%`;
    };

    const successRates = {
      calls: calculateSuccessRate(stats.calls.responses, stats.calls.attempts),
      emails: calculateSuccessRate(stats.emails.responses, stats.emails.attempts),
      linkedin: calculateSuccessRate(stats.linkedin.responses, stats.linkedin.attempts),
      others: calculateSuccessRate(stats.others.responses, stats.others.attempts)
    };

    // Calculate total success rate
    const totalResponses = Object.values(stats).reduce((sum, stat) => sum + stat.responses, 0);
    const totalAttempts = Object.values(stats).reduce((sum, stat) => sum + stat.attempts, 0);
    successRates.overall = calculateSuccessRate(totalResponses, totalAttempts);
    
    // Extract counts for the component
    const categoryCounts = {
      calls: stats.calls.count,
      emails: stats.emails.count,
      linkedin: stats.linkedin.count,
      others: stats.others.count
    };

    // Calculate total
    const total = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);

    return {
      total,
      ...categoryCounts,
      successRates
    };
  }, [data]);

  return (
    <div className="reachouts-content">
      <div className="card-top">
        <div className="card-value">{processedData.total}</div>
        <div className="card-breakdown">
          <div className="breakdown-header">
            <div className="breakdown-header-label">Channel</div>
            <div className="breakdown-header-value">Count (Success Rate)</div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label calls-color">Calls</div>
            <div className="breakdown-value">
              {processedData.calls}
              <span className="success-rate calls-color">
                {" "}({processedData.successRates.calls})
              </span>
            </div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label emails-color">E-mails</div>
            <div className="breakdown-value">
              {processedData.emails}
              <span className="success-rate emails-color">
                {" "}({processedData.successRates.emails})
              </span>
            </div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label linkedin-color">LinkedIn</div>
            <div className="breakdown-value">
              {processedData.linkedin}
              <span className="success-rate linkedin-color">
                {" "}({processedData.successRates.linkedin})
              </span>
            </div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label others-color">Others</div>
            <div className="breakdown-value">
              {processedData.others}
              <span className="success-rate others-color">
                {" "}({processedData.successRates.others})
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="metrics-section">
        <div className="success-rate-container">
          <div className="success-rate-label">Success Rate:</div>
          <div className="success-rate-value">{processedData.successRates.overall}</div>
        </div>
      </div>
    </div>
  );
};

export default ReachOutsCard; 