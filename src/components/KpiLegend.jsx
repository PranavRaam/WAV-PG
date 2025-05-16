import React, { useState } from 'react';
import './KpiLegend.css';

const KpiLegend = () => {
  const [expanded, setExpanded] = useState(false);

  const kpiStages = [
    {
      stage: 'Stage 1',
      title: 'Initial Contact & Data Collection',
      criteria: [
        'Data completeness: contacts, practitioners, EHR, billing, patient census',
        'Reach out: minimum 5 times (sum of all channels)'
      ]
    },
    {
      stage: 'Stage 2',
      title: 'Engagement Level',
      criteria: [
        'Average score of total contacts made (40%)'
      ]
    },
    {
      stage: 'Stage 3',
      title: 'Trust Building',
      criteria: [
        'Average trust score greater than or equal to 3 (out of 5)',
        'Minimum 1 promoter',
        'Last engagement duration greater than or equal to 15 minutes'
      ]
    },
    {
      stage: 'Stage 4',
      title: 'Pilot Approval',
      criteria: [
        'Pilot to POC approval turnaround time less than 7 days'
      ]
    },
    {
      stage: 'Stage 5',
      title: 'Full Implementation',
      criteria: [
        'Greater than or equal to 100 active patients'
      ]
    }
  ];

  return (
    <div className={`kpi-legend-container ${expanded ? 'expanded' : ''}`}>
      <div className="legend-header" onClick={() => setExpanded(!expanded)}>
        <h3>KPI Stages Legend</h3>
        <button className="toggle-button">{expanded ? '−' : '+'}</button>
      </div>
      
      {expanded && (
        <div className="legend-content">
          {kpiStages.map((kpi, index) => (
            <div key={index} className="legend-item">
              <div className="legend-stage-header">
                <span className="stage-badge">{kpi.stage}</span>
                <span className="stage-title">{kpi.title}</span>
              </div>
              <ul className="stage-criteria">
                {kpi.criteria.map((criterion, idx) => (
                  <li key={idx}>{criterion}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KpiLegend; 