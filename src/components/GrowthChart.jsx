import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './GrowthChart.css';

const GrowthChart = ({ data }) => {
  const [selectedStage, setSelectedStage] = useState('all');
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
    const generateStageData = (item, stageNum) => {
      return {
        ...item,
        name: item.month,  // Use month as the data point name
        stage: `Stage ${stageNum}`,
        value: Math.max(5, item.growth * (6 - stageNum) / stageNum)  // Mock formula to generate varied values
      };
    };

    // Create array of month-based data points
    const months = [];
    const monthSet = new Set();
    
    // First, collect all unique months
    data.forEach(item => {
      if (item.month) {
        monthSet.add(item.month);
      }
    });
    
    // Generate data for each stage for each month
    Array.from(monthSet).forEach(month => {
      // Find a sample item for this month
      const sampleItem = data.find(item => item.month === month);
      
      if (sampleItem) {
        for (let stage = 1; stage <= 5; stage++) {
          months.push(generateStageData(sampleItem, stage));
        }
      }
    });

    // Generate mock weeks data based on months
    const weeks = [];
    const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
    
    Array.from(monthSet).forEach(month => {
      const sampleItem = data.find(item => item.month === month);
      
      if (sampleItem) {
        weekLabels.forEach((weekLabel, index) => {
          const weekItem = {
            ...sampleItem,
            month: `${month} ${weekLabel}`, // Combine month and week
            name: `${month} ${weekLabel}`
          };
          
          for (let stage = 1; stage <= 5; stage++) {
            const variance = Math.random() * 10 - 5; // Random variance between -5 and 5
            weeks.push({
              ...generateStageData(weekItem, stage),
              value: Math.max(5, generateStageData(weekItem, stage).value + variance)
            });
          }
        });
      }
    });

    // Generate mock quarters data based on months
    const quarters = [];
    const quarterMap = {
      'Jan': 'Q1', 'Feb': 'Q1', 'Mar': 'Q1',
      'Apr': 'Q2', 'May': 'Q2', 'Jun': 'Q2',
      'Jul': 'Q3', 'Aug': 'Q3', 'Sep': 'Q3',
      'Oct': 'Q4', 'Nov': 'Q4', 'Dec': 'Q4'
    };
    
    const quarterSet = new Set();
    data.forEach(item => {
      if (item.month && quarterMap[item.month]) {
        quarterSet.add(quarterMap[item.month]);
      }
    });
    
    Array.from(quarterSet).forEach(quarter => {
      // Use an average of the months in the quarter
      const monthsInQuarter = data.filter(item => quarterMap[item.month] === quarter);
      
      if (monthsInQuarter.length > 0) {
        const avgGrowth = monthsInQuarter.reduce((sum, item) => sum + item.growth, 0) / monthsInQuarter.length;
        const quarterItem = {
          ...monthsInQuarter[0],
          month: quarter,
          name: quarter,
          growth: avgGrowth
        };
        
        for (let stage = 1; stage <= 5; stage++) {
          quarters.push(generateStageData(quarterItem, stage));
        }
      }
    });

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
      
      // Group data by name (month/week/quarter)
      processedData[timeUnit].forEach(item => {
        if (!groupedData[item.name]) {
          groupedData[item.name] = {
            name: item.name
          };
        }
        
        // Add value to the corresponding stage
        groupedData[item.name][item.stage] = item.value;
      });
      
      // Convert object to array and sort by time sequence
      const sortOrder = {
        // Month order
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12,
        // Quarter order
        'Q1': 1, 'Q2': 2, 'Q3': 3, 'Q4': 4
      };
      
      const sortData = (a, b) => {
        const nameA = a.name.split(' ')[0]; // Extract month from "Month Week X"
        const nameB = b.name.split(' ')[0];
        
        if (sortOrder[nameA] && sortOrder[nameB]) {
          return sortOrder[nameA] - sortOrder[nameB];
        }
        
        return a.name.localeCompare(b.name);
      };
      
      setChartData(Object.values(groupedData).sort(sortData));
    };
    
    transformData();
  }, [timeUnit, processedData]);

  // Filter data based on selected stage and time range
  const getFilteredData = () => {
    if (!processedData || !processedData[timeUnit]) {
      return [];
    }
    
    if (selectedStage === 'all') {
      return chartData;
    }
    
    // For single stage selection, prepare data showing only that stage
    const timePoints = [...new Set(processedData[timeUnit].map(item => item.name))];
    
    return timePoints.map(timePoint => {
      const pointData = { name: timePoint };
      const stageData = processedData[timeUnit].find(
        item => item.name === timePoint && item.stage === selectedStage
      );
      
      if (stageData) {
        pointData[selectedStage] = stageData.value;
      }
      
      return pointData;
    }).sort((a, b) => {
      const nameA = a.name.split(' ')[0]; // Extract month from "Month Week X"
      const nameB = b.name.split(' ')[0];
      const sortOrder = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12,
        'Q1': 1, 'Q2': 2, 'Q3': 3, 'Q4': 4
      };
      
      if (sortOrder[nameA] && sortOrder[nameB]) {
        return sortOrder[nameA] - sortOrder[nameB];
      }
      
      return a.name.localeCompare(b.name);
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
            data={filteredData}
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