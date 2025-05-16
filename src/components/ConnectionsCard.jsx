import React, { useState } from 'react';
import './Card.css';

const ConnectionsCard = ({ data }) => {
  const [activeTab, setActiveTab] = useState('promoters');

  const renderMetricGrid = (connectionType) => {
    const metrics = data.metrics[connectionType];
    return (
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Conversion Rate</div>
            <div className="metric-value">{metrics.conversionRate}%</div>
          </div>
          <div className="metric-description">% of connections who moved from reply to pilot</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Trust Score</div>
            <div className="metric-value">{metrics.trustScore}/100</div>
          </div>
          <div className="metric-description">Average trust score within group</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Influence Density</div>
            <div className="metric-value">{metrics.influenceDensity}%</div>
          </div>
          <div className="metric-description">% who are decision-makers</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Engagement Frequency</div>
            <div className="metric-value">{metrics.engagementFrequency}</div>
          </div>
          <div className="metric-description">Avg number of meaningful responses</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Change Rate</div>
            <div className={`metric-value ${metrics.changeRate.includes('+') ? 'positive' : 'negative'}`}>
              {metrics.changeRate}
            </div>
          </div>
          <div className="metric-description">Shift in connection type from last cycle</div>
        </div>
      </div>
    );
  };

  return (
    <div className="connections-content">
      <div className="card-top">
        <div className="card-value">{data.total}</div>
        <div className="card-breakdown">
          <div className="breakdown-item">
            <div className="breakdown-label promoter">Promoters</div>
            <div className="breakdown-value">{data.promoters}</div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label neutral">Neutral</div>
            <div className="breakdown-value">{data.neutral}</div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label blockers">Blockers</div>
            <div className="breakdown-value">{data.blockers}</div>
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
        
        {renderMetricGrid(activeTab)}
      </div>
    </div>
  );
};

export default ConnectionsCard; 