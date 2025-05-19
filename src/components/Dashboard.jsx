import React, { useState, useEffect } from 'react';
import FunnelChart from './FunnelChart';
import BiAxialBarChart from './BiAxialBarChart';
import ConnectionsCard from './ConnectionsCard';
import ReachOutsCard from './ReachOutsCard';
import GrowthChart from './GrowthChart';
import ResponseChart from './ResponseChart';
import StageDetailView from './StageDetailView';
import { FiFilter, FiCalendar, FiMap, FiActivity, FiDownload, FiPieChart, FiSearch } from 'react-icons/fi';
import { 
  mockConnectionsData, 
  mockResponseData, 
  mockReachOutsData,
  mockGrowthData,
  mockBiAxialData 
} from './ResponseData';
import './Dashboard.css';

// Mock data
// const mockBiAxialData = [
//   {
//     verticals: [
//       { type: 'PG', count: 20, division: 'New England', statisticalArea: 'Boston-Cambridge-Newton' }, 
//       { type: 'CHC', count: 10, division: 'New England', statisticalArea: 'Boston-Cambridge-Newton' }, 
//       { type: 'VA', count: 5, division: 'New England', statisticalArea: 'Boston-Cambridge-Newton' }
//     ],
//     verticalWidth: 40,
//     patients: 400,
//     patientWidth: 40,
//     division: 'New England',
//     statisticalArea: 'Boston-Cambridge-Newton'
//   },
//   {
//     verticals: [
//       { type: 'PG', count: 180, division: 'Mid-Atlantic', statisticalArea: 'New York-Newark-Jersey City' }, 
//       { type: 'CHC', count: 100, division: 'Mid-Atlantic', statisticalArea: 'New York-Newark-Jersey City' }
//     ],
//     verticalWidth: 35,
//     patients: 300,
//     patientWidth: 30,
//     division: 'Mid-Atlantic',
//     statisticalArea: 'New York-Newark-Jersey City'
//   },
//   {
//     verticals: [
//       { type: 'PG', count: 300, division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach' }
//     ],
//     verticalWidth: 30,
//     patients: 200,
//     patientWidth: 20,
//     division: 'South Atlantic',
//     statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach'
//   },
//   {
//     verticals: [
//       { type: 'PG', count: 200, division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim' }
//     ],
//     verticalWidth: 25,
//     patients: 180,
//     patientWidth: 18,
//     division: 'Pacific',
//     statisticalArea: 'Los Angeles-Long Beach-Anaheim'
//   }
// ];

// Mock data for connections component
// const mockConnectionsData = [
//   { id: 1, region: 'Northeast', state: 'MA', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', value: 84, target: 120 },
//   { id: 2, region: 'West', state: 'CA', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', value: 67, target: 90 },
//   { id: 3, region: 'Southeast', state: 'FL', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', value: 73, target: 100 },
//   { id: 4, region: 'Midwest', state: 'IL', division: 'East North Central', statisticalArea: 'Chicago-Naperville-Elgin', value: 58, target: 85 },
//   { id: 5, region: 'Southwest', state: 'TX', division: 'West South Central', statisticalArea: 'Dallas-Fort Worth-Arlington', value: 62, target: 80 },
//   { id: 6, region: 'West', state: 'WA', division: 'Pacific', statisticalArea: 'Seattle-Tacoma-Bellevue', value: 45, target: 70 },
//   { id: 7, region: 'Northeast', state: 'NY', division: 'Mid-Atlantic', statisticalArea: 'New York-Newark-Jersey City', value: 91, target: 110 },
//   { id: 8, region: 'Southeast', state: 'GA', division: 'South Atlantic', statisticalArea: 'Atlanta-Sandy Springs-Alpharetta', value: 53, target: 75 }
// ];

// Mock data for Reach Outs component
// const mockReachOutsData = [
//   { id: 1, region: 'Northeast', state: 'MA', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', category: 'Email', value: 120, avgResponseTime: 3.2 },
//   { id: 2, region: 'Northeast', state: 'MA', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', category: 'Call', value: 84, avgResponseTime: 1.5 },
//   { id: 3, region: 'Northeast', state: 'MA', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', category: 'Meeting', value: 28, avgResponseTime: 7.1 },
//   { id: 4, region: 'West', state: 'CA', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', category: 'Email', value: 105, avgResponseTime: 3.8 },
//   { id: 5, region: 'West', state: 'CA', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', category: 'Call', value: 77, avgResponseTime: 1.7 },
//   { id: 6, region: 'West', state: 'CA', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', category: 'Meeting', value: 25, avgResponseTime: 8.2 },
//   { id: 7, region: 'Southeast', state: 'FL', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', category: 'Email', value: 98, avgResponseTime: 4.1 },
//   { id: 8, region: 'Southeast', state: 'FL', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', category: 'Call', value: 65, avgResponseTime: 1.9 },
//   { id: 9, region: 'Southeast', state: 'FL', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', category: 'Meeting', value: 22, avgResponseTime: 7.8 }
// ];

// Mock data for Response Growth chart
// const mockGrowthData = [
//   { id: 1, region: 'Northeast', state: 'MA', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', month: 'Jan', growth: 15, target: 20 },
//   { id: 2, region: 'Northeast', state: 'MA', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', month: 'Feb', growth: 18, target: 20 },
//   { id: 3, region: 'Northeast', state: 'MA', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', month: 'Mar', growth: 22, target: 20 },
//   { id: 4, region: 'Northeast', state: 'MA', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', month: 'Apr', growth: 21, target: 20 },
//   { id: 5, region: 'Northeast', state: 'MA', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', month: 'May', growth: 24, target: 25 },
//   { id: 6, region: 'Northeast', state: 'MA', division: 'New England', statisticalArea: 'Boston-Cambridge-Newton', month: 'Jun', growth: 28, target: 25 },
//   { id: 7, region: 'West', state: 'CA', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', month: 'Jan', growth: 17, target: 22 },
//   { id: 8, region: 'West', state: 'CA', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', month: 'Feb', growth: 20, target: 22 },
//   { id: 9, region: 'West', state: 'CA', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', month: 'Mar', growth: 24, target: 22 },
//   { id: 10, region: 'West', state: 'CA', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', month: 'Apr', growth: 22, target: 22 },
//   { id: 11, region: 'West', state: 'CA', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', month: 'May', growth: 26, target: 27 },
//   { id: 12, region: 'West', state: 'CA', division: 'Pacific', statisticalArea: 'Los Angeles-Long Beach-Anaheim', month: 'Jun', growth: 30, target: 27 },
//   { id: 13, region: 'Southeast', state: 'FL', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', month: 'Jan', growth: 12, target: 18 },
//   { id: 14, region: 'Southeast', state: 'FL', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', month: 'Feb', growth: 15, target: 18 },
//   { id: 15, region: 'Southeast', state: 'FL', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', month: 'Mar', growth: 19, target: 18 },
//   { id: 16, region: 'Southeast', state: 'FL', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', month: 'Apr', growth: 18, target: 18 },
//   { id: 17, region: 'Southeast', state: 'FL', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', month: 'May', growth: 22, target: 23 },
//   { id: 18, region: 'Southeast', state: 'FL', division: 'South Atlantic', statisticalArea: 'Miami-Fort Lauderdale-West Palm Beach', month: 'Jun', growth: 25, target: 23 }
// ];

const Dashboard = ({ onNavigateBack }) => {
  const [selectedStage, setSelectedStage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStageDetail, setShowStageDetail] = useState(false);

  // Filter data based on search query
  const filterDataBySearch = (data) => {
    if (!searchQuery.trim()) return data;
    if (!data) return data;
    
    const query = searchQuery.toLowerCase().trim();
    
    // Check if data is an array
    if (Array.isArray(data)) {
      return data.filter(item => {
        // Filter by division name
        if (item.division && item.division.toLowerCase().includes(query)) return true;
        // Filter by statistical area
        if (item.statisticalArea && item.statisticalArea.toLowerCase().includes(query)) return true;
        // Filter by region
        if (item.region && item.region.toLowerCase().includes(query)) return true;
        // Filter by state
        if (item.state && item.state.toLowerCase().includes(query)) return true;
        return false;
      });
    }
    
    // If data is an object with properties that are arrays (like mockResponseData)
    if (typeof data === 'object' && data !== null) {
      const result = {};
      
      // Check if it has array properties to filter
      let hasArrayProps = false;
      for (const key in data) {
        if (Array.isArray(data[key])) {
          hasArrayProps = true;
          result[key] = data[key].filter(item => {
            // Filter by division name
            if (item.division && item.division.toLowerCase().includes(query)) return true;
            // Filter by statistical area
            if (item.statisticalArea && item.statisticalArea.toLowerCase().includes(query)) return true;
            // Filter by region
            if (item.region && item.region.toLowerCase().includes(query)) return true;
            // Filter by state
            if (item.state && item.state.toLowerCase().includes(query)) return true;
            // Filter by PG name
            if (item.pgName && item.pgName.toLowerCase().includes(query)) return true;
            return false;
          });
        } else {
          // Keep non-array properties as is
          result[key] = data[key];
        }
      }
      
      return hasArrayProps ? result : data;
    }
    
    // For any other type of data, return as is
    return data;
  };

  // Apply filter to all datasets
  const filteredConnectionsData = filterDataBySearch(mockConnectionsData);
  const filteredReachoutsData = filterDataBySearch(mockReachOutsData);
  const filteredResponseData = filterDataBySearch(mockResponseData);
  const filteredPGGrowthData = filterDataBySearch(mockGrowthData);
  const filteredBiAxialData = filterDataBySearch(mockBiAxialData);

  const handleStageClick = (stage) => {
    setSelectedStage(stage);
    setShowStageDetail(true);
  };

  const handleCloseStageDetail = () => {
    setShowStageDetail(false);
  };

  return (
    <div className="dashboard-container">
      {showStageDetail && selectedStage ? (
        <StageDetailView 
          stage={selectedStage}
          onClose={handleCloseStageDetail}
        />
      ) : (
        <>
          <header className="dashboard-header">
            <div className="header-left">
              <button className="back-button" onClick={onNavigateBack}>
                Back
              </button>
              <h1>PG Acquisition Intelligence</h1>
            </div>
          </header>
          
          <div className="search-container">
            <div className="search-wrapper">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search divisions and statistical areas..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="clear-search-button"
                  onClick={() => setSearchQuery('')}
                >
                  ×
              </button>
              )}
            </div>
            <div className="action-section">
              <button className="action-button" title="Export as CSV">
                <FiDownload />
              </button>
              <button className="action-button" title="View Charts">
                <FiPieChart />
              </button>
            </div>
          </div>
          
          {searchQuery && (
            <div className="search-indicator">
              <div className="search-info">
                Showing results for <strong>"{searchQuery}"</strong>
              </div>
              <button className="clear-search" onClick={() => setSearchQuery('')}>Clear Search</button>
            </div>
          )}
          
          {selectedStage && !showStageDetail && (
            <div className="selection-card">
              <div className="selection-info">
                Currently viewing data for <strong>{selectedStage}</strong> stage
              </div>
              <button className="clear-selection" onClick={() => setSelectedStage(null)}>Clear Filter</button>
            </div>
          )}
          
          <div className="dashboard-grid">
            <div className="card funnel-card">
              <div className="card-header">
                <h2>Acquisition Funnel Stages</h2>
                <div className="card-subtitle">Click on a stage to filter dashboard data</div>
              </div>
              <div className="card-content">
                <FunnelChart onStageClick={handleStageClick} searchQuery={searchQuery} />
              </div>
            </div>
            
            <div className="card distribution-card">
              <div className="card-header">
                <h2>Vertical Distribution & Patient Counts</h2>
                <div className="card-subtitle">Relationship between verticals (PG, CHC, VA) and patient counts</div>
              </div>
              <div className="card-content">
                <BiAxialBarChart data={filteredBiAxialData} />
              </div>
            </div>
            
            <div className="card connections-card">
              <div className="card-header">
                <h2>Connection Types</h2>
                <div className="card-subtitle">Total stakeholder connections broken down by attitude type</div>
              </div>
              <div className="card-content">
                <ConnectionsCard data={filteredConnectionsData} />
              </div>
            </div>
            
            <div className="card reachouts-card">
              <div className="card-header">
                <h2>Reach Out Methods</h2>
                <div className="card-subtitle">Total outreach activities broken down by channel</div>
              </div>
              <div className="card-content">
                <ReachOutsCard data={filteredReachoutsData} />
              </div>
            </div>
            
            <div className="card response-card">
              <div className="card-header">
                <h2>Response Performance</h2>
                <div className="card-subtitle">Response rates by division</div>
              </div>
              <div className="card-content">
                <ResponseChart searchQuery={searchQuery} />
              </div>
            </div>
            
            <div className="card growth-card">
              <div className="card-header">
                <h2>Growth Trend</h2>
                <div className="card-subtitle">PG count by KPI stage over time</div>
              </div>
              <div className="card-content">
                <GrowthChart data={filteredPGGrowthData} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard; 