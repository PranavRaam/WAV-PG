import React from 'react';
import { FiSearch, FiBarChart2, FiPieChart, FiUsers, FiArrowRight, FiPhone, FiMail, FiLinkedin, FiMoreHorizontal } from 'react-icons/fi';
import './LandingPage.css';

const ResponseVelocityPreview = () => {
  const targetLineColor = 'var(--color-danger, #f87171)';
  const averageLineColor = '#94A3B8';
  
  return (
    <div className="response-velocity-chart">
      <div className="chart-header">
        <h4>Response Velocity by Channel</h4>
      </div>
      <div className="chart-content">
        <div className="chart-channels">
          <div className="channel">
            <div className="channel-icon phone-icon">
              <FiPhone />
            </div>
            <div className="channel-info">
              <div className="channel-name">Phone</div>
              <div className="channel-value">28</div>
            </div>
            <div className="channel-chart">
              <div className="target-line" style={{ top: '46%', backgroundColor: targetLineColor }}>
                <span className="target-label">Target (1.5h)</span>
              </div>
              <div className="average-line" style={{ top: '30%', backgroundColor: averageLineColor }}>
                <span className="average-label">Avg (1.2h)</span>
              </div>
              <div className="data-points">
                <span className="data-point success" style={{ top: '20%', left: '10%' }}></span>
                <span className="data-point success" style={{ top: '25%', left: '30%' }}></span>
                <span className="data-point success" style={{ top: '35%', left: '50%' }}></span>
                <span className="data-point success" style={{ top: '40%', left: '70%' }}></span>
                <span className="data-point success" style={{ top: '45%', left: '90%' }}></span>
              </div>
            </div>
          </div>
          
          <div className="channel">
            <div className="channel-icon email-icon">
              <FiMail />
            </div>
            <div className="channel-info">
              <div className="channel-name">Email</div>
              <div className="channel-value">25</div>
            </div>
            <div className="channel-chart">
              <div className="target-line" style={{ top: '46%', backgroundColor: targetLineColor }}>
                <span className="target-label">Target (4h)</span>
              </div>
              <div className="average-line" style={{ top: '65%', backgroundColor: averageLineColor }}>
                <span className="average-label">Avg (6.3h)</span>
              </div>
              <div className="data-points">
                <span className="data-point warning" style={{ top: '50%', left: '15%' }}></span>
                <span className="data-point warning" style={{ top: '60%', left: '35%' }}></span>
                <span className="data-point danger" style={{ top: '70%', left: '55%' }}></span>
                <span className="data-point warning" style={{ top: '55%', left: '75%' }}></span>
                <span className="data-point danger" style={{ top: '75%', left: '95%' }}></span>
              </div>
            </div>
          </div>
          
          <div className="channel">
            <div className="channel-icon linkedin-icon">
              <FiLinkedin />
            </div>
            <div className="channel-info">
              <div className="channel-name">LinkedIn</div>
              <div className="channel-value">20</div>
            </div>
            <div className="channel-chart">
              <div className="target-line" style={{ top: '46%', backgroundColor: targetLineColor }}>
                <span className="target-label">Target (3h)</span>
              </div>
              <div className="average-line" style={{ top: '50%', backgroundColor: averageLineColor }}>
                <span className="average-label">Avg (3.5h)</span>
              </div>
              <div className="data-points">
                <span className="data-point primary" style={{ top: '40%', left: '20%' }}></span>
                <span className="data-point primary" style={{ top: '45%', left: '40%' }}></span>
                <span className="data-point primary" style={{ top: '55%', left: '60%' }}></span>
                <span className="data-point primary" style={{ top: '50%', left: '80%' }}></span>
              </div>
            </div>
          </div>
          
          <div className="channel">
            <div className="channel-icon other-icon">
              <FiMoreHorizontal />
            </div>
            <div className="channel-info">
              <div className="channel-name">Others</div>
              <div className="channel-value">16</div>
            </div>
            <div className="channel-chart">
              <div className="target-line" style={{ top: '46%', backgroundColor: targetLineColor }}>
                <span className="target-label">Target (6h)</span>
              </div>
              <div className="average-line" style={{ top: '70%', backgroundColor: averageLineColor }}>
                <span className="average-label">Avg (8.2h)</span>
              </div>
              <div className="data-points">
                <span className="data-point danger" style={{ top: '60%', left: '25%' }}></span>
                <span className="data-point danger" style={{ top: '75%', left: '45%' }}></span>
                <span className="data-point danger" style={{ top: '80%', left: '65%' }}></span>
                <span className="data-point danger" style={{ top: '65%', left: '85%' }}></span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: targetLineColor }}></span>
            <span className="legend-text">Target Response Time</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: averageLineColor }}></span>
            <span className="legend-text">Average Response Time</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="landing-container">
      <div className="goals-section">
        <div className="goal-card">
          <h3>Goal 1</h3>
          <div className="goal-progress">30%</div>
        </div>
        <div className="goal-card">
          <h3>Goal 2</h3>
          <div className="goal-progress">40%</div>
        </div>
        <div className="goal-card">
          <h3>Goal 3</h3>
          <div className="goal-progress">50%</div>
        </div>
      </div>
      
      <div className="search-section">
        <h3>Listing of 546</h3>
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
        <div className="search-results">
          No results to display
        </div>
      </div>
      
      <div className="dashboards-section">
        <div className="dashboard-card" onClick={() => onNavigate('pgdashboard')}>
          <h3>PG Acquisition Dashboard</h3>
          <div className="dashboard-preview">
            <div className="funnel-preview">
              <div className="funnel-triangle"></div>
              <div className="hover-info">
                <div className="hover-box">
                  <p>PG: 19</p>
                  <p>CHC: 12</p>
                </div>
              </div>
            </div>
            <div className="graph-preview">
              <svg width="100%" height="100%" viewBox="0 0 100 60">
                <polyline
                  points="0,40 20,30 40,45 60,25 80,35 100,15"
                  fill="none"
                  stroke="var(--color-primary, #0ea5e9)"
                  strokeWidth="2"
                />
                <circle cx="0" cy="40" r="3" fill="var(--color-primary, #0ea5e9)" />
                <circle cx="20" cy="30" r="3" fill="var(--color-primary, #0ea5e9)" />
                <circle cx="40" cy="45" r="3" fill="var(--color-primary, #0ea5e9)" />
                <circle cx="60" cy="25" r="3" fill="var(--color-primary, #0ea5e9)" />
                <circle cx="80" cy="35" r="3" fill="var(--color-primary, #0ea5e9)" />
                <circle cx="100" cy="15" r="3" fill="var(--color-primary, #0ea5e9)" />
              </svg>
            </div>
          </div>
          <div className="dashboard-info">
            <p>Quarterly/Monthly filter based acquired no.</p>
            <div className="view-details">
              View Dashboard <FiArrowRight />
            </div>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Market Analysis Dashboard</h3>
          <div className="dashboard-preview">
            <FiBarChart2 size={40} />
            <span>Market analysis data visualization</span>
          </div>
          <div className="dashboard-info">
            <p>Comprehensive market data and competitive analysis</p>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Response Velocity Dashboard</h3>
          <div className="dashboard-preview">
            <ResponseVelocityPreview />
          </div>
          <div className="dashboard-info">
            <p>Track response times across communication channels</p>
          </div>
        </div>
      </div>
      
      <div className="sidebar-info">
        <h3>Goals, proximity score</h3>
        <p>circle of stages (how many pg, hhah)</p>
      </div>
    </div>
  );
};

export default LandingPage; 