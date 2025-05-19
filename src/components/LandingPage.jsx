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
            <div className="channel-info">
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
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 3 }); // Control visible data range
  
  // Target data - representing the target number of PGs to acquire
  // Based on the 77.4% completion with 26 PGs remaining, total target is ~115
  const targetTotal = 115;
  
  // Chart data - representing acquired PGs over time with specific dates
  const chartData = {
    weekly: {
      all: [
        { name: '2023-01-02', displayName: 'Jan 2', value: 2, target: 3 },
        { name: '2023-01-09', displayName: 'Jan 9', value: 3, target: 3 },
        { name: '2023-01-16', displayName: 'Jan 16', value: 4, target: 3 },
        { name: '2023-01-23', displayName: 'Jan 23', value: 5, target: 3 },
        { name: '2023-01-30', displayName: 'Jan 30', value: 4, target: 3 },
        { name: '2023-02-06', displayName: 'Feb 6', value: 6, target: 3 },
        { name: '2023-02-13', displayName: 'Feb 13', value: 5, target: 3 },
        { name: '2023-02-20', displayName: 'Feb 20', value: 7, target: 3 },
        { name: '2023-02-27', displayName: 'Feb 27', value: 8, target: 3 },
        { name: '2023-03-06', displayName: 'Mar 6', value: 6, target: 3 },
        { name: '2023-03-13', displayName: 'Mar 13', value: 9, target: 3 },
        { name: '2023-03-20', displayName: 'Mar 20', value: 7, target: 3 }
      ],
      chc: [
        // Similar structure with CHC specific data
        { name: '2023-01-02', displayName: 'Jan 2', value: 1, target: 2 },
        { name: '2023-01-09', displayName: 'Jan 9', value: 2, target: 2 },
        // ... more weeks
      ]
    },
    monthly: {
      all: [
        { name: '2023-01-01', displayName: 'Jan 2023', value: 4, target: 8 },
        { name: '2023-02-01', displayName: 'Feb 2023', value: 5, target: 8 },
        { name: '2023-03-01', displayName: 'Mar 2023', value: 7, target: 8 },
        { name: '2023-04-01', displayName: 'Apr 2023', value: 8, target: 8 },
        { name: '2023-05-01', displayName: 'May 2023', value: 10, target: 9 },
        { name: '2023-06-01', displayName: 'Jun 2023', value: 12, target: 9 },
        { name: '2023-07-01', displayName: 'Jul 2023', value: 14, target: 9 },
        { name: '2023-08-01', displayName: 'Aug 2023', value: 15, target: 9 },
        { name: '2023-09-01', displayName: 'Sep 2023', value: 16, target: 9 },
        { name: '2023-10-01', displayName: 'Oct 2023', value: 18, target: 9 },
        { name: '2023-11-01', displayName: 'Nov 2023', value: 19, target: 9 },
        { name: '2023-12-01', displayName: 'Dec 2023', value: 21, target: 9 }
      ],
      chc: [
        // Similar structure with CHC specific data
        { name: '2023-01-01', displayName: 'Jan 2023', value: 3, target: 6 },
        { name: '2023-02-01', displayName: 'Feb 2023', value: 4, target: 6 },
        // ... more months
      ]
    },
    quarterly: {
      all: [
        { name: '2022-01-01', displayName: 'Q1 2022', value: 8, target: 12 },
        { name: '2022-04-01', displayName: 'Q2 2022', value: 10, target: 12 },
        { name: '2022-07-01', displayName: 'Q3 2022', value: 14, target: 15 },
        { name: '2022-10-01', displayName: 'Q4 2022', value: 18, target: 15 },
        { name: '2023-01-01', displayName: 'Q1 2023', value: 22, target: 18 },
        { name: '2023-04-01', displayName: 'Q2 2023', value: 28, target: 18 },
        { name: '2023-07-01', displayName: 'Q3 2023', value: 35, target: 20 },
        { name: '2023-10-01', displayName: 'Q4 2023', value: 42, target: 20 },
        { name: '2024-01-01', displayName: 'Q1 2024', value: 55, target: 25 },
        { name: '2024-04-01', displayName: 'Q2 2024', value: 62, target: 25 },
        { name: '2024-07-01', displayName: 'Q3 2024', value: 70, target: 28 }
      ],
      chc: [
        // Similar structure with CHC specific data
        { name: '2022-01-01', displayName: 'Q1 2022', value: 5, target: 8 },
        { name: '2022-04-01', displayName: 'Q2 2022', value: 7, target: 8 },
        // ... more quarters
      ],
      primary: [
        // Similar structure with Primary specific data
        { name: '2022-01-01', displayName: 'Q1 2022', value: 2, target: 3 },
        { name: '2022-04-01', displayName: 'Q2 2022', value: 3, target: 3 },
        // ... more quarters
      ],
      geriatrics: [
        // Similar structure with Geriatrics specific data
        { name: '2022-01-01', displayName: 'Q1 2022', value: 1, target: 1 },
        { name: '2022-04-01', displayName: 'Q2 2022', value: 1, target: 1 },
        // ... more quarters
      ]
    }
  };
  
  // Get current data based on filters
  const currentData = chartData[timeFilter]?.[verticalFilter] || chartData[timeFilter]?.all;
  
  // Calculate visible data slice based on current range
  const visibleData = currentData.slice(visibleRange.start, visibleRange.end + 1);
  
  // Total PGs acquired in current view
  const totalAcquired = currentData.reduce((sum, point) => sum + point.value, 0);
  
  // Scrolling controls
  const handleScrollLeft = () => {
    if (visibleRange.start > 0) {
      setVisibleRange({
        start: visibleRange.start - 1,
        end: visibleRange.end - 1
      });
    }
  };
  
  const handleScrollRight = () => {
    if (visibleRange.end < currentData.length - 1) {
      setVisibleRange({
        start: visibleRange.start + 1,
        end: visibleRange.end + 1
      });
    }
  };
  
  // Reset visible range when changing filters
  React.useEffect(() => {
    const visiblePoints = timeFilter === 'weekly' ? 6 : 4; // Show more points in weekly view
    setVisibleRange({
      start: 0,
      end: Math.min(visiblePoints - 1, currentData.length - 1)
    });
  }, [timeFilter, verticalFilter, currentData.length]);
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = currentData.find(item => item.name === label);
      return (
        <div className="recharts-custom-tooltip">
          <p className="tooltip-label">{dataPoint?.displayName || label}</p>
          <p className="tooltip-value">{`Acquired PGs: ${payload[0].value}`}</p>
          <p className="tooltip-value">{`Target PGs: ${payload[1].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
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
        <div className="scroll-controls">
          <button 
            className="scroll-btn left" 
            onClick={handleScrollLeft}
            disabled={visibleRange.start === 0}
          >
            &lt;
          </button>
          
          <ResponsiveContainer width="90%" height="100%">
            <ComposedChart
              data={visibleData}
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
                tickFormatter={(value) => {
                  const dataPoint = currentData.find(item => item.name === value);
                  return dataPoint?.displayName || value;
                }}
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
              
              {/* Target line */}
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="var(--color-danger)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
          
          <button 
            className="scroll-btn right" 
            onClick={handleScrollRight}
            disabled={visibleRange.end >= currentData.length - 1}
          >
            &gt;
          </button>
        </div>
        
        <div className="milestone-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: "var(--color-danger)" }}></span>
            <span className="legend-text">Target PGs</span>
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
          <div className="section-tab">Virgin</div>
          <div className="section-tab">Non Virgin</div>
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
                <h4>Virgin Areas</h4>
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
                <h4>Non Virgin Areas</h4>
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
          
          <div className="dashboard-preview">
            <div className="funnel-preview">
              <WAVFunnelPreview />
            </div>
            <div className="graph-preview">
              <AcquisitionGraph />
            </div>
          </div>
          
          <div className="dashboard-metrics-summary">
            <div className="metric-summary-item">
              <div className="metric-summary-value">89</div>
              <div className="metric-summary-label">PGs in Funnel</div>
              <div className="metric-trend positive">+12.6%</div>
            </div>
            <div className="metric-summary-item">
              <div className="metric-summary-value">12</div>
              <div className="metric-summary-label">New This Month</div>
              <div className="metric-trend positive">+4 vs prev</div>
            </div>
          </div>
          
          <div className="dashboard-footer">
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