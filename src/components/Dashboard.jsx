import React, { useState, useEffect } from 'react';
import FunnelChart from './FunnelChart';
import BiAxialBarChart from './BiAxialBarChart';
import ConnectionsCard from './ConnectionsCard';
import ReachOutsCard from './ReachOutsCard';
import GrowthChart from './GrowthChart';
import ResponseChart from './ResponseChart';
import { FiFilter, FiCalendar, FiMap, FiActivity, FiRefreshCw, FiDownload, FiPieChart } from 'react-icons/fi';
import './Dashboard.css';

// Mock data
const mockBiAxialData = [
  {
    verticals: [{ type: 'PG', count: 20 }, { type: 'CHC', count: 10 }, { type: 'VA', count: 5 }],
    verticalWidth: 40,
    patients: 400,
    patientWidth: 40
  },
  {
    verticals: [{ type: 'PG', count: 180 }, { type: 'CHC', count: 100 }],
    verticalWidth: 35,
    patients: 300,
    patientWidth: 30
  },
  {
    verticals: [{ type: 'PG', count: 300 }],
    verticalWidth: 30,
    patients: 200,
    patientWidth: 20
  },
  {
    verticals: [{ type: 'PG', count: 200 }],
    verticalWidth: 25,
    patients: 180,
    patientWidth: 18
  }
];

const mockConnectionsData = {
  total: 90,
  promoters: 30,
  neutral: 30,
  blockers: 30,
  metrics: {
    promoters: {
      conversionRate: 25,
      trustScore: 85,
      influenceDensity: 40,
      engagementFrequency: 3.4,
      changeRate: '+12%'
    },
    neutral: {
      conversionRate: 15,
      trustScore: 65,
      influenceDensity: 20,
      engagementFrequency: 2.1,
      changeRate: '-3%'
    },
    blockers: {
      conversionRate: 5,
      trustScore: 35,
      influenceDensity: 10,
      engagementFrequency: 1.2,
      changeRate: '-8%'
    }
  }
};

const mockReachOutsData = {
  total: 120,
  calls: 30,
  emails: 30,
  linkedin: 30,
  others: 30,
  metrics: {
    calls: {
      responseRate: 40,
      avgResponseTime: 1.2,
      positiveResponseRate: 70,
      conversionRate: 15,
      failRate: 5
    },
    emails: {
      responseRate: 25,
      avgResponseTime: 4.5,
      positiveResponseRate: 60,
      conversionRate: 12,
      bounceRate: 8
    },
    linkedin: {
      responseRate: 35,
      avgResponseTime: 3.5,
      positiveResponseRate: 75,
      conversionRate: 10,
      failRate: 2
    },
    others: {
      responseRate: 20,
      avgResponseTime: 6.0,
      positiveResponseRate: 55,
      conversionRate: 8,
      failRate: 10
    }
  }
};

const mockGrowthData = {
  weeks: [
    { name: 'Week 1', value: 200, stage: 'Stage 1' },
    { name: 'Week 2', value: 280, stage: 'Stage 1' },
    { name: 'Week 3', value: 300, stage: 'Stage 1' },
    { name: 'Week 4', value: 340, stage: 'Stage 1' },
    { name: 'Week 5', value: 380, stage: 'Stage 1' },
    { name: 'Week 6', value: 450, stage: 'Stage 1' },
    { name: 'Week 7', value: 480, stage: 'Stage 1' },
    { name: 'Week 8', value: 520, stage: 'Stage 1' },
    { name: 'Week 9', value: 600, stage: 'Stage 1' },
    { name: 'Week 10', value: 550, stage: 'Stage 1' },
    { name: 'Week 11', value: 580, stage: 'Stage 1' },
    { name: 'Week 12', value: 500, stage: 'Stage 1' },
    
    { name: 'Week 1', value: 150, stage: 'Stage 2' },
    { name: 'Week 2', value: 200, stage: 'Stage 2' },
    { name: 'Week 3', value: 230, stage: 'Stage 2' },
    { name: 'Week 4', value: 250, stage: 'Stage 2' },
    { name: 'Week 5', value: 300, stage: 'Stage 2' },
    { name: 'Week 6', value: 350, stage: 'Stage 2' },
    { name: 'Week 7', value: 380, stage: 'Stage 2' },
    { name: 'Week 8', value: 420, stage: 'Stage 2' },
    { name: 'Week 9', value: 480, stage: 'Stage 2' },
    { name: 'Week 10', value: 450, stage: 'Stage 2' },
    { name: 'Week 11', value: 470, stage: 'Stage 2' },
    { name: 'Week 12', value: 420, stage: 'Stage 2' },
    
    { name: 'Week 1', value: 100, stage: 'Stage 3' },
    { name: 'Week 2', value: 150, stage: 'Stage 3' },
    { name: 'Week 3', value: 180, stage: 'Stage 3' },
    { name: 'Week 4', value: 200, stage: 'Stage 3' },
    { name: 'Week 5', value: 240, stage: 'Stage 3' },
    { name: 'Week 6', value: 280, stage: 'Stage 3' },
    { name: 'Week 7', value: 310, stage: 'Stage 3' },
    { name: 'Week 8', value: 340, stage: 'Stage 3' },
    { name: 'Week 9', value: 390, stage: 'Stage 3' },
    { name: 'Week 10', value: 370, stage: 'Stage 3' },
    { name: 'Week 11', value: 380, stage: 'Stage 3' },
    { name: 'Week 12', value: 350, stage: 'Stage 3' },
    
    { name: 'Week 1', value: 80, stage: 'Stage 4' },
    { name: 'Week 2', value: 120, stage: 'Stage 4' },
    { name: 'Week 3', value: 140, stage: 'Stage 4' },
    { name: 'Week 4', value: 160, stage: 'Stage 4' },
    { name: 'Week 5', value: 190, stage: 'Stage 4' },
    { name: 'Week 6', value: 220, stage: 'Stage 4' },
    { name: 'Week 7', value: 240, stage: 'Stage 4' },
    { name: 'Week 8', value: 270, stage: 'Stage 4' },
    { name: 'Week 9', value: 310, stage: 'Stage 4' },
    { name: 'Week 10', value: 290, stage: 'Stage 4' },
    { name: 'Week 11', value: 300, stage: 'Stage 4' },
    { name: 'Week 12', value: 280, stage: 'Stage 4' },
    
    { name: 'Week 1', value: 50, stage: 'Stage 5' },
    { name: 'Week 2', value: 80, stage: 'Stage 5' },
    { name: 'Week 3', value: 100, stage: 'Stage 5' },
    { name: 'Week 4', value: 120, stage: 'Stage 5' },
    { name: 'Week 5', value: 140, stage: 'Stage 5' },
    { name: 'Week 6', value: 170, stage: 'Stage 5' },
    { name: 'Week 7', value: 190, stage: 'Stage 5' },
    { name: 'Week 8', value: 210, stage: 'Stage 5' },
    { name: 'Week 9', value: 240, stage: 'Stage 5' },
    { name: 'Week 10', value: 220, stage: 'Stage 5' },
    { name: 'Week 11', value: 230, stage: 'Stage 5' },
    { name: 'Week 12', value: 210, stage: 'Stage 5' },
  ],
  months: [
    { name: 'Jan', value: 200, stage: 'Stage 1' },
    { name: 'Feb', value: 280, stage: 'Stage 1' },
    { name: 'Mar', value: 300, stage: 'Stage 1' },
    { name: 'Apr', value: 450, stage: 'Stage 1' },
    { name: 'May', value: 520, stage: 'Stage 1' },
    { name: 'Jun', value: 600, stage: 'Stage 1' },
    { name: 'Jul', value: 650, stage: 'Stage 1' },
    { name: 'Aug', value: 700, stage: 'Stage 1' },
    { name: 'Sep', value: 850, stage: 'Stage 1' },
    { name: 'Oct', value: 800, stage: 'Stage 1' },
    { name: 'Nov', value: 830, stage: 'Stage 1' },
    { name: 'Dec', value: 780, stage: 'Stage 1' },
    
    { name: 'Jan', value: 150, stage: 'Stage 2' },
    { name: 'Feb', value: 220, stage: 'Stage 2' },
    { name: 'Mar', value: 250, stage: 'Stage 2' },
    { name: 'Apr', value: 380, stage: 'Stage 2' },
    { name: 'May', value: 440, stage: 'Stage 2' },
    { name: 'Jun', value: 500, stage: 'Stage 2' },
    { name: 'Jul', value: 540, stage: 'Stage 2' },
    { name: 'Aug', value: 580, stage: 'Stage 2' },
    { name: 'Sep', value: 700, stage: 'Stage 2' },
    { name: 'Oct', value: 650, stage: 'Stage 2' },
    { name: 'Nov', value: 680, stage: 'Stage 2' },
    { name: 'Dec', value: 640, stage: 'Stage 2' },
    
    { name: 'Jan', value: 100, stage: 'Stage 3' },
    { name: 'Feb', value: 160, stage: 'Stage 3' },
    { name: 'Mar', value: 190, stage: 'Stage 3' },
    { name: 'Apr', value: 300, stage: 'Stage 3' },
    { name: 'May', value: 350, stage: 'Stage 3' },
    { name: 'Jun', value: 400, stage: 'Stage 3' },
    { name: 'Jul', value: 430, stage: 'Stage 3' },
    { name: 'Aug', value: 460, stage: 'Stage 3' },
    { name: 'Sep', value: 550, stage: 'Stage 3' },
    { name: 'Oct', value: 520, stage: 'Stage 3' },
    { name: 'Nov', value: 540, stage: 'Stage 3' },
    { name: 'Dec', value: 510, stage: 'Stage 3' },
    
    { name: 'Jan', value: 70, stage: 'Stage 4' },
    { name: 'Feb', value: 120, stage: 'Stage 4' },
    { name: 'Mar', value: 150, stage: 'Stage 4' },
    { name: 'Apr', value: 240, stage: 'Stage 4' },
    { name: 'May', value: 280, stage: 'Stage 4' },
    { name: 'Jun', value: 320, stage: 'Stage 4' },
    { name: 'Jul', value: 350, stage: 'Stage 4' },
    { name: 'Aug', value: 370, stage: 'Stage 4' },
    { name: 'Sep', value: 440, stage: 'Stage 4' },
    { name: 'Oct', value: 420, stage: 'Stage 4' },
    { name: 'Nov', value: 430, stage: 'Stage 4' },
    { name: 'Dec', value: 410, stage: 'Stage 4' },
    
    { name: 'Jan', value: 40, stage: 'Stage 5' },
    { name: 'Feb', value: 80, stage: 'Stage 5' },
    { name: 'Mar', value: 100, stage: 'Stage 5' },
    { name: 'Apr', value: 170, stage: 'Stage 5' },
    { name: 'May', value: 200, stage: 'Stage 5' },
    { name: 'Jun', value: 230, stage: 'Stage 5' },
    { name: 'Jul', value: 250, stage: 'Stage 5' },
    { name: 'Aug', value: 270, stage: 'Stage 5' },
    { name: 'Sep', value: 320, stage: 'Stage 5' },
    { name: 'Oct', value: 300, stage: 'Stage 5' },
    { name: 'Nov', value: 310, stage: 'Stage 5' },
    { name: 'Dec', value: 290, stage: 'Stage 5' },
  ],
  quarters: [
    { name: 'Q1', value: 300, stage: 'Stage 1' },
    { name: 'Q2', value: 600, stage: 'Stage 1' },
    { name: 'Q3', value: 850, stage: 'Stage 1' },
    { name: 'Q4', value: 780, stage: 'Stage 1' },
    
    { name: 'Q1', value: 250, stage: 'Stage 2' },
    { name: 'Q2', value: 500, stage: 'Stage 2' },
    { name: 'Q3', value: 700, stage: 'Stage 2' },
    { name: 'Q4', value: 640, stage: 'Stage 2' },
    
    { name: 'Q1', value: 190, stage: 'Stage 3' },
    { name: 'Q2', value: 400, stage: 'Stage 3' },
    { name: 'Q3', value: 550, stage: 'Stage 3' },
    { name: 'Q4', value: 510, stage: 'Stage 3' },
    
    { name: 'Q1', value: 150, stage: 'Stage 4' },
    { name: 'Q2', value: 320, stage: 'Stage 4' },
    { name: 'Q3', value: 440, stage: 'Stage 4' },
    { name: 'Q4', value: 410, stage: 'Stage 4' },
    
    { name: 'Q1', value: 100, stage: 'Stage 5' },
    { name: 'Q2', value: 230, stage: 'Stage 5' },
    { name: 'Q3', value: 320, stage: 'Stage 5' },
    { name: 'Q4', value: 290, stage: 'Stage 5' },
  ]
};

const Dashboard = ({ onNavigateBack }) => {
  const [selectedStage, setSelectedStage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleStageClick = (stage) => {
    setSelectedStage(stage);
    // Here you would filter the data based on the selected stage
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refreshing data
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <button className="back-button" onClick={onNavigateBack}>
            Back
          </button>
          <h1>PG Acquisition Intelligence</h1>
        </div>
        
        <div className="header-actions">
          <div className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button 
            className={`refresh-button ${isLoading ? 'loading' : ''}`} 
            onClick={handleRefresh} 
            disabled={isLoading}
          >
            <FiRefreshCw className="refresh-icon" /> {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </header>
      
      <div className="filter-card">
        <div className="filter-section">
          <button className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>
            <FiActivity /> All Data
          </button>
          <button className={`filter-button ${activeFilter === 'region' ? 'active' : ''}`} onClick={() => setActiveFilter('region')}>
            <FiMap /> By Region
          </button>
          <button className={`filter-button ${activeFilter === 'time' ? 'active' : ''}`} onClick={() => setActiveFilter('time')}>
            <FiCalendar /> Last 30 Days
          </button>
          <button className={`filter-button ${activeFilter === 'custom' ? 'active' : ''}`} onClick={() => setActiveFilter('custom')}>
            <FiFilter /> Custom Filter
          </button>
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
      
      {selectedStage && (
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
            <FunnelChart onStageClick={handleStageClick} />
          </div>
        </div>
        
        <div className="card distribution-card">
          <div className="card-header">
            <h2>Vertical Distribution & Patient Counts</h2>
            <div className="card-subtitle">Relationship between verticals (PG, CHC, VA) and patient counts</div>
          </div>
          <div className="card-content">
            <BiAxialBarChart data={mockBiAxialData} />
          </div>
        </div>
        
        <div className="card connections-card">
          <div className="card-header">
            <h2>Connection Types</h2>
            <div className="card-subtitle">Total stakeholder connections broken down by attitude type</div>
          </div>
          <div className="card-content">
            <ConnectionsCard data={mockConnectionsData} />
          </div>
        </div>
        
        <div className="card reachouts-card">
          <div className="card-header">
            <h2>Reach Out Methods</h2>
            <div className="card-subtitle">Total outreach activities broken down by channel</div>
          </div>
          <div className="card-content">
            <ReachOutsCard data={mockReachOutsData} />
          </div>
        </div>
        
        <div className="card response-card">
          <div className="card-header">
            <h2>Response Metrics</h2>
            <div className="card-subtitle">Stakeholder response rates and engagement metrics</div>
          </div>
          <div className="card-content">
            <ResponseChart />
          </div>
        </div>
        
        <div className="card growth-card">
          <div className="card-header">
            <h2>Growth Trend</h2>
            <div className="card-subtitle">PG count by KPI stage over time</div>
          </div>
          <div className="card-content">
            <GrowthChart data={mockGrowthData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 