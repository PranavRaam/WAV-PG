import React, { useState } from 'react';
import { FiSearch, FiBarChart2, FiPieChart, FiUsers, FiArrowRight, FiPhone, FiMail, FiLinkedin, FiMoreHorizontal, FiFilter, FiCalendar, FiTrendingUp, FiTarget, FiCheckCircle, FiActivity, FiGrid, FiLayers } from 'react-icons/fi';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, Area, ComposedChart
} from 'recharts';
import './LandingPage.css';

const ResponseVelocityPreview = () => {
  const targetLineColor = 'var(--color-danger, #f87171)';
  const averageLineColor = '#94A3B8';
  
  // Optimize for more compact layout
  return (
    <div className="response-velocity-chart response-velocity-horizontal">
      <div className="chart-header">
        <h4>Customer Success by Channel</h4>
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
                <span className="target-label">1.5h</span>
              </div>
              <div className="average-line" style={{ top: '30%', backgroundColor: averageLineColor }}>
                <span className="average-label">1.2h</span>
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
                <span className="target-label">4h</span>
              </div>
              <div className="average-line" style={{ top: '65%', backgroundColor: averageLineColor }}>
                <span className="average-label">6.3h</span>
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
                <span className="target-label">3h</span>
              </div>
              <div className="average-line" style={{ top: '50%', backgroundColor: averageLineColor }}>
                <span className="average-label">3.5h</span>
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
                <span className="target-label">6h</span>
              </div>
              <div className="average-line" style={{ top: '70%', backgroundColor: averageLineColor }}>
                <span className="average-label">8.2h</span>
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
        
        <div className="chart-legend compact">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: targetLineColor }}></span>
            <span className="legend-text">Target</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: averageLineColor }}></span>
            <span className="legend-text">Average</span>
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
      verticalMix: { CHC: 22, Primary: 15 }
    },
    {
      stage: "Outreach",
      pgCount: 34,
      verticalMix: { CHC: 18, Primary: 12 }
    },
    {
      stage: "Pilots",
      pgCount: 21,
      verticalMix: { CHC: 14, Primary: 6 }
    },
    {
      stage: "Onboarded",
      pgCount: 19,
      verticalMix: { CHC: 12, Primary: 7 }
    },
    {
      stage: "Premium",
      pgCount: 8,
      verticalMix: { CHC: 5, Primary: 3 }
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// New component for the Acquisition Over Time Graph with Recharts
const AcquisitionGraph = () => {
  const [timeFilter, setTimeFilter] = useState('quarterly');
  const [verticalFilter, setVerticalFilter] = useState('all');
  
  // Sample data for the graph - PG acquisition data
  const milestones = [
    { date: "Q1", label: "Pilot campaign started", position: 1 },
    { date: "Q3", label: "New region expansion", position: 3 }
  ];
  
  // Chart data - representing acquired PGs over time
  const chartData = {
    weekly: {
      all: [
        { name: 'W1', value: 2, pv: 20 },
        { name: 'W2', value: 3, pv: 18 },
        { name: 'W3', value: 4, pv: 16 },
        { name: 'W4', value: 5, pv: 14 },
        { name: 'W5', value: 4, pv: 16 },
        { name: 'W6', value: 6, pv: 12 }
      ],
      chc: [
        { name: 'W1', value: 1, pv: 20 },
        { name: 'W2', value: 2, pv: 18 },
        { name: 'W3', value: 3, pv: 16 },
        { name: 'W4', value: 3, pv: 14 },
        { name: 'W5', value: 2, pv: 16 },
        { name: 'W6', value: 4, pv: 12 }
      ]
    },
    monthly: {
      all: [
        { name: 'Jan', value: 4, pv: 20 },
        { name: 'Feb', value: 5, pv: 18 },
        { name: 'Mar', value: 7, pv: 16 },
        { name: 'Apr', value: 8, pv: 14 },
        { name: 'May', value: 10, pv: 12 },
        { name: 'Jun', value: 12, pv: 10 }
      ],
      chc: [
        { name: 'Jan', value: 3, pv: 20 },
        { name: 'Feb', value: 4, pv: 18 },
        { name: 'Mar', value: 5, pv: 16 },
        { name: 'Apr', value: 6, pv: 14 },
        { name: 'May', value: 7, pv: 12 },
        { name: 'Jun', value: 8, pv: 10 }
      ]
    },
    quarterly: {
      all: [
        { name: 'Q1', value: 12, pv: 20 },
        { name: 'Q2', value: 16, pv: 16 },
        { name: 'Q3', value: 19, pv: 12 },
        { name: 'Q4', value: 23, pv: 8 }
      ],
      chc: [
        { name: 'Q1', value: 8, pv: 20 },
        { name: 'Q2', value: 10, pv: 16 },
        { name: 'Q3', value: 12, pv: 12 },
        { name: 'Q4', value: 15, pv: 8 }
      ],
      primary: [
        { name: 'Q1', value: 3, pv: 20 },
        { name: 'Q2', value: 5, pv: 16 },
        { name: 'Q3', value: 6, pv: 12 },
        { name: 'Q4', value: 7, pv: 8 }
      ],
      geriatrics: [
        { name: 'Q1', value: 1, pv: 20 },
        { name: 'Q2', value: 1, pv: 16 },
        { name: 'Q3', value: 1, pv: 12 },
        { name: 'Q4', value: 1, pv: 8 }
      ]
    }
  };
  
  // Get current data based on filters
  const currentData = chartData[timeFilter]?.[verticalFilter] || chartData[timeFilter]?.all;
  
  // Total PGs acquired in current view
  const totalAcquired = currentData.reduce((sum, point) => sum + point.value, 0);
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="recharts-custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          <p className="tooltip-value">{`Acquired PGs: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  // Find milestone data for current timeFilter
  const currentMilestones = timeFilter === 'quarterly' ? milestones : [];
  
  return (
    <div className="acquisition-graph-container">
      <div className="graph-header">
        <h4>Acquired PGs: <span>{totalAcquired}</span></h4>
      </div>
      <div className="graph-controls">
        <div className="time-filter">
          <button 
            className={`filter-btn ${timeFilter === 'weekly' ? 'active' : ''}`}
            onClick={() => setTimeFilter('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`filter-btn ${timeFilter === 'monthly' ? 'active' : ''}`}
            onClick={() => setTimeFilter('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`filter-btn ${timeFilter === 'quarterly' ? 'active' : ''}`}
            onClick={() => setTimeFilter('quarterly')}
          >
            Quarterly
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
      
      <div className="graph-visualization recharts-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={currentData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#f1f5f9" 
            />
            <XAxis 
              dataKey="name" 
              axisLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={{ stroke: '#94a3b8' }}
            />
            <YAxis 
              axisLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={{ stroke: '#94a3b8' }}
              domain={[0, 'dataMax + 5']}
              label={{ 
                value: 'PGs Acquired', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#64748b', fontSize: 12 },
                offset: -5
              }}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '5 5' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="none"
              fillOpacity={1}
              fill="url(#colorValue)" 
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="var(--color-primary)" 
              strokeWidth={2.5}
              dot={{ 
                stroke: 'var(--color-primary)', 
                strokeWidth: 2, 
                r: 4,
                fill: '#fff'
              }}
              activeDot={{ 
                stroke: 'var(--color-primary)', 
                strokeWidth: 2, 
                r: 6,
                fill: '#fff'
              }}
            />
            
            {/* Milestone reference lines */}
            {currentMilestones.map((milestone, index) => (
              <ReferenceLine 
                key={`milestone-${index}`}
                x={milestone.date} 
                stroke="var(--color-warning)"
                strokeDasharray="3 3"
                label={{ 
                  value: milestone.label,
                  position: 'insideTopRight',
                  fill: '#f59e0b',
                  fontSize: 10
                }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
        
        <div className="milestone-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "var(--color-warning)" }}></span>
            <span className="legend-text">Milestone</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "var(--color-primary)" }}></span>
            <span className="legend-text">Acquired PGs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="landing-container">
      {/* Enhanced Goals Section */}
      <div className="goals-section">
        <div className="goal-card">
          <div className="goal-card-inner">
            <div className="goal-icon">
              <FiTarget />
            </div>
            <div className="goal-content">
              <h3>Goal 1</h3>
              <div className="goal-progress-wrapper">
                <div className="goal-progress">65%</div>
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="goal-card">
          <div className="goal-card-inner">
            <div className="goal-icon">
              <FiTrendingUp />
            </div>
            <div className="goal-content">
              <h3>Goal 2</h3>
              <div className="goal-progress-wrapper">
                <div className="goal-progress">12%</div>
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="goal-card">
          <div className="goal-card-inner">
            <div className="goal-icon">
              <FiCheckCircle />
            </div>
            <div className="goal-content">
              <h3>Goal 3</h3>
              <div className="goal-progress-wrapper">
                <div className="goal-progress">82</div>
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: '82%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced USA Statistical Areas */}
      <div className="search-section">
        <div className="section-header">
          <h3>USA Statistical Areas</h3>
          <div className="section-actions">
            <button className="action-button"><FiFilter /></button>
          </div>
        </div>
        
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search by region or state..." />
        </div>
        
        <div className="section-tabs">
          <div className="section-tab active">All Regions</div>
          <div className="section-tab">Metropolitan</div>
          <div className="section-tab">Micropolitan</div>
        </div>
        
        <div className="usa-stat-areas">
          <div className="stat-area-item">
            <div className="stat-area-header">
              <div className="stat-area-title">
                <h4>Northeast Region</h4>
                <div className="stat-area-badge">9 States</div>
              </div>
              <div className="stat-area-value-wrapper">
                <span className="stat-area-value">64.5M</span>
                <span className="stat-area-trend positive">+1.2%</span>
              </div>
            </div>
            <div className="stat-area-bar-wrapper">
              <div className="stat-area-bar" style={{ width: '75%' }}></div>
              <div className="stat-area-percentage">18.9% of US</div>
            </div>
          </div>
          
          <div className="stat-area-item">
            <div className="stat-area-header">
              <div className="stat-area-title">
                <h4>Midwest Region</h4>
                <div className="stat-area-badge">12 States</div>
              </div>
              <div className="stat-area-value-wrapper">
                <span className="stat-area-value">68.3M</span>
                <span className="stat-area-trend positive">+0.8%</span>
              </div>
            </div>
            <div className="stat-area-bar-wrapper">
              <div className="stat-area-bar" style={{ width: '69%' }}></div>
              <div className="stat-area-percentage">20.1% of US</div>
            </div>
          </div>
          
          <div className="stat-area-item highlighted">
            <div className="stat-area-header">
              <div className="stat-area-title">
                <h4>South Region</h4>
                <div className="stat-area-badge">16 States</div>
              </div>
              <div className="stat-area-value-wrapper">
                <span className="stat-area-value">126.2M</span>
                <span className="stat-area-trend positive">+2.4%</span>
              </div>
            </div>
            <div className="stat-area-bar-wrapper">
              <div className="stat-area-bar" style={{ width: '92%' }}></div>
              <div className="stat-area-percentage">37.1% of US</div>
            </div>
          </div>
          
          <div className="stat-area-item">
            <div className="stat-area-header">
              <div className="stat-area-title">
                <h4>West Region</h4>
                <div className="stat-area-badge">13 States</div>
              </div>
              <div className="stat-area-value-wrapper">
                <span className="stat-area-value">78.9M</span>
                <span className="stat-area-trend positive">+1.5%</span>
              </div>
            </div>
            <div className="stat-area-bar-wrapper">
              <div className="stat-area-bar" style={{ width: '81%' }}></div>
              <div className="stat-area-percentage">23.9% of US</div>
            </div>
          </div>
          
          <div className="stat-area-item">
            <div className="stat-area-header">
              <div className="stat-area-title">
                <h4>Metropolitan Areas</h4>
                <div className="stat-area-badge">384 Areas</div>
              </div>
              <div className="stat-area-value-wrapper">
                <span className="stat-area-value">286.4M</span>
                <span className="stat-area-trend positive">+1.9%</span>
              </div>
            </div>
            <div className="stat-area-bar-wrapper">
              <div className="stat-area-bar" style={{ width: '85%' }}></div>
              <div className="stat-area-percentage">85.8% of US</div>
            </div>
          </div>
          
          <div className="stat-area-item">
            <div className="stat-area-header">
              <div className="stat-area-title">
                <h4>Micropolitan Areas</h4>
                <div className="stat-area-badge">543 Areas</div>
              </div>
              <div className="stat-area-value-wrapper">
                <span className="stat-area-value">27.2M</span>
                <span className="stat-area-trend negative">-0.3%</span>
              </div>
            </div>
            <div className="stat-area-bar-wrapper">
              <div className="stat-area-bar" style={{ width: '35%' }}></div>
              <div className="stat-area-percentage">8.1% of US</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Dashboard Cards */}
      <div className="main-content" style={{ gridColumn: 1, gridRow: 2, display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* PG Acquisition Dashboard - Enhanced */}
        <div className="dashboard-card enhanced">
          <div className="dashboard-card-header">
            <div className="dashboard-title">
              <h3>PG Acquisition Dashboard</h3>
              <p className="dashboard-subtitle">Performance overview of acquisition funnel</p>
            </div>
          </div>
          
          <div className="dashboard-metrics-summary">
            <div className="metric-summary-item">
              <div className="metric-summary-value">89</div>
              <div className="metric-summary-label">PGs in Pipeline</div>
              <div className="metric-trend positive">+12.6%</div>
            </div>
            <div className="metric-summary-item">
              <div className="metric-summary-value">12</div>
              <div className="metric-summary-label">New This Month</div>
              <div className="metric-trend positive">+4 vs prev</div>
            </div>
            <div className="metric-summary-item">
              <div className="metric-summary-value">4.2</div>
              <div className="metric-summary-label">Avg. Response (hrs)</div>
              <div className="metric-trend negative">+0.5 hrs</div>
            </div>
          </div>
          
          <div className="dashboard-preview">
            <div className="funnel-preview">
              <WAVFunnelPreview />
            </div>
            <div className="graph-preview">
              <AcquisitionGraph />
            </div>
          </div>
          
          <div className="dashboard-footer">
            <div className="dashboard-pill">
              <div className="pill-item">
                <span className="pill-label">Target Progress:</span>
                <span className="pill-value">77.4%</span>
              </div>
              <div className="pill-item">
                <span className="pill-label">Remaining:</span>
                <span className="pill-value">26 PGs</span>
              </div>
            </div>
            <div className="view-details" onClick={() => onNavigate('pgdashboard')}>
              View Dashboard <FiArrowRight />
            </div>
          </div>
        </div>
        
        {/* Secondary Dashboards Row */}
        <div className="dashboard-row">
          {/* Customer Success Dashboard - Enhanced */}
          <div className="dashboard-card enhanced">
            <div className="dashboard-card-header">
              <div className="dashboard-title">
                <h3>Customer Success</h3>
                <p className="dashboard-subtitle">Response times across communication channels</p>
              </div>
            </div>
            
            <div className="dashboard-metrics-summary">
              <div className="metric-summary-item">
                <div className="metric-summary-value">28</div>
                <div className="metric-summary-label">Phone Calls</div>
                <div className="metric-trend positive">1.2hrs avg</div>
              </div>
              <div className="metric-summary-item">
                <div className="metric-summary-value">45</div>
                <div className="metric-summary-label">Emails Sent</div>
                <div className="metric-trend negative">6.3hrs avg</div>
              </div>
              <div className="metric-summary-item highlight">
                <div className="metric-summary-value">89%</div>
                <div className="metric-summary-label">Target Achievement</div>
                <div className="metric-trend positive">+5% vs prev</div>
              </div>
            </div>
            
            <div className="dashboard-preview" style={{ height: '180px', minHeight: 'auto' }}>
              <div className="preview-content" style={{ width: '100%', padding: '15px' }}>
                <ResponseVelocityPreview />
              </div>
            </div>
            
            <div className="dashboard-footer">
              <div className="dashboard-pill">
                <div className="pill-item">
                  <span className="pill-label">Overall Avg:</span>
                  <span className="pill-value">4.8 hrs</span>
                </div>
              </div>
              <div className="view-details" onClick={() => onNavigate('velocitydashboard')}>
                View Dashboard <FiArrowRight />
              </div>
            </div>
          </div>
          
          {/* Market Analysis Dashboard - Enhanced */}
          <div className="dashboard-card enhanced">
            <div className="dashboard-card-header">
              <div className="dashboard-title">
                <h3>Market Analysis</h3>
                <p className="dashboard-subtitle">Market trends and competitive insights</p>
              </div>
            </div>
            
            <div className="dashboard-metrics-summary">
              <div className="metric-summary-item">
                <div className="metric-summary-value">5</div>
                <div className="metric-summary-label">Markets</div>
                <div className="metric-trend positive">+1 new</div>
              </div>
              <div className="metric-summary-item">
                <div className="metric-summary-value">43%</div>
                <div className="metric-summary-label">Coverage</div>
                <div className="metric-trend positive">+5.2%</div>
              </div>
              <div className="metric-summary-item">
                <div className="metric-summary-value">18</div>
                <div className="metric-summary-label">Competitors</div>
                <div className="metric-trend neutral">No change</div>
              </div>
            </div>
            
            <div className="dashboard-preview" style={{ height: '180px', minHeight: 'auto' }}>
              <div className="preview-content with-gradient">
                <div className="chart-placeholder">
                  <FiBarChart2 size={40} />
                  <span>Market trend analysis & competitive insights</span>
                </div>
              </div>
            </div>
            
            <div className="dashboard-footer">
              <div className="dashboard-pill">
                <div className="pill-item">
                  <span className="pill-label">Growth Potential:</span>
                  <span className="pill-value">High</span>
                </div>
              </div>
              <div className="view-details" onClick={() => onNavigate('marketdashboard')}>
                View Dashboard <FiArrowRight />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 