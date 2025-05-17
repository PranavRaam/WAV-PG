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
  // Common organization names with division and statistical area
  const organizations = {
    'NE': [
      { name: 'Boston Medical Partners', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton' },
      { name: 'New England Healthcare', division: 'New England', statisticalArea: 'Providence-Warwick' },
      { name: 'Northeast Physicians Group', division: 'Mid-Atlantic', statisticalArea: 'New York-Newark-Jersey City' },
      { name: 'Atlantic Care Associates', division: 'Mid-Atlantic', statisticalArea: 'Philadelphia-Camden-Wilmington' }
    ],
    'SE': [
      { name: 'Southern Medical Group', division: 'South Atlantic', statisticalArea: 'Atlanta-Sandy Springs-Alpharetta' },
      { name: 'Carolina Health Partners', division: 'South Atlantic', statisticalArea: 'Charlotte-Concord-Gastonia' },
      { name: 'Gulf Coast Medical', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach' },
      { name: 'Florida Physician Network', division: 'South Atlantic', statisticalArea: 'Tampa-St. Petersburg-Clearwater' }
    ],
    'MW': [
      { name: 'Heartland Healthcare', division: 'East North Central', statisticalArea: 'Chicago-Naperville-Elgin' },
      { name: 'Great Lakes Physicians', division: 'East North Central', statisticalArea: 'Detroit-Warren-Dearborn' },
      { name: 'Midwest Medical Group', division: 'West North Central', statisticalArea: 'Minneapolis-St. Paul-Bloomington' },
      { name: 'Prairie Health Partners', division: 'West North Central', statisticalArea: 'Kansas City' }
    ],
    'SW': [
      { name: 'Southwest Care Network', division: 'West South Central', statisticalArea: 'Dallas-Fort Worth-Arlington' },
      { name: 'Texas Medical Associates', division: 'West South Central', statisticalArea: 'Houston-The Woodlands-Sugar Land' },
      { name: 'Desert Health Partners', division: 'Mountain', statisticalArea: 'Phoenix-Mesa-Chandler' },
      { name: 'Rocky Mountain Physicians', division: 'Mountain', statisticalArea: 'Denver-Aurora-Lakewood' }
    ],
    'W': [
      { name: 'Pacific Care Group', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim' },
      { name: 'Western Medical Network', division: 'Pacific', statisticalArea: 'San Francisco-Oakland-Berkeley' },
      { name: 'Coastal Physicians Alliance', division: 'Pacific', statisticalArea: 'Seattle-Tacoma-Bellevue' },
      { name: 'Mountain View Medical', division: 'Pacific', statisticalArea: 'Portland-Vancouver-Hillsboro' }
    ]
  };
  
  // Personas with likely response times (in hours)
  const personas = [
    { title: 'CMO', avgResponseTime: { phone: 0.08, email: 0.25, linkedin: 0.5, other: 1.2 } },
    { title: 'CEO', avgResponseTime: { phone: 0.12, email: 0.40, linkedin: 0.8, other: 1.5 } },
    { title: 'Director', avgResponseTime: { phone: 0.06, email: 0.20, linkedin: 0.45, other: 0.8 } },
    { title: 'Operations', avgResponseTime: { phone: 0.05, email: 0.15, linkedin: 0.30, other: 0.6 } },
    { title: 'CFO', avgResponseTime: { phone: 0.10, email: 0.35, linkedin: 0.70, other: 1.0 } }
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
      const org = orgList[Math.floor(Math.random() * orgList.length)];
      
      // Pick random persona
      const persona = personas[Math.floor(Math.random() * personas.length)];
      
      // Calculate response time based on persona avg + random variation
      // Each channel has different baseline response times
      const baseTime = persona.avgResponseTime[channel];
      // Add variability
      let responseTime;
      
      // Generate a more balanced mix of response times
      // 40% chance of good responses (below target)
      if (Math.random() < 0.4) {
        // Good response time (below target)
        const targetTime = channel === 'phone' ? 0.17 : // 10 min
                          channel === 'email' ? 0.5 :  // 30 min
                          channel === 'linkedin' ? 1.0 : // 60 min
                          2.0; // 120 min for others
        responseTime = baseTime * (0.5 + Math.random() * 0.5);
        responseTime = Math.min(responseTime, targetTime * 0.9); // Ensure it's below target
      }
      // 30% chance of average responses
      else if (Math.random() < 0.65) {
        // Average response time (target to 50% above)
        const targetTime = channel === 'phone' ? 0.17 : // 10 min
                          channel === 'email' ? 0.5 :  // 30 min
                          channel === 'linkedin' ? 1.0 : // 60 min
                          2.0; // 120 min for others
        responseTime = targetTime * (1.0 + Math.random() * 0.5);
      } 
      // 30% chance of poor responses
      else {
        // Poor response time (more than 50% above target)
        const targetTime = channel === 'phone' ? 0.17 : // 10 min
                          channel === 'email' ? 0.5 :  // 30 min
                          channel === 'linkedin' ? 1.0 : // 60 min
                          2.0; // 120 min for others
        responseTime = targetTime * (1.5 + Math.random() * 4);
      }
      
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
        pgName: org.name,
        division: org.division,
        statisticalArea: org.statisticalArea,
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

// Generate mock data for reach out attempts
export const generateReachOutData = () => {
  // For each channel, generate data with responses and attempts
  const generateChannelReachOuts = (category) => {
    // Set different success rates for each channel
    let responseRate;
    switch(category) {
      case 'call':
        responseRate = 0.72; // 72% success rate
        break;
      case 'email':
        responseRate = 0.58; // 58% success rate
        break;
      case 'linkedin':
        responseRate = 0.65; // 65% success rate
        break;
      default:
        responseRate = 0.60; // 60% success rate
    }
    
    // Calculate total amount of outreach for this channel
    const totalValue = category === 'call' ? 226 : 
                       category === 'email' ? 323 : 
                       category === 'linkedin' ? 75 : 75;
    
    // For each channel, generate a single data point with response/attempt data
    return {
      category,
      value: totalValue,
      // Include data needed for success rate calculation
      attempts: Math.round(totalValue * 1.2), // slightly more attempts than value
      responses: Math.round(totalValue * 1.2 * responseRate) // responses based on success rate
    };
  };
  
  return [
    generateChannelReachOuts('call'),
    generateChannelReachOuts('email'),
    generateChannelReachOuts('linkedin'),
    generateChannelReachOuts('other')
  ];
};

// Generate mock data for BiAxial chart
export const generateBiAxialData = () => {
  return [
    {
      verticals: [
        { type: 'PG', count: 20, division: 'New England', statisticalArea: 'Boston-Cambridge-Newton' }, 
        { type: 'CHC', count: 10, division: 'New England', statisticalArea: 'Boston-Cambridge-Newton' }, 
        { type: 'VA', count: 5, division: 'New England', statisticalArea: 'Boston-Cambridge-Newton' }
      ],
      verticalWidth: 40,
      patients: 400,
      patientWidth: 40,
      division: 'New England',
      statisticalArea: 'Boston-Cambridge-Newton'
    },
    {
      verticals: [
        { type: 'PG', count: 180, division: 'Mid-Atlantic', statisticalArea: 'New York-Newark-Jersey City' }, 
        { type: 'CHC', count: 100, division: 'Mid-Atlantic', statisticalArea: 'New York-Newark-Jersey City' }
      ],
      verticalWidth: 35,
      patients: 300,
      patientWidth: 30,
      division: 'Mid-Atlantic',
      statisticalArea: 'New York-Newark-Jersey City'
    },
    {
      verticals: [
        { type: 'PG', count: 300, division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach' }
      ],
      verticalWidth: 30,
      patients: 200,
      patientWidth: 20,
      division: 'South Atlantic',
      statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach'
    },
    {
      verticals: [
        { type: 'PG', count: 200, division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim' }
      ],
      verticalWidth: 25,
      patients: 180,
      patientWidth: 18,
      division: 'Pacific',
      statisticalArea: 'Los Angeles-Long Beach-Anaheim'
    }
  ];
};

// Generate mock data for Growth chart
export const generateGrowthData = () => {
  return [
    { id: 1, region: 'Northeast', state: 'MA', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', month: 'Jan', growth: 15, target: 20 },
    { id: 2, region: 'Northeast', state: 'MA', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', month: 'Feb', growth: 18, target: 20 },
    { id: 3, region: 'Northeast', state: 'MA', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', month: 'Mar', growth: 22, target: 20 },
    { id: 4, region: 'Northeast', state: 'MA', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', month: 'Apr', growth: 21, target: 20 },
    { id: 5, region: 'Northeast', state: 'MA', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', month: 'May', growth: 24, target: 25 },
    { id: 6, region: 'Northeast', state: 'MA', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', month: 'Jun', growth: 28, target: 25 },
    { id: 7, region: 'West', state: 'CA', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', month: 'Jan', growth: 17, target: 22 },
    { id: 8, region: 'West', state: 'CA', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', month: 'Feb', growth: 20, target: 22 },
    { id: 9, region: 'West', state: 'CA', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', month: 'Mar', growth: 24, target: 22 },
    { id: 10, region: 'West', state: 'CA', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', month: 'Apr', growth: 22, target: 22 },
    { id: 11, region: 'West', state: 'CA', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', month: 'May', growth: 26, target: 27 },
    { id: 12, region: 'West', state: 'CA', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', month: 'Jun', growth: 30, target: 27 },
    { id: 13, region: 'Southeast', state: 'FL', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', month: 'Jan', growth: 12, target: 18 },
    { id: 14, region: 'Southeast', state: 'FL', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', month: 'Feb', growth: 15, target: 18 },
    { id: 15, region: 'Southeast', state: 'FL', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', month: 'Mar', growth: 19, target: 18 },
    { id: 16, region: 'Southeast', state: 'FL', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', month: 'Apr', growth: 18, target: 18 },
    { id: 17, region: 'Southeast', state: 'FL', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', month: 'May', growth: 22, target: 23 },
    { id: 18, region: 'Southeast', state: 'FL', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', month: 'Jun', growth: 25, target: 23 }
  ];
};

// Generate mock data for connections
export const generateConnectionsData = () => {
  const connectionData = [
    { id: 1, region: 'Northeast', state: 'MA', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', value: 84, target: 120, attempts: 105, successes: 84 },
    { id: 2, region: 'West', state: 'CA', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', value: 67, target: 90, attempts: 82, successes: 67 },
    { id: 3, region: 'Southeast', state: 'FL', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', value: 73, target: 100, attempts: 95, successes: 73 },
    { id: 4, region: 'Midwest', state: 'IL', division: 'East North Central', statisticalArea: 'Chicago-Naperville-Elgin', value: 58, target: 85, attempts: 75, successes: 58 },
    { id: 5, region: 'Southwest', state: 'TX', division: 'West South Central', statisticalArea: 'Dallas-Fort Worth-Arlington', value: 62, target: 80, attempts: 80, successes: 62 },
    { id: 6, region: 'West', state: 'WA', division: 'Pacific', statisticalArea: 'Seattle-Tacoma-Bellevue', value: 45, target: 70, attempts: 62, successes: 45 },
    { id: 7, region: 'Northeast', state: 'NY', division: 'Mid-Atlantic', statisticalArea: 'New York-Newark-Jersey City', value: 91, target: 110, attempts: 110, successes: 91 },
    { id: 8, region: 'Southeast', state: 'GA', division: 'South Atlantic', statisticalArea: 'Atlanta-Sandy Springs-Alpharetta', value: 53, target: 75, attempts: 68, successes: 53 }
  ];
  
  // Tag each connection with its type based on value/target ratio
  return connectionData.map(conn => {
    const ratio = conn.value / conn.target;
    let type;
    
    if (ratio >= 0.8) {
      type = 'promoter';
    } else if (ratio >= 0.5) {
      type = 'neutral'; 
    } else {
      type = 'blocker';
    }
    
    return {
      ...conn,
      type
    };
  });
};

// Export ready-to-use data
export const mockResponseData = generateResponseData();
export const mockTrendData = generateTrendData();
export const mockReachOutsData = generateReachOutData();
export const mockBiAxialData = generateBiAxialData();
export const mockGrowthData = generateGrowthData();
export const mockConnectionsData = generateConnectionsData();

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