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
            title={`${item.description}`}
          >
            <div className="funnel-content">
              <div className="funnel-label">{item.stage}</div>
              <div className="funnel-count">{item.count}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunnelChart; 