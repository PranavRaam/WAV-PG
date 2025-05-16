import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FiPhone, FiMail, FiLinkedin, FiMoreHorizontal, FiFilter, FiChevronDown, FiX, FiTrendingUp, FiDownload, FiCalendar } from 'react-icons/fi';
import { mockResponseData, mockTrendData, getDateRange, isDateInRange } from './ResponseData';
import './ResponseChart.css';

// Options for filters
const timeRangeOptions = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last Quarter', value: 'quarter' },
  { label: 'Year to Date', value: 'ytd' },
  { label: 'Custom Range', value: 'custom' }
];

const personaOptions = [
  { label: 'All Personas', value: 'all' },
  { label: 'CMO', value: 'CMO' },
  { label: 'CEO', value: 'CEO' },
  { label: 'Director', value: 'Director' },
  { label: 'Operations', value: 'Operations' },
  { label: 'CFO', value: 'CFO' }
];

const outcomeOptions = [
  { label: 'All Outcomes', value: 'all' },
  { label: 'Interested', value: 'Interested' },
  { label: 'Replied', value: 'Replied' },
  { label: 'No Reply', value: 'No Reply' }
];

const regionOptions = [
  { label: 'All Regions', value: 'all' },
  { label: 'Northeast', value: 'NE' },
  { label: 'Southeast', value: 'SE' },
  { label: 'Midwest', value: 'MW' },
  { label: 'Southwest', value: 'SW' },
  { label: 'West', value: 'W' }
];

// Define different target response times for each channel
const targetResponseTimes = {
  phone: 1.5, // 1.5 hours for phone calls
  email: 4,   // 4 hours for emails
  linkedin: 3, // 3 hours for LinkedIn messages
  other: 6     // 6 hours for other channels
};

const ResponseChart = () => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipContent, setTooltipContent] = useState(null);
  const chartRef = useRef(null);
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedPersona, setSelectedPersona] = useState('all');
  const [selectedOutcome, setSelectedOutcome] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [showTrends, setShowTrends] = useState(false);
  const [originalData] = useState(mockResponseData); // Keep original data for filtering
  const [filteredData, setFilteredData] = useState(mockResponseData);
  const [dateRange, setDateRange] = useState(getDateRange('7d'));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('2025-05-01');
  const [customEndDate, setCustomEndDate] = useState('2025-05-03');

  // Apply filters to data
  useEffect(() => {
    // Get date range based on selected time range
    let range = timeRange === 'custom' 
      ? { start: new Date(customStartDate), end: new Date(customEndDate) }
      : getDateRange(timeRange);
    
    setDateRange(range);
    
    // Filter data based on all criteria
    const filteredResults = {
      phone: filterChannelData(originalData.phone),
      email: filterChannelData(originalData.email),
      linkedin: filterChannelData(originalData.linkedin),
      other: filterChannelData(originalData.other)
    };
    
    setFilteredData(filteredResults);
    
  }, [timeRange, selectedPersona, selectedOutcome, selectedRegion, customStartDate, customEndDate, originalData]);

  // Helper function to filter data for a specific channel
  const filterChannelData = (channelData) => {
    return channelData.filter(item => {
      // Filter by date range
      const isInTimeRange = isDateInRange(item.date, dateRange);
      
      // Filter by persona
      const matchesPersona = selectedPersona === 'all' || item.persona === selectedPersona;
      
      // Filter by outcome
      const matchesOutcome = selectedOutcome === 'all' || item.outcome === selectedOutcome;
      
      // Filter by region
      const matchesRegion = selectedRegion === 'all' || item.region === selectedRegion;
      
      return isInTimeRange && matchesPersona && matchesOutcome && matchesRegion;
    });
  };

  // Calculate averages for each channel based on filtered data
  const averages = useMemo(() => ({
    phone: filteredData.phone.reduce((sum, item) => sum + item.responseTime, 0) / (filteredData.phone.length || 1),
    email: filteredData.email.reduce((sum, item) => sum + item.responseTime, 0) / (filteredData.email.length || 1),
    linkedin: filteredData.linkedin.reduce((sum, item) => sum + item.responseTime, 0) / (filteredData.linkedin.length || 1),
    other: filteredData.other.reduce((sum, item) => sum + item.responseTime, 0) / (filteredData.other.length || 1)
  }), [filteredData]);

  // Helper function to get date position percentage (for X-axis)
  const getDatePositionPercentage = (dateString, index) => {
    const start = dateRange.start;
    const end = dateRange.end;
    const dateParts = dateString.split('-');
    const date = new Date(parseInt(dateParts[2]), parseInt(dateParts[0]) - 1, parseInt(dateParts[1]));
    
    // Ensure the date is within the range
    const adjustedDate = new Date(Math.max(start.getTime(), Math.min(end.getTime(), date.getTime())));
    
    const totalTime = end.getTime() - start.getTime();
    const timeFromStart = adjustedDate.getTime() - start.getTime();
    
    // Calculate base position
    const basePosition = Math.min(Math.max((timeFromStart / totalTime) * 100, 0.5), 99.5);
    
    // Add a smaller random offset to prevent dots from perfectly aligning and overlapping
    // Use the index to create a deterministic but varied offset
    const randomOffset = ((index % 5) - 2) * 0.4;
    
    return Math.min(Math.max(basePosition + randomOffset, 0.5), 99.5);
  };

  // Helper function to get response time position percentage (for Y-axis)
  const getResponseTimePosition = (hours, index) => {
    // Use a logarithmic scale to better distribute data points vertically
    // Map 0-12 hours to 100%-0% (inverted, since lower time is better)
    const maxHours = 12;
    const logScale = Math.log(hours + 0.5) / Math.log(maxHours + 0.5);
    
    // Calculate base position
    const basePosition = 100 - (logScale * 100);
    
    // Add a smaller random offset to prevent dots from perfectly aligning horizontally
    // Use the index to create a deterministic but varied offset
    const randomOffset = ((index % 3) - 1) * 0.6;
    
    return Math.min(Math.max(basePosition + randomOffset, 1), 99);
  };

  // Helper function to format response time
  const formatResponseTime = (hours) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  // Helper function to determine dot color based on response time and channel-specific target
  const getDotColor = (responseTime, channel) => {
    const target = targetResponseTimes[channel] || 2; // Default to 2 hours if channel not found
    
    if (responseTime <= target) {
      return 'var(--color-success)';
    } else if (responseTime <= target * 1.5) {
      return 'var(--color-warning)';
    } else {
      return 'var(--color-danger)';
    }
  };

  // Handle channel selection
  const handleChannelClick = (channel) => {
    setSelectedChannel(selectedChannel === channel ? null : channel);
  };

  // Generate trend line path for a channel
  const getTrendLinePath = (channel) => {
    const data = mockTrendData[channel];
    if (!data || data.length === 0) return '';
    
    const width = 100;
    const height = 100;
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = getResponseTimePosition(value, index);
      return `${x},${y}`;
    });
    
    return `M${points.join(' L')}`;
  };

  // Calculate performance improvements based on trend data
  const getImprovementRate = (channel) => {
    const data = mockTrendData[channel];
    if (!data || data.length < 2) return 0;
    
    const latest = data[data.length - 1];
    const previous = data[0];
    const improvement = ((previous - latest) / previous) * 100;
    
    return Math.round(improvement);
  };

  // Handle custom date range
  const handleCustomDateChange = () => {
    if (new Date(customStartDate) <= new Date(customEndDate)) {
      setTimeRange('custom');
      setShowDatePicker(false);
    }
  };
  
  // Function to reset all filters
  const resetFilters = () => {
    setTimeRange('7d');
    setSelectedPersona('all');
    setSelectedOutcome('all');
    setSelectedRegion('all');
    setCustomStartDate('2025-05-01');
    setCustomEndDate('2025-05-03');
  };

  // Function to export data as CSV
  const exportCSV = () => {
    const allData = [
      ...filteredData.phone.map(item => ({...item, channel: 'Phone'})),
      ...filteredData.email.map(item => ({...item, channel: 'Email'})),
      ...filteredData.linkedin.map(item => ({...item, channel: 'LinkedIn'})),
      ...filteredData.other.map(item => ({...item, channel: 'Other'}))
    ];
    
    const headers = ['Channel', 'Date', 'Response Time (hrs)', 'Organization', 'Persona', 'Outcome', 'Region'];
    const csvData = [
      headers.join(','),
      ...allData.map(item => {
        return [
          item.channel,
          item.date,
          item.responseTime,
          item.pgName,
          item.persona,
          item.outcome,
          item.region
        ].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response-times-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Helper function to handle tooltip visibility
  const handleDotMouseEnter = (e, channel, index) => {
    const item = filteredData[channel][index];
    
    // Get position relative to the chart container
    const chartRect = chartRef.current.getBoundingClientRect();
    const dotRect = e.currentTarget.getBoundingClientRect();
    
    // Calculate center position of the dot
    const dotCenterX = dotRect.left + (dotRect.width / 2) - chartRect.left;
    const dotTopY = dotRect.top - chartRect.top;
    
    setTooltipPosition({ x: dotCenterX, y: dotTopY });
    setTooltipContent({
      pgName: item.pgName,
      persona: item.persona,
      responseTime: formatResponseTime(item.responseTime),
      outcome: item.outcome,
      region: item.region
    });
    setActiveTooltip({ channel, index });
  };

  const handleDotMouseLeave = () => {
    // Using a timeout to prevent tooltip from disappearing too quickly
    setTimeout(() => {
      setActiveTooltip(null);
      setTooltipContent(null);
    }, 100);
  };
  
  // Calculate date markers for X-axis based on current date range
  const getDateMarkers = () => {
    const startDate = dateRange.start;
    const endDate = dateRange.end;
    const daysDiff = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    // For different time ranges, we want different numbers of markers
    let markers = [];
    
    // Always include start marker
    markers.push({
      position: 0,
      date: new Date(startDate)
    });
    
    // Add evenly distributed markers
    const numMarkers = daysDiff <= 3 ? 5 : daysDiff <= 14 ? 6 : 7;
    
    for (let i = 1; i < numMarkers - 1; i++) {
      const position = (i / (numMarkers - 1)) * 100;
      const timestamp = startDate.getTime() + ((endDate.getTime() - startDate.getTime()) * (i / (numMarkers - 1)));
      markers.push({
        position: position,
        date: new Date(timestamp)
      });
    }
    
    // Always include end marker
    markers.push({
      position: 100,
      date: new Date(endDate)
    });
    
    return markers;
  };
  
  // Format date for display
  const formatDate = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // For very short ranges, also show hours
    const daysDiff = Math.round((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 3) {
      const hours = date.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${month}/${day} ${displayHours}${ampm}`;
    }
    
    return `${month}/${day}`;
  };

  return (
    <div className="response-chart-container">
      <div className="chart-header">
        <h3>Response Velocity by Channel</h3>
        <div className="chart-actions">
          {selectedChannel && (
            <div className="channel-filter-indicator">
              Filtering by: <span>{selectedChannel}</span>
              <button onClick={() => setSelectedChannel(null)}>Clear</button>
            </div>
          )}
          <button 
            className={`filter-toggle-button ${showFilters ? 'active' : ''}`} 
            onClick={() => setShowFilters(!showFilters)}
            title="Show/Hide Filters"
          >
            <FiFilter /> Filters
          </button>
          <button 
            className={`trend-toggle-button ${showTrends ? 'active' : ''}`} 
            onClick={() => setShowTrends(!showTrends)}
            title="Show/Hide Trend Lines"
          >
            <FiTrendingUp /> Trends
          </button>
          <button 
            className="export-button"
            onClick={exportCSV}
            title="Export as CSV"
          >
            <FiDownload /> Export
          </button>
        </div>
      </div>
      
      {/* Add legend below header */}
      <div className="header-legend">
        <div className="legend-item">
          <span className="legend-line red-target-line"></span>
          <span>Target Response Time</span>
        </div>
        <div className="legend-item">
          <span className="legend-line gray-average-line"></span>
          <span>Average Response Time</span>
        </div>
      </div>
      
      {showFilters && (
        <div className="filter-controls">
          <div className="filter-row">
            <div className="filter-group">
              <label>Time Range</label>
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                {timeRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {timeRange === 'custom' && (
                <button 
                  className="date-picker-toggle"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <FiCalendar /> {new Date(customStartDate).toLocaleDateString()} - {new Date(customEndDate).toLocaleDateString()}
                </button>
              )}
              
              {showDatePicker && (
                <div className="date-picker-container">
                  <div className="date-picker">
                    <div className="date-input">
                      <label>Start Date:</label>
                      <input 
                        type="date" 
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        max={customEndDate}
                      />
                    </div>
                    <div className="date-input">
                      <label>End Date:</label>
                      <input 
                        type="date" 
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        min={customStartDate}
                      />
                    </div>
                    <button className="apply-dates" onClick={handleCustomDateChange}>
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="filter-group">
              <label>Persona</label>
              <select value={selectedPersona} onChange={(e) => setSelectedPersona(e.target.value)}>
                {personaOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Outcome</label>
              <select value={selectedOutcome} onChange={(e) => setSelectedOutcome(e.target.value)}>
                {outcomeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Region</label>
              <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
                {regionOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <button className="filter-clear" onClick={resetFilters}>
              <FiX /> Clear All
            </button>
          </div>
          
          <div className="data-summary">
            <div className="summary-item">
              <span className="label">Phone:</span> 
              <span className="value">{filteredData.phone.length} responses</span>
            </div>
            <div className="summary-item">
              <span className="label">Email:</span> 
              <span className="value">{filteredData.email.length} responses</span>
            </div>
            <div className="summary-item">
              <span className="label">LinkedIn:</span> 
              <span className="value">{filteredData.linkedin.length} responses</span>
            </div>
            <div className="summary-item">
              <span className="label">Other:</span> 
              <span className="value">{filteredData.other.length} responses</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="response-chart" ref={chartRef}>
        {/* Grid background */}
        <div className="chart-grid">
          {/* Horizontal grid lines */}
          <div className="horizontal-grid-line" style={{ bottom: `${getResponseTimePosition(12, 0)}%` }}></div>
          <div className="horizontal-grid-line" style={{ bottom: `${getResponseTimePosition(6, 0)}%` }}></div>
          <div className="horizontal-grid-line" style={{ bottom: `${getResponseTimePosition(4, 0)}%` }}></div>
          <div className="horizontal-grid-line" style={{ bottom: `${getResponseTimePosition(2, 0)}%` }}></div>
          <div className="horizontal-grid-line" style={{ bottom: `${getResponseTimePosition(1, 0)}%` }}></div>
          <div className="horizontal-grid-line" style={{ bottom: `${getResponseTimePosition(0.5, 0)}%` }}></div>
          
          {/* Vertical grid lines (date markers) */}
          {getDateMarkers().map((marker, index) => (
            <div 
              key={`vgrid-${index}`} 
              className="vertical-grid-line" 
              style={{ left: `${marker.position}%` }}
            ></div>
          ))}
        </div>
        
        {/* Y-axis labels */}
        <div className="y-axis">
          <div className="axis-label">Response back time</div>
          <div className="time-markers">
            <span style={{ bottom: `${getResponseTimePosition(12, 0)}%` }}>12 hours</span>
            <span style={{ bottom: `${getResponseTimePosition(6, 0)}%` }}>6 hours</span>
            <span style={{ bottom: `${getResponseTimePosition(4, 0)}%` }}>4 hours</span>
            <span style={{ bottom: `${getResponseTimePosition(2, 0)}%` }}>2 hours</span>
            <span style={{ bottom: `${getResponseTimePosition(1, 0)}%` }}>1 hour</span>
            <span style={{ bottom: `${getResponseTimePosition(0.5, 0)}%` }}>30 min</span>
          </div>
        </div>
        
        {/* Channel columns */}
        <div className="channels-container">
          {/* Check if all channels have no data */}
          {filteredData.phone.length === 0 && 
           filteredData.email.length === 0 && 
           filteredData.linkedin.length === 0 && 
           filteredData.other.length === 0 ? (
            <div className="no-data-message">
              <div>No data matches the selected filters</div>
              <button onClick={resetFilters}>Reset Filters</button>
            </div>
          ) : (
            <>
              {/* Phone channel */}
              <div 
                className={`channel-column ${selectedChannel === 'phone' ? 'selected' : ''}`}
                onClick={() => handleChannelClick('phone')}
              >
                <div className="channel-icon phone-icon">
                  <FiPhone />
                </div>
                <div className="channel-label">Phone</div>
                <div className="channel-count">{filteredData.phone.length}</div>
                <div className="dots-container">
                  {filteredData.phone.map((item, index) => (
                    <div 
                      key={`phone-${index}`}
                      className="data-dot"
                      style={{
                        bottom: `${getResponseTimePosition(item.responseTime, index)}%`,
                        left: `${getDatePositionPercentage(item.date, index)}%`,
                        backgroundColor: getDotColor(item.responseTime, 'phone')
                      }}
                      onMouseEnter={(e) => handleDotMouseEnter(e, 'phone', index)}
                      onMouseLeave={handleDotMouseLeave}
                    />
                  ))}
                </div>
                
                {/* Channel-specific target line */}
                <div className="target-line channel-target" style={{ bottom: `${getResponseTimePosition(targetResponseTimes.phone, 0)}%`, backgroundColor: 'var(--color-danger)' }}>
                  <span className="target-label">Target ({targetResponseTimes.phone}h)</span>
                </div>
                
                <div className="average-line" style={{ bottom: `${getResponseTimePosition(averages.phone, 0)}%` }}>
                  <span className="average-label">{formatResponseTime(averages.phone)}</span>
                </div>
              </div>
              
              {/* Email channel */}
              <div 
                className={`channel-column ${selectedChannel === 'email' ? 'selected' : ''}`}
                onClick={() => handleChannelClick('email')}
              >
                <div className="channel-icon email-icon">
                  <FiMail />
                </div>
                <div className="channel-label">Email</div>
                <div className="channel-count">{filteredData.email.length}</div>
                <div className="dots-container">
                  {filteredData.email.map((item, index) => (
                    <div 
                      key={`email-${index}`}
                      className="data-dot"
                      style={{
                        bottom: `${getResponseTimePosition(item.responseTime, index)}%`,
                        left: `${getDatePositionPercentage(item.date, index)}%`,
                        backgroundColor: getDotColor(item.responseTime, 'email')
                      }}
                      onMouseEnter={(e) => handleDotMouseEnter(e, 'email', index)}
                      onMouseLeave={handleDotMouseLeave}
                    />
                  ))}
                </div>
                
                {/* Channel-specific target line */}
                <div className="target-line channel-target" style={{ bottom: `${getResponseTimePosition(targetResponseTimes.email, 0)}%`, backgroundColor: 'var(--color-danger)' }}>
                  <span className="target-label">Target ({targetResponseTimes.email}h)</span>
                </div>
                
                <div className="average-line" style={{ bottom: `${getResponseTimePosition(averages.email, 0)}%` }}>
                  <span className="average-label">{formatResponseTime(averages.email)}</span>
                </div>
              </div>
              
              {/* LinkedIn channel */}
              <div 
                className={`channel-column ${selectedChannel === 'linkedin' ? 'selected' : ''}`}
                onClick={() => handleChannelClick('linkedin')}
              >
                <div className="channel-icon linkedin-icon">
                  <FiLinkedin />
                </div>
                <div className="channel-label">LinkedIn</div>
                <div className="channel-count">{filteredData.linkedin.length}</div>
                <div className="dots-container">
                  {filteredData.linkedin.map((item, index) => (
                    <div 
                      key={`linkedin-${index}`}
                      className="data-dot"
                      style={{
                        bottom: `${getResponseTimePosition(item.responseTime, index)}%`,
                        left: `${getDatePositionPercentage(item.date, index)}%`,
                        backgroundColor: getDotColor(item.responseTime, 'linkedin')
                      }}
                      onMouseEnter={(e) => handleDotMouseEnter(e, 'linkedin', index)}
                      onMouseLeave={handleDotMouseLeave}
                    />
                  ))}
                </div>
                
                {/* Channel-specific target line */}
                <div className="target-line channel-target" style={{ bottom: `${getResponseTimePosition(targetResponseTimes.linkedin, 0)}%`, backgroundColor: 'var(--color-danger)' }}>
                  <span className="target-label">Target ({targetResponseTimes.linkedin}h)</span>
                </div>
                
                <div className="average-line" style={{ bottom: `${getResponseTimePosition(averages.linkedin, 0)}%` }}>
                  <span className="average-label">{formatResponseTime(averages.linkedin)}</span>
                </div>
              </div>
              
              {/* Other channels */}
              <div 
                className={`channel-column ${selectedChannel === 'other' ? 'selected' : ''}`}
                onClick={() => handleChannelClick('other')}
              >
                <div className="channel-icon other-icon">
                  <FiMoreHorizontal />
                </div>
                <div className="channel-label">Others</div>
                <div className="channel-count">{filteredData.other.length}</div>
                <div className="dots-container">
                  {filteredData.other.map((item, index) => (
                    <div 
                      key={`other-${index}`}
                      className="data-dot"
                      style={{
                        bottom: `${getResponseTimePosition(item.responseTime, index)}%`,
                        left: `${getDatePositionPercentage(item.date, index)}%`,
                        backgroundColor: getDotColor(item.responseTime, 'other')
                      }}
                      onMouseEnter={(e) => handleDotMouseEnter(e, 'other', index)}
                      onMouseLeave={handleDotMouseLeave}
                    />
                  ))}
                </div>
                
                {/* Channel-specific target line */}
                <div className="target-line channel-target" style={{ bottom: `${getResponseTimePosition(targetResponseTimes.other, 0)}%`, backgroundColor: 'var(--color-danger)' }}>
                  <span className="target-label">Target ({targetResponseTimes.other}h)</span>
                </div>
                
                <div className="average-line" style={{ bottom: `${getResponseTimePosition(averages.other, 0)}%` }}>
                  <span className="average-label">{formatResponseTime(averages.other)}</span>
                </div>
              </div>
            </>
          )}
          
          {/* Floating tooltip */}
          {tooltipContent && (
            <div 
              className="global-tooltip" 
              style={{ 
                left: `${tooltipPosition.x}px`, 
                top: `${tooltipPosition.y - 10}px`
              }}
            >
              <div><strong>{tooltipContent.pgName}</strong></div>
              <div><span className="tooltip-label">Response:</span> {tooltipContent.responseTime}</div>
              <div><span className="tooltip-label">Persona:</span> {tooltipContent.persona}</div>
              <div><span className="tooltip-label">Status:</span> {tooltipContent.outcome}</div>
            </div>
          )}
        </div>
        
        {/* X-axis */}
        <div className="x-axis">
          <div className="date-markers">
            {getDateMarkers().map((marker, index) => (
              <span key={`marker-${index}`} style={{ left: `${marker.position}%` }}>
                {formatDate(marker.date)}
              </span>
            ))}
          </div>
          <div className="axis-label">Time</div>
        </div>
      </div>
      
      <div className="chart-insights">
        <div className="insight-card">
          <div className="insight-title">Average Response Time</div>
          <div className="insight-values">
            <div className="insight-value-item">
              <div className="value-icon phone-icon"><FiPhone /></div>
              <div className="value-content">
                <div className="value-label">Phone</div>
                <div className="value-number">{formatResponseTime(averages.phone)}</div>
              </div>
            </div>
            <div className="insight-value-item">
              <div className="value-icon email-icon"><FiMail /></div>
              <div className="value-content">
                <div className="value-label">Email</div>
                <div className="value-number">{formatResponseTime(averages.email)}</div>
              </div>
            </div>
            <div className="insight-value-item">
              <div className="value-icon linkedin-icon"><FiLinkedin /></div>
              <div className="value-content">
                <div className="value-label">LinkedIn</div>
                <div className="value-number">{formatResponseTime(averages.linkedin)}</div>
              </div>
            </div>
            <div className="insight-value-item">
              <div className="value-icon other-icon"><FiMoreHorizontal /></div>
              <div className="value-content">
                <div className="value-label">Others</div>
                <div className="value-number">{formatResponseTime(averages.other)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="legend">
        <div className="legend-item">
          <span className="legend-dot fast"></span>
          <span>Fast Response</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot medium"></span>
          <span>Medium Response</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot slow"></span>
          <span>Slow Response</span>
        </div>
        <div className="legend-item">
          <span className="legend-line red-target-line"></span>
          <span>Target Response Time</span>
        </div>
        <div className="legend-item">
          <span className="legend-line gray-average-line"></span>
          <span>Average Response Time</span>
        </div>
      </div>
    </div>
  );
};

export default ResponseChart; 