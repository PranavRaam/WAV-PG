import React, { useState } from 'react';
import './Card.css';

const ReachOutsCard = ({ data }) => {
  const [activeTab, setActiveTab] = useState('calls');

  const formatTime = (hours) => {
    const hrs = Math.floor(hours);
    const mins = Math.round((hours - hrs) * 60);
    if (hrs === 0) return `${mins}m`;
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  };

  const renderMetricGrid = (channelType) => {
    const metrics = data.metrics[channelType];
    return (
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Response Rate</div>
            <div className="metric-value">{metrics.responseRate}%</div>
          </div>
          <div className="metric-description">% of outbound messages that got a reply</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Response Time</div>
            <div className="metric-value">{formatTime(metrics.avgResponseTime)}</div>
          </div>
          <div className="metric-description">Average time to respond</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Positive Response</div>
            <div className="metric-value">{metrics.positiveResponseRate}%</div>
          </div>
          <div className="metric-description">% of replies that were categorized as positive</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">Conversion Rate</div>
            <div className="metric-value">{metrics.conversionRate}%</div>
          </div>
          <div className="metric-description">% that converted to pilot or call</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-title">{channelType === 'emails' ? 'Bounce Rate' : 'Fail Rate'}</div>
            <div className="metric-value negative">
              {channelType === 'emails' ? metrics.bounceRate : metrics.failRate}%
            </div>
          </div>
          <div className="metric-description">
            {channelType === 'emails' ? '% of emails that bounced' : '% of attempts that failed'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="reachouts-content">
      <div className="card-top">
        <div className="card-value">{data.total}</div>
        <div className="card-breakdown">
          <div className="breakdown-item">
            <div className="breakdown-label">Calls</div>
            <div className="breakdown-value">{data.calls}</div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label">E-mails</div>
            <div className="breakdown-value">{data.emails}</div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label">LinkedIn</div>
            <div className="breakdown-value">{data.linkedin}</div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label">Others</div>
            <div className="breakdown-value">{data.others}</div>
          </div>
        </div>
      </div>
      
      <div className="metrics-section">
        <div className="tab-row">
          <div 
            className={`tab calls-tab ${activeTab === 'calls' ? 'active' : ''}`}
            onClick={() => setActiveTab('calls')}
          >
            Calls
          </div>
          <div 
            className={`tab emails-tab ${activeTab === 'emails' ? 'active' : ''}`}
            onClick={() => setActiveTab('emails')}
          >
            E-mails
          </div>
          <div 
            className={`tab linkedin-tab ${activeTab === 'linkedin' ? 'active' : ''}`}
            onClick={() => setActiveTab('linkedin')}
          >
            LinkedIn
          </div>
          <div 
            className={`tab others-tab ${activeTab === 'others' ? 'active' : ''}`}
            onClick={() => setActiveTab('others')}
          >
            Others
          </div>
        </div>
        
        {renderMetricGrid(activeTab)}
      </div>
    </div>
  );
};

export default ReachOutsCard; 