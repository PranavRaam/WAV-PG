import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './GrowthChart.css';

const GrowthChart = ({ data }) => {
  const [selectedStage, setSelectedStage] = useState('all');
  const [timeRange, setTimeRange] = useState('months');
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [timeUnit, setTimeUnit] = useState('months');
  const [chartData, setChartData] = useState([]);

  // KPI definitions for each stage
  const stageKpis = {
    'Stage 1': 'Data completeness & min. 5 reach outs',
    'Stage 2': 'Avg score of total contacts (40%)',
    'Stage 3': 'Trust score ≥3, min. 1 promoter, engagement ≥15min',
    'Stage 4': 'Pilot to POC approval <7 days',
    'Stage 5': '≥100 active patients'
  };

  // Stage colors for multiple lines
  const stageColors = {
    'Stage 1': '#f43f5e',
    'Stage 2': '#fb7185',
    'Stage 3': '#fda4af',
    'Stage 4': '#0ea5e9',
    'Stage 5': '#38bdf8'
  };

  // Detailed KPI descriptions
  const detailedKpis = {
    'Stage 1': [
      'Data completeness: contacts, practitioners, EHR, billing, patient census',
      'Reach out: minimum 5 times (sum of all channels)'
    ],
    'Stage 2': [
      'Average score of total contacts made (40%)'
    ],
    'Stage 3': [
      'Average trust score greater than or equal to 3 (out of 5)',
      'Minimum 1 promoter',
      'Last engagement duration greater than or equal to 15 minutes'
    ],
    'Stage 4': [
      'Pilot to POC approval turnaround time less than 7 days'
    ],
    'Stage 5': [
      'Greater than or equal to 100 active patients'
    ]
  };

  useEffect(() => {
    // Process data based on timeUnit and create separate data series for each stage
    const processedData = {};
    
    if (data && data[timeUnit]) {
      // Group data by name (month/week)
      data[timeUnit].forEach(item => {
        if (!processedData[item.name]) {
          processedData[item.name] = {
            name: item.name
          };
        }
        
        // Add value to the corresponding stage
        processedData[item.name][item.stage] = item.value;
      });
      
      // Convert object to array
      setChartData(Object.values(processedData));
    }
  }, [timeUnit, data]);

  // Filter data based on selected stage and time range
  const getFilteredData = () => {
    if (selectedStage === 'all') {
      // For "All Stages", we need to restructure the data to group by time period
      const timePoints = [...new Set(data[timeRange].map(item => item.name))];
      
      return timePoints.map(timePoint => {
        const pointData = { name: timePoint };
        
        // Add each stage's value to the data point
        Object.keys(stageKpis).forEach(stage => {
          const stageData = data[timeRange].find(item => item.name === timePoint && item.stage === stage);
          if (stageData) {
            pointData[stage] = stageData.value;
          }
        });
        
        return pointData;
      });
    }
    
    // For single stage selection, filter by the selected stage
    return data[timeRange].filter(item => item.stage === selectedStage);
  };

  const filteredData = getFilteredData();

  // Handle showing tooltip for KPI details
  const handleStageHover = (stage, event) => {
    if (stage === 'all') return;
    
    const rect = event.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right + 10,
      y: rect.top
    });
    setTooltipContent(detailedKpis[stage]);
    setShowTooltip(true);
  };

  return (
    <div className="growth-chart-container">
      <div className="growth-chart-filters">
        <div className="filter-group">
          <label>Filter by KPI Stage:</label>
          <select 
            value={selectedStage} 
            onChange={(e) => setSelectedStage(e.target.value)}
            className="chart-filter"
          >
            <option value="all">All Stages</option>
            {Object.keys(stageKpis).map((stage) => (
              <option 
                key={stage} 
                value={stage}
                onMouseEnter={(e) => handleStageHover(stage, e)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                {stage}
              </option>
            ))}
          </select>
          <div className="kpi-info">
            {selectedStage !== 'all' && (
              <span className="kpi-description">{stageKpis[selectedStage]}</span>
            )}
          </div>
        </div>
        
        <div className="filter-group">
          <label>Time Period:</label>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="chart-filter"
          >
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
            <option value="quarters">Quarters</option>
          </select>
        </div>
      </div>
      
      {showTooltip && (
        <div 
          className="kpi-tooltip"
          style={{
            position: 'absolute',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          <div className="tooltip-header">KPI Criteria</div>
          <ul className="tooltip-list">
            {tooltipContent.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="chart-controls">
        <div className="time-toggle">
          <button 
            className={`toggle-button ${timeUnit === 'weeks' ? 'active' : ''}`}
            onClick={() => setTimeUnit('weeks')}
          >
            Weekly
          </button>
          <button 
            className={`toggle-button ${timeUnit === 'months' ? 'active' : ''}`}
            onClick={() => setTimeUnit('months')}
          >
            Monthly
          </button>
        </div>
      </div>
      
      <div className="stage-legend">
        <div className="legend-item">
          <span className="legend-color stage-1"></span>
          <span>Stage 1</span>
        </div>
        <div className="legend-item">
          <span className="legend-color stage-2"></span>
          <span>Stage 2</span>
        </div>
        <div className="legend-item">
          <span className="legend-color stage-3"></span>
          <span>Stage 3</span>
        </div>
        <div className="legend-item">
          <span className="legend-color stage-4"></span>
          <span>Stage 4</span>
        </div>
        <div className="legend-item">
          <span className="legend-color stage-5"></span>
          <span>Stage 5</span>
        </div>
      </div>

      <div className="chart-area">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              domain={[0, 'dataMax + 100']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ fontWeight: 600, color: '#334155' }}
              itemStyle={{ padding: '2px 0' }}
            />
            <Line 
              type="monotone" 
              dataKey="Stage 1" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
              activeDot={{ r: 6, strokeWidth: 2, fill: 'white' }}
              name="Stage 1"
              connectNulls
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
            <Line 
              type="monotone" 
              dataKey="Stage 2" 
              stroke="#f97316" 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
              activeDot={{ r: 6, strokeWidth: 2, fill: 'white' }}
              name="Stage 2"
              connectNulls
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
            <Line 
              type="monotone" 
              dataKey="Stage 3" 
              stroke="#facc15" 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
              activeDot={{ r: 6, strokeWidth: 2, fill: 'white' }}
              name="Stage 3"
              connectNulls
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
            <Line 
              type="monotone" 
              dataKey="Stage 4" 
              stroke="#22c55e" 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
              activeDot={{ r: 6, strokeWidth: 2, fill: 'white' }}
              name="Stage 4"
              connectNulls
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
            <Line 
              type="monotone" 
              dataKey="Stage 5" 
              stroke="#0ea5e9" 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
              activeDot={{ r: 6, strokeWidth: 2, fill: 'white' }}
              name="Stage 5"
              connectNulls
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthChart; 