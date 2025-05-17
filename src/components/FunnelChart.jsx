import React, { useMemo } from 'react';
import './FunnelChart.css';

const FunnelChart = ({ onStageClick, searchQuery = '' }) => {
  // Mock data for the funnel stages with division and statistical area information
  const funnelRawData = [
    {
      stage: 'Targets',
      count: 350,
      description: 'Initial identified PGs',
      regions: [
        { division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', count: 70 },
        { division: 'Mid-Atlantic', statisticalArea: 'New York-Newark-Jersey City', count: 65 },
        { division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', count: 55 },
        { division: 'East North Central', statisticalArea: 'Chicago-Naperville-Elgin', count: 45 },
        { division: 'West South Central', statisticalArea: 'Dallas-Fort Worth-Arlington', count: 40 },
        { division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', count: 75 }
      ]
    },
    {
      stage: 'Outreach',
      count: 280,
      description: 'PGs contacted',
      regions: [
        { division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', count: 55 },
        { division: 'Mid-Atlantic', statisticalArea: 'New York-Newark-Jersey City', count: 50 },
        { division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', count: 45 },
        { division: 'East North Central', statisticalArea: 'Chicago-Naperville-Elgin', count: 38 },
        { division: 'West South Central', statisticalArea: 'Dallas-Fort Worth-Arlington', count: 32 },
        { division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', count: 60 }
      ]
    },
    {
      stage: 'Pilots',
      count: 180,
      description: 'Engaged in trials',
      regions: [
        { division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', count: 35 },
        { division: 'Mid-Atlantic', statisticalArea: 'New York-Newark-Jersey City', count: 33 },
        { division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', count: 28 },
        { division: 'East North Central', statisticalArea: 'Chicago-Naperville-Elgin', count: 25 },
        { division: 'West South Central', statisticalArea: 'Dallas-Fort Worth-Arlington', count: 19 },
        { division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', count: 40 }
      ]
    },
    {
      stage: 'Onboarded',
      count: 120,
      description: 'Fully onboarded',
      regions: [
        { division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', count: 25 },
        { division: 'Mid-Atlantic', statisticalArea: 'New York-Newark-Jersey City', count: 22 },
        { division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', count: 18 },
        { division: 'East North Central', statisticalArea: 'Chicago-Naperville-Elgin', count: 16 },
        { division: 'West South Central', statisticalArea: 'Dallas-Fort Worth-Arlington', count: 14 },
        { division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', count: 25 }
      ]
    },
    {
      stage: 'Premium',
      count: 80,
      description: 'Premium members',
      regions: [
        { division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', count: 18 },
        { division: 'Mid-Atlantic', statisticalArea: 'New York-Newark-Jersey City', count: 15 },
        { division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', count: 12 },
        { division: 'East North Central', statisticalArea: 'Chicago-Naperville-Elgin', count: 10 },
        { division: 'West South Central', statisticalArea: 'Dallas-Fort Worth-Arlington', count: 8 },
        { division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', count: 17 }
      ]
    }
  ];
  
  // Filter funnel data based on search query
  const funnelData = useMemo(() => {
    if (!searchQuery.trim()) return funnelRawData;
    
    const query = searchQuery.toLowerCase().trim();
    
    return funnelRawData.map(stage => {
      // Filter regions that match the search query
      const filteredRegions = stage.regions.filter(region => 
        region.division.toLowerCase().includes(query) || 
        region.statisticalArea.toLowerCase().includes(query)
      );
      
      // If no regions match, return null (will be filtered out)
      if (filteredRegions.length === 0) return null;
      
      // Calculate new count based on filtered regions
      const newCount = filteredRegions.reduce((sum, region) => sum + region.count, 0);
      
      // Return updated stage with filtered regions and count
      return {
        ...stage,
        count: newCount,
        regions: filteredRegions
      };
    }).filter(Boolean); // Remove null items
  }, [funnelRawData, searchQuery]);

  return (
    <div className="funnel-container">
      <div className="funnel-description">
        Click on a stage to filter dashboard data
      </div>
      <div className="funnel-chart">
        {funnelData.length > 0 ? (
          funnelData.map((item, index) => (
            <div 
              key={index} 
              className={`funnel-segment ${index >= 3 ? 'lower-segment' : ''}`}
              onClick={() => onStageClick(item.stage)}
              title={`${item.description}: ${item.count} PGs`}
            >
              <div className="funnel-content">
                <div className="funnel-label">{item.stage}</div>
                <div className="funnel-count">{item.count}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No matching funnel data</div>
        )}
      </div>
    </div>
  );
};

export default FunnelChart; 