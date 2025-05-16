import React from 'react';
import './BiAxialBarChart.css';

const BiAxialBarChart = ({ data }) => {
  // Calculate the width percentage for each vertical block
  const getBlockWidthPercentage = (verticals, vertical) => {
    const totalCount = verticals.reduce((sum, v) => sum + v.count, 0);
    return totalCount > 0 ? (vertical.count / totalCount) * 100 : 0;
  };

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
                      title={`${vertical.type} facility`}
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
      
      <div className="chart-axis">
        <div className="tick" style={{ left: '0%' }}>-400</div>
        <div className="tick" style={{ left: '25%' }}>-200</div>
        <div className="tick" style={{ left: '50%' }}>0</div>
        <div className="tick" style={{ left: '75%' }}>200</div>
        <div className="tick" style={{ left: '100%' }}>400</div>
      </div>
    </div>
  );
};

export default BiAxialBarChart; 