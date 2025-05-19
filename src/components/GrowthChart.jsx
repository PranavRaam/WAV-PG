import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Label } from 'recharts';
import './GrowthChart.css';

// Custom tooltip component to show more detailed information
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Find the data point to get the formatted date
    const dataPoint = payload[0]?.payload;
    const formattedDate = dataPoint?.displayDate || label;
    
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{formattedDate}</p>
        {payload.map((entry, index) => (
          <div key={index} className="tooltip-item">
            <div className="tooltip-color-box" style={{ backgroundColor: entry.stroke }}></div>
            <p className="tooltip-stage">{entry.name}: <strong>{entry.value}</strong> PGs</p>
          </div>
        ))}
        <p className="tooltip-hint">Values represent PG count at each KPI stage</p>
      </div>
    );
  }
  return null;
};

const GrowthChart = ({ data }) => {
  const [selectedStage, setSelectedStage] = useState('all');
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [timeUnit, setTimeUnit] = useState('months');
  const [chartData, setChartData] = useState([]);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 5 }); // Control visible data range
  
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

  // Function to parse and format dates
  const formatDate = (dateStr, format) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Return original if invalid
    
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (format === 'months') {
      return `${months[month]} ${year}`;
    } else if (format === 'weeks') {
      // Calculate the week number
      const weekNum = Math.ceil((day + (new Date(year, month, 1).getDay())) / 7);
      return `${months[month]} W${weekNum} ${year}`;
    } else if (format === 'quarters') {
      const quarter = Math.floor(month / 3) + 1;
      return `Q${quarter} ${year}`;
    }
    
    return dateStr;
  };

  // Process the flat array data into a structure with months/weeks/quarters
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return {
        months: [],
        weeks: [],
        quarters: []
      };
    }

    // Generate mock stage data based on the input growth data
    const generateStageData = (item, stageNum, dateStr) => {
      return {
        ...item,
        name: dateStr,  // Use ISO date as the data point name
        displayDate: formatDate(dateStr, 'months'), // Formatted display date
        stage: `Stage ${stageNum}`,
        value: Math.max(5, item.growth * (6 - stageNum) / stageNum)  // Mock formula to generate varied values
      };
    };

    // Generate more comprehensive mock data with proper dates
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    
    // Create month data for current and previous year with ISO date strings
    const months = [];
    for (let year = lastYear; year <= currentYear; year++) {
      for (let month = 0; month < 12; month++) {
        // Create a date for the first of the month
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-01`;
        
        // Mock growth value
        const mockGrowth = 50 + Math.floor(Math.random() * 50) + (month * 5); // Increasing trend
        
        const monthItem = {
          month: formatDate(dateStr, 'months'),
          growth: mockGrowth
        };
        
        // Generate data for each stage
        for (let stage = 1; stage <= 5; stage++) {
          months.push(generateStageData(monthItem, stage, dateStr));
        }
      }
    }
    
    // Generate weekly data for the last 3 months
    const weeks = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) { // 12 weeks back from today
      const weekDate = new Date(today);
      weekDate.setDate(today.getDate() - (i * 7));
      
      const dateStr = `${weekDate.getFullYear()}-${(weekDate.getMonth() + 1).toString().padStart(2, '0')}-${weekDate.getDate().toString().padStart(2, '0')}`;
      
      // Calculate week number in month
      const dayOfMonth = weekDate.getDate();
      const weekNum = Math.ceil(dayOfMonth / 7);
      
      const weekItem = {
        month: formatDate(dateStr, 'weeks'),
        growth: 70 + Math.floor(Math.random() * 40) - (i * 2) // Decreasing as we go back in time
      };
      
      for (let stage = 1; stage <= 5; stage++) {
        weeks.push(generateStageData(weekItem, stage, dateStr));
      }
    }
    
    // Generate quarterly data
    const quarters = [];
    for (let year = lastYear - 1; year <= currentYear; year++) {
      for (let quarter = 0; quarter < 4; quarter++) {
        const monthInQuarter = quarter * 3; // First month of the quarter (0, 3, 6, 9)
        const dateStr = `${year}-${(monthInQuarter + 1).toString().padStart(2, '0')}-01`;
        
        const quarterItem = {
          month: formatDate(dateStr, 'quarters'),
          growth: 40 + Math.floor(Math.random() * 60) + ((year - lastYear + 1) * 20) + (quarter * 5)
        };
        
        for (let stage = 1; stage <= 5; stage++) {
          quarters.push(generateStageData(quarterItem, stage, dateStr));
        }
      }
    }

    return {
      months,
      weeks,
      quarters
    };
  }, [data]);

  useEffect(() => {
    // Process data based on timeUnit and create separate data series for each stage
    const transformData = () => {
      if (!processedData || !processedData[timeUnit] || processedData[timeUnit].length === 0) {
        setChartData([]);
        return;
      }

      const groupedData = {};
      
      // Group data by name (ISO date string)
      processedData[timeUnit].forEach(item => {
        if (!groupedData[item.name]) {
          groupedData[item.name] = {
            name: item.name,
            displayDate: item.displayDate || formatDate(item.name, timeUnit)
          };
        }
        
        // Add value to the corresponding stage
        groupedData[item.name][item.stage] = item.value;
      });
      
      // Convert object to array and sort by date
      const sortedData = Object.values(groupedData).sort((a, b) => {
        return new Date(a.name) - new Date(b.name);
      });
      
      setChartData(sortedData);
      
      // Reset visible range when data changes
      const visiblePoints = timeUnit === 'weeks' ? 6 : 6;
      setVisibleRange({
        start: 0,
        end: Math.min(visiblePoints - 1, sortedData.length - 1)
      });
    };
    
    transformData();
  }, [timeUnit, processedData]);

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
    if (visibleRange.end < chartData.length - 1) {
      setVisibleRange({
        start: visibleRange.start + 1,
        end: visibleRange.end + 1
      });
    }
  };

  // Filter data based on selected stage and visible range
  const getFilteredData = () => {
    if (!chartData || chartData.length === 0) {
      return [];
    }
    
    // Get the currently visible data
    const visibleData = chartData.slice(visibleRange.start, visibleRange.end + 1);
    
    if (selectedStage === 'all') {
      return visibleData;
    }
    
    // For single stage selection, keep only that stage's data
    return visibleData.map(dataPoint => {
      const filteredPoint = { 
        name: dataPoint.name,
        displayDate: dataPoint.displayDate
      };
      filteredPoint[selectedStage] = dataPoint[selectedStage];
      return filteredPoint;
    });
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
          <button 
            className={`toggle-button ${timeUnit === 'quarters' ? 'active' : ''}`}
            onClick={() => setTimeUnit('quarters')}
          >
            Quarterly
          </button>
        </div>
      </div>
      
      <div className="chart-wrapper">
        <div className="scroll-controls">
          <button 
            className="scroll-btn left" 
            onClick={handleScrollLeft}
            disabled={visibleRange.start === 0}
          >
            &lt;
          </button>
          
          <ResponsiveContainer width="90%" height={400}>
            <LineChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={{ stroke: '#cbd5e1' }}
                padding={{ left: 10, right: 10 }}
                tickFormatter={(value) => {
                  const dataPoint = chartData.find(item => item.name === value);
                  return dataPoint?.displayDate || value;
                }}
              >
                <Label 
                  value="Time Period" 
                  position="bottom" 
                  offset={20} 
                  style={{ fontSize: 14, fill: '#334155' }} 
                />
              </XAxis>
              <YAxis 
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={{ stroke: '#cbd5e1' }}
                width={60}
              >
                <Label 
                  value="PG Count" 
                  position="left" 
                  angle={-90} 
                  offset={0} 
                  style={{ textAnchor: 'middle', fontSize: 14, fill: '#334155' }} 
                />
              </YAxis>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                align="center" 
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => <span className="legend-label">{value}</span>}
              />
              <Line 
                type="monotone" 
                dataKey="Stage 1" 
                stroke="#f43f5e" 
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
          
          <button 
            className="scroll-btn right" 
            onClick={handleScrollRight}
            disabled={visibleRange.end >= chartData.length - 1}
          >
            &gt;
          </button>
        </div>
        
        <div className="scroll-indicator">
          {chartData.length > 0 && (
            <span>
              Showing {visibleRange.start + 1}-{Math.min(visibleRange.end + 1, chartData.length)} of {chartData.length} periods
            </span>
          )}
        </div>
      </div>
      
      <div className="chart-info-box">
        <div className="info-header">About this chart</div>
        <p className="info-content">
          This graph shows the number of physician groups (PGs) at each KPI stage over time.
        </p>
      </div>
    </div>
  );
};

export default GrowthChart; 