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
      <div className="goals-section">
        <div className="goal-card">
          <h3><FiTarget /> Acquisition Target</h3>
          <div className="goal-progress">65%</div>
          <div className="goal-description">75 of 115 acquired</div>
        </div>
        <div className="goal-card">
          <h3><FiTrendingUp /> Growth Rate</h3>
          <div className="goal-progress">12%</div>
          <div className="goal-description">Monthly increase</div>
        </div>
        <div className="goal-card">
          <h3><FiCheckCircle /> Trust Score</h3>
          <div className="goal-progress">82</div>
          <div className="goal-description">+5 points since last month</div>
        </div>
      </div>
      
      <div className="search-section">
        <h3>Search PG Database</h3>
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search by name, location, or specialty..." />
        </div>
        <div className="search-filters">
          <div className="filter-badge active">
            <FiLayers /> All PGs
          </div>
          <div className="filter-badge">
            <FiTarget /> Targets
          </div>
          <div className="filter-badge">
            <FiActivity /> Active
          </div>
        </div>
        <div className="search-results">
          <div className="empty-search-state">
            <FiSearch size={32} />
            <p>Enter search query to find Practice Groups</p>
          </div>
        </div>
      </div>
      
      <div className="dashboards-section">
        {/* PG Acquisition Dashboard - Full width */}
        <div className="dashboard-card full-width" onClick={() => onNavigate('pgdashboard')}>
          <div className="dashboard-card-header">
            <h3>PG Acquisition Dashboard</h3>
            <div className="dashboard-badge">Primary</div>
          </div>
          <div className="dashboard-preview">
            <div className="funnel-preview">
              <WAVFunnelPreview />
            </div>
            <div className="graph-preview">
              <AcquisitionGraph />
            </div>
          </div>
          <div className="dashboard-info">
            <div className="dashboard-metrics">
              <div className="metric-item">
                <span className="metric-value">89</span>
                <span className="metric-label">PGs in Pipeline</span>
              </div>
              <div className="metric-item">
                <span className="metric-value">12</span>
                <span className="metric-label">New This Month</span>
              </div>
              <div className="metric-item">
                <span className="metric-value">4.2</span>
                <span className="metric-label">Avg. Response (hrs)</span>
              </div>
            </div>
            <div className="view-details">
              View Dashboard <FiArrowRight />
            </div>
          </div>
        </div>
        
        {/* Response Velocity Dashboard - Half width */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Response Velocity</h3>
            <div className="dashboard-badge success">New</div>
          </div>
          <div className="dashboard-preview">
            <div className="preview-content">
              <ResponseVelocityPreview />
            </div>
          </div>
          <div className="dashboard-info">
            <div className="dashboard-metrics">
              <div className="metric-item">
                <span className="metric-value">28</span>
                <span className="metric-label">Phone Calls</span>
              </div>
              <div className="metric-item">
                <span className="metric-value">45</span>
                <span className="metric-label">Emails Sent</span>
              </div>
            </div>
            <div className="view-details">
              View Dashboard <FiArrowRight />
            </div>
          </div>
        </div>
        
        {/* Market Analysis Dashboard - Half width */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Market Analysis</h3>
            <div className="dashboard-badge warning">Updated</div>
          </div>
          <div className="dashboard-preview">
            <div className="preview-content with-gradient">
              <div className="chart-placeholder">
                <FiBarChart2 size={40} />
                <span>Market trend analysis & competitive insights</span>
              </div>
            </div>
          </div>
          <div className="dashboard-info">
            <div className="dashboard-metrics">
              <div className="metric-item">
                <span className="metric-value">5</span>
                <span className="metric-label">Markets</span>
              </div>
              <div className="metric-item">
                <span className="metric-value">43%</span>
                <span className="metric-label">Coverage</span>
              </div>
            </div>
            <div className="view-details">
              View Dashboard <FiArrowRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 