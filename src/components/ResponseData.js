// Mock dataset for Response Velocity Chart
// This file contains realistic mock data with varying response times across multiple dates, personas, and regions

// Generate dates for the last 30 days
const generateDates = () => {
  const dates = [];
  const today = new Date('2025-05-03');
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
    dates.push(formattedDate);
  }
  
  return dates;
};

const dates = generateDates();

// Generate comprehensive mock data
export const generateResponseData = () => {
  // Common organization names
  const organizations = {
    'NE': ['Boston Medical Partners', 'New England Healthcare', 'Northeast Physicians Group', 'Atlantic Care Associates'],
    'SE': ['Southern Medical Group', 'Carolina Health Partners', 'Gulf Coast Medical', 'Florida Physician Network'],
    'MW': ['Heartland Healthcare', 'Great Lakes Physicians', 'Midwest Medical Group', 'Prairie Health Partners'],
    'SW': ['Southwest Care Network', 'Texas Medical Associates', 'Desert Health Partners', 'Rocky Mountain Physicians'],
    'W': ['Pacific Care Group', 'Western Medical Network', 'Coastal Physicians Alliance', 'Mountain View Medical']
  };
  
  // Personas with likely response times (in hours)
  const personas = [
    { title: 'CMO', avgResponseTime: { phone: 1.5, email: 6, linkedin: 4, other: 2 } },
    { title: 'CEO', avgResponseTime: { phone: 2, email: 8, linkedin: 6, other: 3 } },
    { title: 'Director', avgResponseTime: { phone: 1, email: 4, linkedin: 3, other: 1.5 } },
    { title: 'Operations', avgResponseTime: { phone: 0.5, email: 3, linkedin: 2, other: 1 } },
    { title: 'CFO', avgResponseTime: { phone: 1.8, email: 7, linkedin: 5, other: 2.5 } }
  ];
  
  // Possible outcomes with probabilities
  const outcomes = ['Interested', 'Replied', 'No Reply'];
  
  // Generate random data points for each channel
  const generateChannelData = (channel) => {
    const dataPoints = [];
    const totalPoints = channel === 'email' ? 50 : (channel === 'linkedin' ? 35 : (channel === 'phone' ? 45 : 30));
    
    // Use different dates - more recent dates have more data points
    for (let i = 0; i < totalPoints; i++) {
      // Weight towards more recent dates (exponential distribution)
      const dateIndex = Math.min(Math.floor(Math.random() * Math.random() * 30), 29);
      const date = dates[dateIndex];
      
      // Pick random region and organization
      const regions = Object.keys(organizations);
      const region = regions[Math.floor(Math.random() * regions.length)];
      const orgList = organizations[region];
      const pgName = orgList[Math.floor(Math.random() * orgList.length)];
      
      // Pick random persona
      const persona = personas[Math.floor(Math.random() * personas.length)];
      
      // Calculate response time based on persona avg + random variation
      // Each channel has different baseline response times
      const baseTime = persona.avgResponseTime[channel];
      // Add variability (-30% to +50%)
      let responseTime = baseTime * (0.7 + Math.random() * 0.8);
      // Round to 1 decimal place
      responseTime = Math.round(responseTime * 10) / 10;
      
      // Determine outcome (weighted by response time)
      let outcome;
      if (responseTime <= 2) {
        // Fast responses more likely to be interested
        outcome = Math.random() < 0.7 ? 'Interested' : (Math.random() < 0.8 ? 'Replied' : 'No Reply');
      } else if (responseTime <= 6) {
        // Medium responses more likely to just reply
        outcome = Math.random() < 0.3 ? 'Interested' : (Math.random() < 0.8 ? 'Replied' : 'No Reply');
      } else {
        // Slow responses more likely to be no reply
        outcome = Math.random() < 0.1 ? 'Interested' : (Math.random() < 0.5 ? 'Replied' : 'No Reply');
      }
      
      dataPoints.push({
        date,
        responseTime,
        pgName,
        persona: persona.title,
        outcome,
        region
      });
    }
    
    return dataPoints;
  };
  
  return {
    phone: generateChannelData('phone'),
    email: generateChannelData('email'),
    linkedin: generateChannelData('linkedin'),
    other: generateChannelData('other')
  };
};

// Generate historical trend data (last 4 weeks)
export const generateTrendData = () => {
  // Base average response times by channel
  const baseAverages = {
    phone: 1.5,
    email: 7.5,
    linkedin: 4.5,
    other: 2.2
  };
  
  // Generate weekly trends with some improvement over time
  const generateChannelTrend = (channel) => {
    const base = baseAverages[channel];
    // Small random improvement each week
    return [
      base,
      base * (0.95 - Math.random() * 0.1),
      base * (0.9 - Math.random() * 0.1), 
      base * (0.85 - Math.random() * 0.1)
    ].map(val => Math.round(val * 10) / 10);
  };
  
  return {
    phone: generateChannelTrend('phone'),
    email: generateChannelTrend('email'),
    linkedin: generateChannelTrend('linkedin'),
    other: generateChannelTrend('other')
  };
};

// Export ready-to-use data
export const mockResponseData = generateResponseData();
export const mockTrendData = generateTrendData();

// Helper functions for date filtering
export const getDateRange = (rangeType) => {
  const today = new Date('2025-05-03');
  let startDate;
  
  switch (rangeType) {
    case '7d':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      break;
    case '30d':
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
      break;
    case 'quarter':
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 3);
      break;
    case 'ytd':
      startDate = new Date(today.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
  }
  
  return {
    start: startDate,
    end: today
  };
};

export const isDateInRange = (dateString, range) => {
  const dateParts = dateString.split('-');
  const date = new Date(parseInt(dateParts[2]), parseInt(dateParts[0]) - 1, parseInt(dateParts[1]));
  return date >= range.start && date <= range.end;
}; 