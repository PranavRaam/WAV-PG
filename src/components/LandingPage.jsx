import React, { useState } from 'react';
import { FiSearch, FiBarChart2, FiPieChart, FiUsers, FiArrowRight, FiPhone, FiMail, FiLinkedin, FiMoreHorizontal, FiFilter, FiCalendar } from 'react-icons/fi';
import './LandingPage.css';

const ResponseVelocityPreview = () => {
  const targetLineColor = 'var(--color-danger, #f87171)';
  const averageLineColor = '#94A3B8';
  
  return (
    <div className="response-velocity-chart">
      <div className="chart-header">
        <h4>Response Velocity by Channel</h4>
      </div>
      <div className="chart-content">
        <div className="chart-channels">
          <div className="channel">
            <div className="channel-icon phone-icon">
              <FiPhone />
            </div>
            <div className="channel-info">
              <div className="channel-name">Phone</div>
              <div className="channel-value">28</div>
            </div>
            <div className="channel-chart">
              <div className="target-line" style={{ top: '46%', backgroundColor: targetLineColor }}>
                <span className="target-label">Target (1.5h)</span>
              </div>
              <div className="average-line" style={{ top: '30%', backgroundColor: averageLineColor }}>
                <span className="average-label">Avg (1.2h)</span>
              </div>
              <div className="data-points">
                <span className="data-point success" style={{ top: '20%', left: '10%' }}></span>
                <span className="data-point success" style={{ top: '25%', left: '30%' }}></span>
                <span className="data-point success" style={{ top: '35%', left: '50%' }}></span>
                <span className="data-point success" style={{ top: '40%', left: '70%' }}></span>
                <span className="data-point success" style={{ top: '45%', left: '90%' }}></span>
              </div>
            </div>
          </div>
          
          <div className="channel">
            <div className="channel-icon email-icon">
              <FiMail />
            </div>
            <div className="channel-info">
              <div className="channel-name">Email</div>
              <div className="channel-value">25</div>
            </div>
            <div className="channel-chart">
              <div className="target-line" style={{ top: '46%', backgroundColor: targetLineColor }}>
                <span className="target-label">Target (4h)</span>
              </div>
              <div className="average-line" style={{ top: '65%', backgroundColor: averageLineColor }}>
                <span className="average-label">Avg (6.3h)</span>
              </div>
              <div className="data-points">
                <span className="data-point warning" style={{ top: '50%', left: '15%' }}></span>
                <span className="data-point warning" style={{ top: '60%', left: '35%' }}></span>
                <span className="data-point danger" style={{ top: '70%', left: '55%' }}></span>
                <span className="data-point warning" style={{ top: '55%', left: '75%' }}></span>
                <span className="data-point danger" style={{ top: '75%', left: '95%' }}></span>
              </div>
            </div>
          </div>
          
          <div className="channel">
            <div className="channel-icon linkedin-icon">
              <FiLinkedin />
            </div>
            <div className="channel-info">
              <div className="channel-name">LinkedIn</div>
              <div className="channel-value">20</div>
            </div>
            <div className="channel-chart">
              <div className="target-line" style={{ top: '46%', backgroundColor: targetLineColor }}>
                <span className="target-label">Target (3h)</span>
              </div>
              <div className="average-line" style={{ top: '50%', backgroundColor: averageLineColor }}>
                <span className="average-label">Avg (3.5h)</span>
              </div>
              <div className="data-points">
                <span className="data-point primary" style={{ top: '40%', left: '20%' }}></span>
                <span className="data-point primary" style={{ top: '45%', left: '40%' }}></span>
                <span className="data-point primary" style={{ top: '55%', left: '60%' }}></span>
                <span className="data-point primary" style={{ top: '50%', left: '80%' }}></span>
              </div>
            </div>
          </div>
          
          <div className="channel">
            <div className="channel-icon other-icon">
              <FiMoreHorizontal />
            </div>
            <div className="channel-info">
              <div className="channel-name">Others</div>
              <div className="channel-value">16</div>
            </div>
            <div className="channel-chart">
              <div className="target-line" style={{ top: '46%', backgroundColor: targetLineColor }}>
                <span className="target-label">Target (6h)</span>
              </div>
              <div className="average-line" style={{ top: '70%', backgroundColor: averageLineColor }}>
                <span className="average-label">Avg (8.2h)</span>
              </div>
              <div className="data-points">
                <span className="data-point danger" style={{ top: '60%', left: '25%' }}></span>
                <span className="data-point danger" style={{ top: '75%', left: '45%' }}></span>
                <span className="data-point danger" style={{ top: '80%', left: '65%' }}></span>
                <span className="data-point danger" style={{ top: '65%', left: '85%' }}></span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: targetLineColor }}></span>
            <span className="legend-text">Target Response Time</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: averageLineColor }}></span>
            <span className="legend-text">Average Response Time</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// New component for the WAV Funnel
const WAVFunnelPreview = () => {
  const [hoveredStage, setHoveredStage] = useState(null);
  
  // Funnel data for each stage
  const funnelData = [
    {
      stage: "Targets",
      pgCount: 45,
      verticalMix: { CHC: 22, Primary: 15, Geriatrics: 8 },
      conversionRate: 75,
      avgDaysInStage: 12,
      trustScore: 65
    },
    {
      stage: "Outreach",
      pgCount: 34,
      verticalMix: { CHC: 18, Primary: 12, Geriatrics: 4 },
      conversionRate: 62,
      avgDaysInStage: 21,
      trustScore: 72
    },
    {
      stage: "Pilots",
      pgCount: 21,
      verticalMix: { CHC: 14, Primary: 6, Geriatrics: 1 },
      conversionRate: 90,
      avgDaysInStage: 30,
      trustScore: 84
    },
    {
      stage: "Onboarded",
      pgCount: 19,
      verticalMix: { CHC: 12, Primary: 7, Geriatrics: 0 },
      conversionRate: 42,
      avgDaysInStage: 45,
      trustScore: 88
    },
    {
      stage: "Premium",
      pgCount: 8,
      verticalMix: { CHC: 5, Primary: 3, Geriatrics: 0 },
      conversionRate: 0,
      avgDaysInStage: 90,
      trustScore: 95
    }
  ];
  
  return (
    <div className="wav-funnel-container">
      <div className="funnel-stages">
        {funnelData.map((data, index) => {
          const widthPercentage = 100 - (index * 15); // Decrease width for each stage
          
          return (
            <div 
              key={data.stage}
              className="funnel-stage" 
              style={{ width: `${widthPercentage}%` }}
              onMouseEnter={() => setHoveredStage(index)}
              onMouseLeave={() => setHoveredStage(null)}
            >
              <div className="stage-label">{data.stage}</div>
              <div className="stage-count">{data.pgCount}</div>
            </div>
          );
        })}
      </div>
      
      {hoveredStage !== null && (
        <div className="funnel-hover-info">
          <div className="hover-box">
            <h4>{funnelData[hoveredStage].stage}</h4>
            <div className="hover-main-metrics">
              <div className="hover-metric-large">
                <span className="metric-value-large">{funnelData[hoveredStage].pgCount}</span>
                <span className="metric-label-large">PGs</span>
              </div>
              <div className="hover-vertical-breakdown">
                <div className="vertical-item">
                  <span className="vertical-label">CHC:</span>
                  <span className="vertical-value">{funnelData[hoveredStage].verticalMix.CHC}</span>
                </div>
                <div className="vertical-item">
                  <span className="vertical-label">Primary:</span>
                  <span className="vertical-value">{funnelData[hoveredStage].verticalMix.Primary}</span>
                </div>
                {funnelData[hoveredStage].verticalMix.Geriatrics > 0 && (
                  <div className="vertical-item">
                    <span className="vertical-label">Geriatrics:</span>
                    <span className="vertical-value">{funnelData[hoveredStage].verticalMix.Geriatrics}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="hover-metrics">
              <div className="hover-metric">
                <span className="metric-value">{funnelData[hoveredStage].conversionRate}%</span>
                <span className="metric-label">Conversion</span>
              </div>
              <div className="hover-metric">
                <span className="metric-value">{funnelData[hoveredStage].avgDaysInStage}</span>
                <span className="metric-label">Avg Days</span>
              </div>
              <div className="hover-metric">
                <span className="metric-value">{funnelData[hoveredStage].trustScore}</span>
                <span className="metric-label">Trust Score</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// New component for the Acquisition Over Time Graph
const AcquisitionGraph = () => {
  const [timeFilter, setTimeFilter] = useState('quarterly');
  const [verticalFilter, setVerticalFilter] = useState('all');
  
  // Sample data for the graph
  const milestones = [
    { date: "Q1", label: "Pilot campaign started", position: 30 },
    { date: "Q3", label: "New region expansion", position: 70 }
  ];
  
  // Chart data
  const chartData = {
    quarterly: {
      all: [
        { x: 10, y: 40, value: 12 },
        { x: 30, y: 30, value: 16 },
        { x: 50, y: 45, value: 10 },
        { x: 70, y: 25, value: 19 },
        { x: 90, y: 15, value: 23 }
      ],
      chc: [
        { x: 10, y: 42, value: 8 },
        { x: 30, y: 32, value: 10 },
        { x: 50, y: 47, value: 6 },
        { x: 70, y: 27, value: 12 },
        { x: 90, y: 17, value: 15 }
      ]
    },
    monthly: {
      all: [
        { x: 5, y: 45, value: 4 },
        { x: 15, y: 40, value: 5 },
        { x: 25, y: 35, value: 6 },
        { x: 35, y: 30, value: 7 },
        { x: 45, y: 40, value: 5 },
        { x: 55, y: 45, value: 4 },
        { x: 65, y: 35, value: 6 },
        { x: 75, y: 25, value: 8 },
        { x: 85, y: 20, value: 9 },
        { x: 95, y: 15, value: 10 }
      ]
    }
  };
  
  // Get current data based on filters
  const currentData = chartData[timeFilter]?.[verticalFilter] || chartData[timeFilter]?.all;
  
  // Generate points string for polyline
  const pointsString = currentData.map(point => `${point.x},${point.y}`).join(' ');
  
  // X-axis labels based on filter
  const xAxisLabels = timeFilter === 'quarterly' 
    ? [{ x: 15, label: 'Q1' }, { x: 35, label: 'Q2' }, { x: 55, label: 'Q3' }, { x: 75, label: 'Q4' }]
    : [{ x: 10, label: 'Jan' }, { x: 20, label: 'Feb' }, { x: 30, label: 'Mar' }, 
       { x: 40, label: 'Apr' }, { x: 50, label: 'May' }, { x: 60, label: 'Jun' },
       { x: 70, label: 'Jul' }, { x: 80, label: 'Aug' }, { x: 90, label: 'Sep' }];
  
  return (
    <div className="acquisition-graph-container">
      <div className="graph-controls">
        <div className="time-filter">
          <button 
            className={`filter-btn ${timeFilter === 'quarterly' ? 'active' : ''}`}
            onClick={() => setTimeFilter('quarterly')}
          >
            Quarterly
          </button>
          <button 
            className={`filter-btn ${timeFilter === 'monthly' ? 'active' : ''}`}
            onClick={() => setTimeFilter('monthly')}
          >
            Monthly
          </button>
        </div>
        <div className="vertical-filter">
          <select 
            value={verticalFilter}
            onChange={(e) => setVerticalFilter(e.target.value)}
            className="vertical-select"
          >
            <option value="all">All Verticals</option>
            <option value="chc">CHC</option>
            <option value="primary">Primary</option>
            <option value="geriatrics">Geriatrics</option>
          </select>
        </div>
      </div>
      
      <div className="graph-visualization">
        <svg width="100%" height="100%" viewBox="0 0 100 60">
          {/* Background grid */}
          <g className="grid-lines">
            <line x1="5" y1="15" x2="95" y2="15" stroke="#f1f5f9" strokeWidth="0.5" />
            <line x1="5" y1="25" x2="95" y2="25" stroke="#f1f5f9" strokeWidth="0.5" />
            <line x1="5" y1="35" x2="95" y2="35" stroke="#f1f5f9" strokeWidth="0.5" />
            <line x1="5" y1="45" x2="95" y2="45" stroke="#f1f5f9" strokeWidth="0.5" />
            
            {xAxisLabels.map((item, i) => (
              <line 
                key={`grid-${i}`}
                x1={item.x} 
                y1="5" 
                x2={item.x} 
                y2="55" 
                stroke="#f1f5f9" 
                strokeWidth="0.5" 
              />
            ))}
          </g>
          
          {/* Y-axis */}
          <line x1="5" y1="5" x2="5" y2="55" stroke="#cbd5e1" strokeWidth="1" />
          <text x="2" y="10" fontSize="3" fill="#64748b">20</text>
          <text x="2" y="30" fontSize="3" fill="#64748b">10</text>
          <text x="2" y="50" fontSize="3" fill="#64748b">0</text>
          
          {/* X-axis */}
          <line x1="5" y1="55" x2="95" y2="55" stroke="#cbd5e1" strokeWidth="1" />
          {xAxisLabels.map((item, i) => (
            <text key={`label-${i}`} x={item.x} y="59" fontSize="3" fill="#64748b" textAnchor="middle">{item.label}</text>
          ))}
          
          {/* Milestone markers */}
          {milestones.map((milestone, i) => (
            <g key={`milestone-${i}`} className="milestone-marker">
              <line 
                x1={milestone.position} 
                y1="10" 
                x2={milestone.position} 
                y2="55" 
                stroke="#f59e0b" 
                strokeWidth="1" 
                strokeDasharray="2,2" 
              />
              <circle cx={milestone.position} cy="10" r="2" fill="#f59e0b" />
              <title>{milestone.label}</title>
            </g>
          ))}
          
          {/* Area under the line */}
          <path
            d={`M${currentData[0].x},55 ${currentData.map(p => `L${p.x},${p.y}`).join(' ')} L${currentData[currentData.length-1].x},55 Z`}
            fill="rgba(14, 165, 233, 0.1)"
          />
          
          {/* Data line */}
          <polyline
            points={pointsString}
            fill="none"
            stroke="var(--color-primary, #0ea5e9)"
            strokeWidth="2"
          />
          
          {/* Data points with tooltips */}
          {currentData.map((point, i) => (
            <g key={`point-${i}`} className="data-point-group">
              <circle cx={point.x} cy={point.y} r="3" fill="var(--color-primary, #0ea5e9)" />
              <circle 
                cx={point.x} 
                cy={point.y} 
                r="6" 
                fill="transparent" 
                stroke="transparent" 
                strokeWidth="2"
                className="hover-target"
              />
              <g className="point-tooltip" transform={`translate(${point.x - 10}, ${point.y - 15})`}>
                <rect x="0" y="0" width="20" height="10" rx="2" fill="white" stroke="#cbd5e1" strokeWidth="0.5" />
                <text x="10" y="7" fontSize="4" fill="#334155" textAnchor="middle">{point.value}</text>
              </g>
            </g>
          ))}
        </svg>
        
        <div className="milestone-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "#f59e0b" }}></span>
            <span className="legend-text">Milestone</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "var(--color-primary, #0ea5e9)" }}></span>
            <span className="legend-text">Onboarded PGs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="landing-container">
      <div className="goals-section">
        <div className="goal-card">
          <h3>Goal 1</h3>
          <div className="goal-progress">30%</div>
        </div>
        <div className="goal-card">
          <h3>Goal 2</h3>
          <div className="goal-progress">40%</div>
        </div>
        <div className="goal-card">
          <h3>Goal 3</h3>
          <div className="goal-progress">50%</div>
        </div>
      </div>
      
      <div className="search-section">
        <h3>Listing of 546</h3>
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
        <div className="search-results">
          No results to display
        </div>
      </div>
      
      <div className="dashboards-section">
        <div className="dashboard-card" onClick={() => onNavigate('pgdashboard')}>
          <h3>PG Acquisition Dashboard</h3>
          <div className="dashboard-preview">
            <div className="funnel-preview">
              <WAVFunnelPreview />
            </div>
            <div className="graph-preview">
              <AcquisitionGraph />
            </div>
          </div>
          <div className="dashboard-info">
            <p>Quarterly/Monthly filter based acquired no.</p>
            <div className="view-details">
              View Dashboard <FiArrowRight />
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Market Analysis Dashboard</h3>
          <div className="dashboard-preview">
            <FiBarChart2 size={40} />
            <span>Market analysis data visualization</span>
          </div>
          <div className="dashboard-info">
            <p>Comprehensive market data and competitive analysis</p>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Response Velocity Dashboard</h3>
          <div className="dashboard-preview">
            <ResponseVelocityPreview />
          </div>
          <div className="dashboard-info">
            <p>Track response times across communication channels</p>
          </div>
        </div>
      </div>
      
      <div className="sidebar-info">
        <h3>Goals, proximity score</h3>
        <p>circle of stages (how many pg, hhah)</p>
      </div>
    </div>
  );
};

export default LandingPage; 