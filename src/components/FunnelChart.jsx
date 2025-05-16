import React from 'react';
import './FunnelChart.css';

const FunnelChart = ({ onStageClick }) => {
  // Mock data for the funnel stages
  const funnelData = [
    { stage: 'Targets', count: 350, description: 'Initial identified PGs' },
    { stage: 'Outreach', count: 280, description: 'PGs contacted' },
    { stage: 'Pilots', count: 180, description: 'Engaged in trials' },
    { stage: 'Onboarded', count: 120, description: 'Fully onboarded' },
    { stage: 'Premium', count: 80, description: 'Premium members' }
  ];

  // Calculate conversion rates between stages
  const getConversionRate = (currentIndex) => {
    if (currentIndex === 0) return 100;
    const currentCount = funnelData[currentIndex].count;
    const previousCount = funnelData[currentIndex - 1].count;
    return Math.round((currentCount / previousCount) * 100);
  };

  return (
    <div className="funnel-container">
      <div className="funnel-description">
        Click on a stage to filter dashboard data
      </div>
      <div className="funnel-chart">
        {funnelData.map((item, index) => (
          <div 
            key={index} 
            className={`funnel-segment ${index >= 3 ? 'lower-segment' : ''}`}
            onClick={() => onStageClick(item.stage)}
            title={`${item.description} - ${index > 0 ? `${getConversionRate(index)}% conversion from previous stage` : ''}`}
          >
            <div className="funnel-content">
              <div className="funnel-label">{item.stage}</div>
              <div className="funnel-count">{item.count}</div>
            </div>
            {index > 0 && (
              <div className="conversion-indicator">
                <span className="conversion-value">{getConversionRate(index)}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunnelChart; 