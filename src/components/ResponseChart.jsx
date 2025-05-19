import React, { useState, useEffect, useMemo } from 'react';
import { MdPhone, MdEmail, MdMore, MdFilterList, MdKeyboardArrowDown, MdClose, MdRefresh, MdPieChart, MdBarChart } from 'react-icons/md';
import { FaLinkedin } from 'react-icons/fa';
import { mockResponseData, mockTrendData, getDateRange, isDateInRange } from './ResponseData';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis, ReferenceLine } from 'recharts';
import './ResponseChart.css';

// Create dedicated icon components with guaranteed visibility
const PhoneIcon = () => (
  <div className="custom-icon phone-icon">
    <MdPhone size={26} style={{color: '#ffffff', display: 'block'}} />
  </div>
);

const EmailIcon = () => (
  <div className="custom-icon email-icon">
    <MdEmail size={26} style={{color: '#ffffff', display: 'block'}} />
  </div>
);

const LinkedInIcon = () => (
  <div className="custom-icon linkedin-icon">
    <FaLinkedin size={26} style={{color: '#ffffff', display: 'block'}} />
  </div>
);

const OtherIcon = () => (
  <div className="custom-icon other-icon">
    <MdMore size={26} style={{color: '#ffffff', display: 'block'}} />
  </div>
);

// Options for filters
const timeRangeOptions = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last Quarter', value: 'quarter' },
  { label: 'Year to Date', value: 'ytd' },
  { label: 'Custom Range', value: 'custom' }
];

// Options for the Outcome filter (removed "Interested" as requested)
const outcomeOptions = [
  { label: 'All Outcomes', value: 'all' },
  { label: 'Replied', value: 'Replied' },
  { label: 'No Reply', value: 'No Reply' }
];

// New Time Frame filter options replacing the Region filter
const timeFrameOptions = [
  { label: 'All Time Frames', value: 'all' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' }
];

const regionOptions = [
  { label: 'All Regions', value: 'all' },
  { label: 'Northeast', value: 'NE' },
  { label: 'Southeast', value: 'SE' },
  { label: 'Midwest', value: 'MW' },
  { label: 'Southwest', value: 'SW' },
  { label: 'West', value: 'W' }
];

// Define different target response times for each channel (in minutes)
const targetResponseTimes = {
  phone: 10,    // 10 minutes for phone calls
  email: 30,    // 30 minutes for emails
  linkedin: 60, // 60 minutes for LinkedIn messages
  other: 120    // 120 minutes for other channels
};

const channelIcons = {
  phone: <PhoneIcon />,
  email: <EmailIcon />,
  linkedin: <LinkedInIcon />,
  other: <OtherIcon />
};

const channelLabels = {
  phone: 'Phone',
  email: 'Email',
  linkedin: 'LinkedIn',
  other: 'Others'
};

// Channel x-axis positions for scatter plot
const channelPositions = {
  phone: 1,
  email: 2,
  linkedin: 3,
  other: 4
};

// Colors for the pie charts
const COLORS = {
  good: 'var(--color-success)',
  average: 'var(--color-warning)',
  poor: 'var(--color-danger)'
};

// Helper: Get week number for a date (ISO week)
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const weekNum = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  return `${d.getUTCFullYear()}-W${weekNum}`;
}

const ResponseChart = ({ searchQuery = '' }) => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedOutcome, setSelectedOutcome] = useState('all');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('all');
  const [originalData] = useState(mockResponseData); // Keep original data for filtering
  const [filteredData, setFilteredData] = useState(mockResponseData);
  const [dateRange, setDateRange] = useState(getDateRange('7d'));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('2025-05-01');
  const [customEndDate, setCustomEndDate] = useState('2025-05-03');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [viewMode, setViewMode] = useState('pie'); // 'pie' or 'scatter'
  
  // State for controlling dropdown visibility
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
  const [showOutcomeDropdown, setShowOutcomeDropdown] = useState(false);
  const [showTimeFrameDropdown, setShowTimeFrameDropdown] = useState(false);

  // Function to close all dropdowns
  const closeAllDropdowns = () => {
    setShowTimeRangeDropdown(false);
    setShowOutcomeDropdown(false);
    setShowTimeFrameDropdown(false);
    setShowDatePicker(false);
  };

  // Toggle dropdown visibility
  const toggleDropdown = (dropdownName) => {
    closeAllDropdowns(); // Close all other dropdowns first
    
    // Open the clicked dropdown
    switch (dropdownName) {
      case 'timeRange':
        setShowTimeRangeDropdown(!showTimeRangeDropdown);
        break;
      case 'outcome':
        setShowOutcomeDropdown(!showOutcomeDropdown);
        break;
      case 'timeFrame':
        setShowTimeFrameDropdown(!showTimeFrameDropdown);
        break;
      default:
        break;
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideClick = !event.target.closest('.filter-dropdown');
      if (isOutsideClick) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Apply filters to data
  useEffect(() => {
    // Show loading state briefly to provide visual feedback
    setIsLoading(true);
    
    // Get date range based on selected time range
    let range = timeRange === 'custom' 
      ? { start: new Date(customStartDate), end: new Date(customEndDate) }
      : getDateRange(timeRange);
    
    setDateRange(range);
    
    // Calculate number of active filters for visual feedback
    let count = 0;
    if (timeRange !== '7d') count++;
    if (selectedOutcome !== 'all') count++;
    if (selectedTimeFrame !== 'all') count++;
    if (searchQuery.trim() !== '') count++;
    setActiveFilters(count);

    // Small delay to show loading state (provides better UX feedback that filters are applied)
    const timerId = setTimeout(() => {
    // Filter data based on all criteria
    const filteredResults = {
      phone: filterChannelData(originalData.phone),
      email: filterChannelData(originalData.email),
      linkedin: filterChannelData(originalData.linkedin),
      other: filterChannelData(originalData.other)
    };
    
    setFilteredData(filteredResults);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timerId);
    
  }, [timeRange, selectedOutcome, selectedTimeFrame, customStartDate, customEndDate, originalData, searchQuery]);

  // Helper function to filter data for a specific channel
  const filterChannelData = (channelData) => {
    return channelData.filter(item => {
      // Filter by date range
      const isInTimeRange = isDateInRange(item.date, dateRange);
      
      // Filter by outcome
      const matchesOutcome = selectedOutcome === 'all' || item.outcome === selectedOutcome;
      
      // Determine timeFrame based on date (mock implementation)
      let itemTimeFrame = 'weekly';
      const itemDate = new Date(item.date);
      const currentDate = new Date();
      const daysDiff = Math.floor((currentDate - itemDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 7) {
        itemTimeFrame = 'weekly';
      } else if (daysDiff <= 30) {
        itemTimeFrame = 'monthly';
      } else {
        itemTimeFrame = 'quarterly';
      }
      
      // Filter by time frame
      const matchesTimeFrame = selectedTimeFrame === 'all' || itemTimeFrame === selectedTimeFrame;
      
      // Filter by search query (division, statistical area, region, or PG name)
      const matchesSearch = !searchQuery.trim() || 
        (item.division && item.division.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.statisticalArea && item.statisticalArea.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.region && item.region.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.pgName && item.pgName.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return isInTimeRange && matchesOutcome && matchesTimeFrame && matchesSearch;
    });
  };

  // Helper function to format response time in minutes
  const formatResponseTimeMinutes = (minutes) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  // Original helper function for hours (used for pie chart statistics)
  const formatResponseTime = (hours) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  // Calculate response time categories for pie charts
  const pieChartData = useMemo(() => {
    const calculateCategoryData = (channelData, targetTime) => {
      if (!channelData.length) return [
        { name: 'Good', value: 0, color: COLORS.good },
        { name: 'Average', value: 0, color: COLORS.average },
        { name: 'Poor', value: 0, color: COLORS.poor }
      ];
      
      let good = 0;
      let average = 0;
      let poor = 0;
      
      channelData.forEach(item => {
        // Convert hours to minutes for consistent comparison with targetTime (which is in minutes)
        const responseTimeMinutes = item.responseTime * 60;
        
        if (responseTimeMinutes <= targetTime) {
          good++;
        } else if (responseTimeMinutes <= targetTime * 1.5) {
          average++;
        } else {
          poor++;
        }
      });
      
      return [
        { name: 'Good', value: good, color: COLORS.good },
        { name: 'Average', value: average, color: COLORS.average },
        { name: 'Poor', value: poor, color: COLORS.poor }
      ];
    };
    
    return {
      phone: calculateCategoryData(filteredData.phone, targetResponseTimes.phone),
      email: calculateCategoryData(filteredData.email, targetResponseTimes.email),
      linkedin: calculateCategoryData(filteredData.linkedin, targetResponseTimes.linkedin),
      other: calculateCategoryData(filteredData.other, targetResponseTimes.other)
    };
  }, [filteredData]);

  // Calculate date range for x-axis domain and group into weeks
  const xAxisDomain = useMemo(() => {
    if (!filteredData || Object.values(filteredData).every(data => !data || !data.length)) {
      // Default range if no data
      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return [sevenDaysAgo.getTime(), now.getTime()];
    }
    
    // Take date range directly from dateRange when possible
    if (dateRange && dateRange.start && dateRange.end) {
      return [dateRange.start.getTime(), dateRange.end.getTime()];
    }
    
    // Get all dates from the filtered data
    const dates = [];
    Object.values(filteredData).forEach(channel => {
      if (channel && channel.length) {
        channel.forEach(item => {
          if (item.date) {
            dates.push(new Date(item.date).getTime());
          }
        });
      }
    });
    
    if (!dates.length) {
      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return [sevenDaysAgo.getTime(), now.getTime()];
    }
    
    let minDate = Math.min(...dates);
    let maxDate = Math.max(...dates);
    
    // Add padding to the range
    const padding = 24 * 60 * 60 * 1000; // 1 day padding
    minDate -= padding;
    maxDate += padding;
    
    return [minDate, maxDate];
  }, [filteredData, dateRange]);
  
  // Generate custom ticks for weeks
  const weeklyTicks = useMemo(() => {
    const startDate = new Date(xAxisDomain[0]);
    const endDate = new Date(xAxisDomain[1]);
    
    const ticks = [];
    let currentDate = new Date(startDate);
    
    // Generate a tick for each week
    while (currentDate <= endDate) {
      ticks.push(currentDate.getTime());
      // Move to next week
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    return ticks;
  }, [xAxisDomain]);
  
  // Format day of week and date
  const formatDayOfWeek = (timestamp) => {
    const date = new Date(timestamp);
    // Format as MM/DD/YY
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear().toString().slice(2)}`;
  };

  // Convert mock response data into scatter plot format
  const scatterData = useMemo(() => {
    const result = [];
    // Get the date range for the x-axis
    const startDate = dateRange.start;
    const endDate = dateRange.end;
    
    // Use fixed dates from the image for the x-axis
    const fixedDates = [
      "05/20/25",
      "05/27/25",
      "06/03/25",
      "06/10/25",
      "06/17/25",
      "06/24/25"
    ];
    
    // Calculate dates from the strings
    const datePoints = fixedDates.map(dateStr => {
      const [month, day, year] = dateStr.split('/');
      return new Date(`20${year}`, month - 1, day);
    });
    
    // Reduce the number of data points for each channel
    // This will make the visualization cleaner
    const maxPointsPerChannel = 8; // Limited number of points
    
    // Process each channel
    Object.keys(filteredData).forEach(channel => {
      let channelData = filteredData[channel];
      if (!channelData || !channelData.length) return;
      
      // Take a subset of the data to reduce density
      if (channelData.length > maxPointsPerChannel) {
        const step = Math.floor(channelData.length / maxPointsPerChannel);
        channelData = channelData.filter((_, index) => index % step === 0).slice(0, maxPointsPerChannel);
      }
      
      // For each item in the channel data
      channelData.forEach((item, index) => {
        // Position the data point on one of the fixed dates
        const dateIndex = index % datePoints.length;
        const timestamp = new Date(datePoints[dateIndex]);
        
        // Convert hours to minutes for the scatter plot
        const responseTimeMinutes = item.responseTime * 60;
        
        result.push({
          x: timestamp.getTime(),
          y: responseTimeMinutes,
          z: 40, // Increased dot size for better visibility
          date: timestamp,
          responseTime: item.responseTime * 60,
          responseTimeFormatted: formatResponseTime(item.responseTime),
          channel: channel,
          name: channelLabels[channel],
          pgName: item.pgName || 'Unknown',
          persona: item.persona || 'Unknown',
          outcome: item.outcome,
          region: item.region,
          division: item.division,
          statisticalArea: item.statisticalArea,
          target: targetResponseTimes[channel],
          performance: responseTimeMinutes <= targetResponseTimes[channel] 
            ? 'good' 
            : responseTimeMinutes <= targetResponseTimes[channel] * 1.5 
              ? 'average' 
              : 'poor'
        });
      });
    });
    
    return result;
  }, [filteredData, dateRange]);

  // Group scatter data by channel for separate series display
  const groupedScatterData = useMemo(() => {
    return {
      phone: scatterData.filter(item => item.channel === 'phone'),
      email: scatterData.filter(item => item.channel === 'email'),
      linkedin: scatterData.filter(item => item.channel === 'linkedin'),
      other: scatterData.filter(item => item.channel === 'other')
    };
  }, [scatterData]);
  
  // Calculate summary statistics
  const channelStats = useMemo(() => {
    const calcStats = (data, targetTime) => {
      if (!data.length) return { avg: 0, median: 0, count: 0, performance: 'no-data' };
      
      // Sort the response times
      const sortedTimes = [...data].sort((a, b) => a.responseTime - b.responseTime);
      const count = sortedTimes.length;
      
      // Extract just the response times
      const times = sortedTimes.map(item => item.responseTime);
      
      // Calculate average and median
      const avg = times.reduce((sum, val) => sum + val, 0) / count;
      const median = times[Math.floor(count * 0.5)];
      
      // Determine performance category
      let performance = 'poor';
      if (median <= targetTime) {
        performance = 'good';
      } else if (median <= targetTime * 1.5) {
        performance = 'average';
      }
      
      return {
        avg: parseFloat(avg.toFixed(1)),
        median: parseFloat(median.toFixed(1)),
        count,
        performance
      };
    };
    
    return [
      {
        name: 'Phone',
        ...calcStats(filteredData.phone, targetResponseTimes.phone),
        target: targetResponseTimes.phone,
        channel: 'phone'
      },
      {
        name: 'Email',
        ...calcStats(filteredData.email, targetResponseTimes.email),
        target: targetResponseTimes.email,
        channel: 'email'
      },
      {
        name: 'LinkedIn',
        ...calcStats(filteredData.linkedin, targetResponseTimes.linkedin),
        target: targetResponseTimes.linkedin,
        channel: 'linkedin'
      },
      {
        name: 'Others',
        ...calcStats(filteredData.other, targetResponseTimes.other),
        target: targetResponseTimes.other,
        channel: 'other'
      }
    ];
  }, [filteredData]);

  // Custom tooltip for pie charts
  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = payload.reduce((sum, entry) => sum + entry.value, 0);
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{data.name} Response Times</p>
          <p className="tooltip-metric">
            <span>Count: </span>
            <span className="tooltip-value">{data.value}</span>
          </p>
          <p className="tooltip-metric">
            <span>Percentage: </span>
            <span className="tooltip-value">
              {data.value > 0 && total > 0
                ? `${Math.round((data.value / total) * 100)}%` 
                : '0%'}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for scatter plot
  const ScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      // Format date for display
      const date = new Date(data.date);
      const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear().toString().slice(2)}`;
      const formattedTime = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      
      // Convert response time from minutes to hours for display
      const responseHours = (data.responseTime / 60).toFixed(1);
      const targetHours = (data.target / 60).toFixed(1);
      
      return (
        <div className="custom-tooltip">
          <p className="tooltip-header">{formattedDate}</p>
          <p className="tooltip-metric">
            <span>Channel: </span>
            <span className="tooltip-value">{data.name}</span>
          </p>
          <p className="tooltip-metric">
            <span>Response Time: </span>
            <span className="tooltip-value">{responseHours}h</span>
          </p>
          <p className="tooltip-metric">
            <span>Target Time: </span>
            <span className="tooltip-value">{targetHours}h</span>
          </p>
          <p className="tooltip-metric">
            <span>PG: </span>
            <span className="tooltip-value">{data.pgName}</span>
          </p>
          <p className="tooltip-metric">
            <span>Persona: </span>
            <span className="tooltip-value">{data.persona}</span>
          </p>
          <p className="tooltip-metric">
            <span>Performance: </span>
            <span className={`tooltip-value ${data.responseTime <= data.target ? 'good' : (data.responseTime <= data.target * 1.5 ? 'average' : 'poor')}`}>
              {data.responseTime <= data.target ? 'Good' : (data.responseTime <= data.target * 1.5 ? 'Average' : 'Poor')}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Function to reset all filters
  const resetFilters = () => {
    setTimeRange('7d');
    setSelectedOutcome('all');
    setSelectedTimeFrame('all');
    setDateRange(getDateRange('7d'));
  };

  // Handle custom date range
  const handleCustomDateChange = () => {
    if (new Date(customStartDate) <= new Date(customEndDate)) {
      setTimeRange('custom');
      setShowDatePicker(false);
    }
  };

  // Custom label formatter for the pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
    // Return null for all labels to hide them
    return null;
  };
  
  // Helper to check if chart has no data
  const hasNoData = (data) => {
    return !data || Object.keys(data).length === 0 || data.count === 0;
  };

  // Get point color based on response time for scatter plot
  const getPointColor = (entry) => {
    if (!entry) return '#ccc';
    const channel = entry.channel.toLowerCase();
    const target = targetResponseTimes[channel];
    if (!target) return '#ccc';
    
    const responseTime = entry.responseTime; // in minutes
    
    if (responseTime <= target) {
      return '#22c55e'; // good - below target
    } else if (responseTime <= target * 1.5) {
      return '#f59e0b'; // average - up to 50% above target
    } else {
      return '#ef4444'; // poor - more than 50% above target
    }
  };

  // Define Y-axis ticks for hours
  const getResponseTimeMinuteTicks = () => {
    // Return values to show hours: 1h, 2h, 6h, 12h, 18h
    return [0, 60, 120, 360, 720, 1080];
  };
  
  // Handle selection of a dropdown item
  const handleSelectItem = (dropdownName, value) => {
    switch (dropdownName) {
      case 'timeRange':
        setTimeRange(value);
        if (value === 'custom') {
          setShowDatePicker(true);
        } else {
          closeAllDropdowns();
        }
        break;
      case 'outcome':
        setSelectedOutcome(value);
        closeAllDropdowns();
        break;
      case 'timeFrame':
        setSelectedTimeFrame(value);
        closeAllDropdowns();
        break;
      default:
        break;
    }
  };

  // Group data by week for each channel
  const weeklyTrends = useMemo(() => {
    const result = { phone: {}, email: {}, linkedin: {}, other: {} };
    Object.keys(filteredData).forEach(channel => {
      filteredData[channel].forEach(item => {
        const week = getWeekNumber(new Date(item.date));
        if (!result[channel][week]) result[channel][week] = { sum: 0, count: 0, target: 0 };
        result[channel][week].sum += item.responseTime * 60; // convert to minutes
        result[channel][week].count += 1;
        // If target changes over time, set it here. For now, use fixed target.
        result[channel][week].target = item.target || targetResponseTimes[channel];
      });
    });
    // Convert to array of {week, avg, target}
    const toArr = (obj) => Object.entries(obj).map(([week, v]) => ({ week, avg: v.sum/v.count, target: v.target }));
    return {
      phone: toArr(result.phone),
      email: toArr(result.email),
      linkedin: toArr(result.linkedin),
      other: toArr(result.other)
    };
  }, [filteredData]);

  // Helper: Get X position for a week (0-100%)
  const weekKeys = Array.from(new Set([
    ...weeklyTrends.phone.map(w => w.week),
    ...weeklyTrends.email.map(w => w.week),
    ...weeklyTrends.linkedin.map(w => w.week),
    ...weeklyTrends.other.map(w => w.week)
  ])).sort();
  const getWeekX = (week) => {
    const idx = weekKeys.indexOf(week);
    return weekKeys.length > 1 ? (idx/(weekKeys.length-1))*100 : 50;
  };

  // Helper: Get Y position for a value in minutes (0-100%, 0=bottom)
  const getY = (minutes) => 100-Math.max((minutes/1080)*100, 5);

  return (
    <div className={`response-chart-container ${isLoading ? 'loading' : ''}`}>
      <div className="chart-header">
        <div className="view-toggle">
          <button 
            className={`view-mode-btn ${viewMode === 'pie' ? 'active' : ''}`}
            onClick={() => setViewMode('pie')}
            title="Pie Chart View"
          >
            <MdPieChart size={24} style={{color: viewMode === 'pie' ? '#2563eb' : '#64748b', display: 'block'}} />
          </button>
          <button 
            className={`view-mode-btn ${viewMode === 'scatter' ? 'active' : ''}`}
            onClick={() => setViewMode('scatter')}
            title="Response Time Plot"
          >
            <MdBarChart size={24} style={{color: viewMode === 'scatter' ? '#2563eb' : '#64748b', display: 'block'}} />
          </button>
        </div>
        
        <div className="filter-actions">
          <button 
            className={`filter-button ${showFilters ? 'active' : ''} ${activeFilters > 0 ? 'has-filters' : ''}`} 
            onClick={() => setShowFilters(!showFilters)}
            title="Show Filters"
          >
            <MdFilterList size={24} style={{color: showFilters ? '#2563eb' : '#64748b', display: 'block'}} />
            {activeFilters > 0 && <span className="filter-count">{activeFilters}</span>}
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-grid">
            <div className="filter-group">
              <label>Time Range</label>
              <div className="filter-dropdown">
                <button 
                  className="dropdown-trigger"
                  onClick={() => toggleDropdown('timeRange')}
                >
                  {timeRangeOptions.find(o => o.value === timeRange)?.label || 'Select Time Range'}
                  <MdKeyboardArrowDown size={16} />
                </button>
                {showTimeRangeDropdown && (
                  <div className="dropdown-menu">
                    {timeRangeOptions.map(option => (
                      <div 
                        key={option.value} 
                        className={`dropdown-item ${timeRange === option.value ? 'selected' : ''}`}
                        onClick={() => handleSelectItem('timeRange', option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
                
                {timeRange === 'custom' && showDatePicker && (
                  <div className="date-picker-container">
                    <div className="date-input-group">
                      <label>Start:</label>
                      <input 
                        type="date" 
                        value={customStartDate}
                        onChange={e => setCustomStartDate(e.target.value)}
                      />
                    </div>
                    <div className="date-input-group">
                      <label>End:</label>
                      <input 
                        type="date" 
                        value={customEndDate}
                        onChange={e => setCustomEndDate(e.target.value)}
                      />
                    </div>
                    <button onClick={() => setShowDatePicker(false)}>Apply</button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="filter-group">
              <label>Outcome</label>
              <div className="filter-dropdown">
                <button 
                  className="dropdown-trigger"
                  onClick={() => toggleDropdown('outcome')}
                >
                  {outcomeOptions.find(o => o.value === selectedOutcome)?.label || 'Select Outcome'}
                  <MdKeyboardArrowDown size={16} />
                </button>
                {showOutcomeDropdown && (
                  <div className="dropdown-menu">
                    {outcomeOptions.map(option => (
                      <div 
                        key={option.value} 
                        className={`dropdown-item ${selectedOutcome === option.value ? 'selected' : ''}`}
                        onClick={() => handleSelectItem('outcome', option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="filter-group">
              <label>Time Frame</label>
              <div className="filter-dropdown">
                <button 
                  className="dropdown-trigger"
                  onClick={() => toggleDropdown('timeFrame')}
                >
                  {timeFrameOptions.find(o => o.value === selectedTimeFrame)?.label || 'Select Time Frame'}
                  <MdKeyboardArrowDown size={16} />
                </button>
                {showTimeFrameDropdown && (
                  <div className="dropdown-menu">
                    {timeFrameOptions.map(option => (
                      <div 
                        key={option.value} 
                        className={`dropdown-item ${selectedTimeFrame === option.value ? 'selected' : ''}`}
                        onClick={() => handleSelectItem('timeFrame', option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="filter-footer">
            <div className="filter-summary">
              {(timeRange !== '7d' || selectedOutcome !== 'all' || selectedTimeFrame !== 'all') && (
                <div className="active-filters">
                  <span>Active Filters:</span>
                  {timeRange !== '7d' && (
                    <span className="filter-tag">
                      {timeRange === 'custom' ? 'Custom Date Range' : timeRangeOptions.find(o => o.value === timeRange)?.label}
                      <MdClose size={16} onClick={() => setTimeRange('7d')} />
                    </span>
                  )}
                  {selectedOutcome !== 'all' && (
                    <span className="filter-tag">
                      {selectedOutcome}
                      <MdClose size={16} onClick={() => setSelectedOutcome('all')} />
                    </span>
                  )}
                  {selectedTimeFrame !== 'all' && (
                    <span className="filter-tag">
                      {timeFrameOptions.find(o => o.value === selectedTimeFrame)?.label}
                      <MdClose size={16} onClick={() => setSelectedTimeFrame('all')} />
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <button className="reset-filters" onClick={resetFilters}>
              <MdRefresh size={16} />
              Reset Filters
            </button>
          </div>
        </div>
      )}
      
      <div className="chart-section-divider">
        <div className="line-with-icon">
          <div className="line"></div>
          <div className="icon-wrapper">
            {viewMode === 'pie' ? <MdPieChart size={18} /> : <MdBarChart size={18} />}
          </div>
          <div className="line"></div>
        </div>
      </div>

      <div className="chart-legend">
        {viewMode === 'scatter' && (
          <>
            <div className="legend-item">
              <div className="legend-line target"></div>
              <span>Target</span>
            </div>
            <div className="legend-item">
              <div className="legend-line average"></div>
              <span>Average</span>
            </div>
          </>
        )}
        {viewMode === 'pie' && (
          <>
        <div className="legend-item">
          <div className="legend-box good"></div>
          <span>Good Response Time (Below Target)</span>
        </div>
        <div className="legend-item">
          <div className="legend-box average"></div>
          <span>Average Response Time (Up to 50% Above Target)</span>
        </div>
        <div className="legend-item">
          <div className="legend-box poor"></div>
          <span>Poor Response Time (More than 50% Above Target)</span>
        </div>
          </>
        )}
      </div>

      {isLoading ? (
        <div className="loading-overlay">
          <MdRefresh className="loading-icon" size={24} />
          <div>Updating charts...</div>
        </div>
      ) : viewMode === 'pie' ? (
        // Pie Chart View
        <div className="pie-charts-grid">
          {/* Phone Chart */}
          <div className="pie-chart-container">
            <div className="pie-chart-header">
              <div className="channel-icon-wrapper">
                <PhoneIcon />
              </div>
              <h4>Phone</h4>
              <div className="target-time">Target: {formatResponseTime(targetResponseTimes.phone)}</div>
              <div className="data-count">{filteredData.phone.length} data points</div>
            </div>
            <div className="pie-chart">
              <ResponsiveContainer width="100%" height={200}>
                {hasNoData(pieChartData.phone) ? (
                  <div className="no-data-message">No data available</div>
                ) : (
                  <PieChart>
                    <Pie
                      data={pieChartData.phone}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.phone.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Email Chart */}
          <div className="pie-chart-container">
            <div className="pie-chart-header">
              <div className="channel-icon-wrapper">
                <EmailIcon />
              </div>
              <h4>Email</h4>
              <div className="target-time">Target: {formatResponseTime(targetResponseTimes.email)}</div>
              <div className="data-count">{filteredData.email.length} data points</div>
            </div>
            <div className="pie-chart">
              <ResponsiveContainer width="100%" height={200}>
                {hasNoData(pieChartData.email) ? (
                  <div className="no-data-message">No data available</div>
                ) : (
                  <PieChart>
                    <Pie
                      data={pieChartData.email}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.email.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* LinkedIn Chart */}
          <div className="pie-chart-container">
            <div className="pie-chart-header">
              <div className="channel-icon-wrapper">
                <LinkedInIcon />
              </div>
              <h4>LinkedIn</h4>
              <div className="target-time">Target: {formatResponseTime(targetResponseTimes.linkedin)}</div>
              <div className="data-count">{filteredData.linkedin.length} data points</div>
            </div>
            <div className="pie-chart">
              <ResponsiveContainer width="100%" height={200}>
                {hasNoData(pieChartData.linkedin) ? (
                  <div className="no-data-message">No data available</div>
                ) : (
                  <PieChart>
                    <Pie
                      data={pieChartData.linkedin}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.linkedin.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Others Chart */}
          <div className="pie-chart-container">
            <div className="pie-chart-header">
              <div className="channel-icon-wrapper">
                <OtherIcon />
              </div>
              <h4>Others</h4>
              <div className="target-time">Target: {formatResponseTime(targetResponseTimes.other)}</div>
              <div className="data-count">{filteredData.other.length} data points</div>
            </div>
            <div className="pie-chart">
              <ResponsiveContainer width="100%" height={200}>
                {hasNoData(pieChartData.other) ? (
                  <div className="no-data-message">No data available</div>
                ) : (
                  <PieChart>
                    <Pie
                      data={pieChartData.other}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.other.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        // Scatter Plot View
        <div className="response-metrics-card">
          
          <div className="response-summary">
            <div className="response-summary-text">
              Response times across all channels
            </div>
          </div>
          
          <div className="pg-response-chart">
            <div className="response-time-axis">
              <div className="time-label">18h</div>
              <div className="time-label">12h</div>
              <div className="time-label">6h</div>
              <div className="time-label">2h</div>
              <div className="time-label">1h</div>
            </div>
            
            {/* Channel-specific lines are cleaner and positioned better within their zones */}
            <div className="channel-zones">
              {/* Helper to calculate bottom position with clamping */}
              {(() => {
                // Helper function to get clamped bottom %
                const getBottomPercent = (minutes) => {
                  const percent = (minutes / 1080) * 100;
                  return Math.max(percent, 5); // Clamp to at least 5% from bottom
                };
                // Helper to render a line if value > 0
                const renderLine = (type, value, label) => {
                  if (!value || value <= 0 || isNaN(value)) return null;
                  const bottom = getBottomPercent(value);
                  // If line is close to bottom, put label above the line
                  const labelStyle = bottom < 12 ? { bottom: '18px', top: 'auto' } : {};
                  return (
                    <div className={`channel-${type}-line`} style={{ bottom: `${bottom}%` }}>
                      <span className="zone-label" style={labelStyle}>{label}</span>
                    </div>
                  );
                };
                return (
                  <>
                    <div className="channel-zone phone-zone">
                      {renderLine('target', targetResponseTimes.phone, 'T: 10m')}
                      {renderLine('average', channelStats[0].avg * 60, `A: ${formatResponseTime(channelStats[0].avg)}`)}
                    </div>
                    <div className="channel-zone email-zone">
                      {renderLine('target', targetResponseTimes.email, 'T: 30m')}
                      {renderLine('average', channelStats[1].avg * 60, `A: ${formatResponseTime(channelStats[1].avg)}`)}
                    </div>
                    <div className="channel-zone linkedin-zone">
                      {renderLine('target', targetResponseTimes.linkedin, 'T: 1h')}
                      {renderLine('average', channelStats[2].avg * 60, `A: ${formatResponseTime(channelStats[2].avg)}`)}
                    </div>
                    <div className="channel-zone other-zone">
                      {renderLine('target', targetResponseTimes.other, 'T: 2h')}
                      {renderLine('average', channelStats[3].avg * 60, `A: ${formatResponseTime(channelStats[3].avg)}`)}
                    </div>
                  </>
                );
              })()}
              {/* Weekly trend lines for each channel */}
              {['phone','email','linkedin','other'].map(channel => (
                <svg key={channel} className={`trend-svg trend-svg-${channel}`} style={{position:'absolute',left:0,top:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:20}}>
                  {/* Target trend line */}
                  <polyline
                    fill="none"
                    stroke="#f87171"
                    strokeDasharray="6 3"
                    strokeWidth="2"
                    points={weeklyTrends[channel].map(w => `${getWeekX(w.week)}%,${getY(w.target)}%`).join(' ')}
                  />
                  {/* Average trend line */}
                  <polyline
                    fill="none"
                    stroke="#222"
                    strokeWidth="2"
                    points={weeklyTrends[channel].map(w => `${getWeekX(w.week)}%,${getY(w.avg)}%`).join(' ')}
                  />
                </svg>
              ))}
            </div>
            
            <div className="timeline-container">
              {/* Channel icons on top */}
              <div className="channel-icons-row">
                <div className="channel-icon-wrapper phone-position">
                  <div className="channel-icon phone-icon">
                <PhoneIcon />
              </div>
              <div className="channel-label">Phone</div>
            </div>
                <div className="channel-icon-wrapper email-position">
                  <div className="channel-icon email-icon">
                <EmailIcon />
              </div>
              <div className="channel-label">Email</div>
            </div>
                <div className="channel-icon-wrapper linkedin-position">
                  <div className="channel-icon linkedin-icon">
                <LinkedInIcon />
              </div>
              <div className="channel-label">LinkedIn</div>
            </div>
                <div className="channel-icon-wrapper other-position">
                  <div className="channel-icon other-icon">
                <OtherIcon />
              </div>
              <div className="channel-label">Others</div>
            </div>
          </div>
              
              {/* Data points scattered across the timeline */}
              <div className="dots-container">
                {/* Phone data points */}
                <div className="data-dot phone-dot" style={{left: '10%', bottom: '65%'}} data-tooltip="Phone call - Response time: 1h 30m - PG: John Smith - Date: 05/20/25"></div>
                <div className="data-dot phone-dot" style={{left: '20%', bottom: '20%'}} data-tooltip="Phone call - Response time: 12h 45m - PG: Amy Johnson - Date: 05/27/25"></div>
                <div className="data-dot phone-dot" style={{left: '40%', bottom: '70%'}} data-tooltip="Phone call - Response time: 1h 10m - PG: Robert Williams - Date: 06/03/25"></div>
                
                {/* Email data points */}
                <div className="data-dot email-dot" style={{left: '28%', bottom: '55%'}} data-tooltip="Email - Response time: 3h 25m - PG: Sarah Miller - Date: 05/27/25"></div>
                <div className="data-dot email-dot" style={{left: '58%', bottom: '20%'}} data-tooltip="Email - Response time: 12h 10m - PG: David Chen - Date: 06/10/25"></div>
                <div className="data-dot email-dot" style={{left: '65%', bottom: '35%'}} data-tooltip="Email - Response time: 8h 30m - PG: Michael Brown - Date: 06/17/25"></div>
                
                {/* LinkedIn data points */}
                <div className="data-dot linkedin-dot" style={{left: '46%', bottom: '75%'}} data-tooltip="LinkedIn - Response time: 45m - PG: Jessica Taylor - Date: 06/03/25"></div>
                <div className="data-dot linkedin-dot" style={{left: '76%', bottom: '80%'}} data-tooltip="LinkedIn - Response time: 35m - PG: Thomas Wilson - Date: 06/17/25"></div>
                <div className="data-dot linkedin-dot" style={{left: '82%', bottom: '25%'}} data-tooltip="LinkedIn - Response time: 10h 15m - PG: Emily Davis - Date: 06/24/25"></div>
                
                {/* Other data points */}
                <div className="data-dot other-dot" style={{left: '16%', bottom: '15%'}} data-tooltip="Other channel - Response time: 15h 20m - PG: Olivia Lee - Date: 05/20/25"></div>
                <div className="data-dot other-dot" style={{left: '70%', bottom: '45%'}} data-tooltip="Other channel - Response time: 6h 45m - PG: William Garcia - Date: 06/17/25"></div>
                <div className="data-dot other-dot" style={{left: '90%', bottom: '85%'}} data-tooltip="Other channel - Response time: 30m - PG: Sophia Martinez - Date: 06/24/25"></div>
              </div>
            </div>
            
            {/* Visual zone indicators for each channel */}
            <div className="channel-zones">
              <div className="channel-zone phone-zone"></div>
              <div className="channel-zone email-zone"></div>
              <div className="channel-zone linkedin-zone"></div>
              <div className="channel-zone other-zone"></div>
            </div>
            
            {/* X-axis with dates in MM/DD/YY format */}
            <div className="date-axis">
              <div style={{ position: 'absolute', right: '5px', bottom: '-20px', fontSize: '12px', color: '#64748b' }}>
                Time →
              </div>
              {[
                "05/20/25",
                "05/27/25",
                "06/03/25",
                "06/10/25",
                "06/17/25",
                "06/24/25"
              ].map((date, index, array) => (
                <div 
                  key={`date-${index}`} 
                  className="date-label"
                  style={{ left: `${(index / (array.length - 1)) * 100}%` }}
                >
                  {date}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="channel-metrics">
        {channelStats.map((channel) => (
          <div 
            key={channel.channel}
            className={`channel-card ${channel.performance}`}
          >
            <div className="channel-icon-container">
              {channel.channel === 'phone' && <MdPhone size={24} />}
              {channel.channel === 'email' && <MdEmail size={24} />}
              {channel.channel === 'linkedin' && <FaLinkedin size={24} />}
              {channel.channel === 'other' && <MdMore size={24} />}
            </div>
            <div className="channel-name">{channel.name}</div>
            <div className="channel-value">{formatResponseTime(channel.avg)}</div>
            <div className="channel-metric">Median: {formatResponseTime(channel.median)}</div>
            <div className="channel-target">Target: {formatResponseTime(channel.target)}</div>
            <div className="channel-count">{channel.count} data points</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponseChart; 