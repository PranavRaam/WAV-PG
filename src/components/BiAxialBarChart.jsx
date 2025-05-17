import React from 'react';
import './BiAxialBarChart.css';

const BiAxialBarChart = ({ data }) => {
  // Calculate the width percentage for each vertical block
  const getBlockWidthPercentage = (verticals, vertical) => {
    const totalCount = verticals.reduce((sum, v) => sum + v.count, 0);
    return totalCount > 0 ? (vertical.count / totalCount) * 100 : 0;
  };

  if (!data || data.length === 0) {
    return (
      <div className="biaxial-chart-container">
        <div className="no-data-message">
          No matching data found for the current search
        </div>
      </div>
    );
  }

  return (
    <div className="biaxial-chart-container">
      <div className="chart-info">
        This chart shows the relationship between different verticals (PG, CHC, VA) 
        and their associated patient counts. Pink bars represent verticals, blue bars show patient count.
      </div>
      
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-dot vertical-dot"></span>
          <span>Verticals</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot patient-dot"></span>
          <span>No. of patients</span>
        </div>
      </div>
      
      <div className="chart-rows">
        {data.map((item, index) => (
          <div className="chart-row" key={index}>
            <div className="chart-bars" title={`${item.patients} patients total`}>
              <div 
                className="vertical-bar" 
                style={{ width: `${item.verticalWidth}%` }}
              >
                <div className="vertical-blocks">
                  {item.verticals.map((vertical, vIndex) => (
                    <div 
                      className="vertical-block" 
                      key={vIndex} 
                      title={`${vertical.type} facility in ${vertical.division}, ${vertical.statisticalArea}`}
                      style={{ width: `${getBlockWidthPercentage(item.verticals, vertical)}%` }}
                    >
                      {vertical.type}: {vertical.count}
                    </div>
                  ))}
                </div>
              </div>
              <div 
                className="patient-bar" 
                style={{ width: `${item.patientWidth}%` }}
              >
                {item.patients}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Removed chart-axis div to hide scale values */}
    </div>
  );
};

export default BiAxialBarChart; 