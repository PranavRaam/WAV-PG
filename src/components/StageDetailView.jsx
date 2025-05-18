import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiSearch, FiChevronDown, FiInfo, FiArrowRight, FiCheck, FiUser, FiExternalLink, FiPhone, FiMail, FiLinkedin, FiMoreHorizontal, FiCalendar, FiPlus, FiClock, FiCheckCircle, FiFileText, FiUsers, FiTarget, FiRefreshCw } from 'react-icons/fi';
import { MdLocalHospital } from 'react-icons/md';
import './StageDetailView.css';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';
import { mockResponseData, getDateRange, isDateInRange } from './ResponseData';
import TaskTimeline from './TaskTimeline';
import AddTaskModal from './AddTaskModal';

// Map funnel stages to PG stage values
const stageMappings = {
  'Targets': 'TOFU',
  'Outreach': 'Contacted',
  'Pilots': 'MOFU',
  'Onboarded': 'BOFU',
  'Premium': 'Premium'
};

// Reverse mapping for display purposes
const stageDisplayNames = {
  'TOFU': 'Targets',
  'Contacted': 'Outreach',
  'MOFU': 'Pilots',
  'BOFU': 'Onboarded',
  'Premium': 'Premium',
  'All': 'All Stages'
};

// Stage progression data
const stageProgression = {
  'TOFU': { next: 'Contacted', avgDays: 14, threshold: 21 },
  'Contacted': { next: 'MOFU', avgDays: 30, threshold: 45 },
  'MOFU': { next: 'BOFU', avgDays: 45, threshold: 60 },
  'BOFU': { next: 'Premium', avgDays: 60, threshold: 90 },
  'Premium': { next: null, avgDays: null, threshold: null }
};

const StageDetailView = ({ stage, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStages, setSelectedStages] = useState([stageMappings[stage] || 'All']);
  const [selectedMSAs, setSelectedMSAs] = useState(['All']);
  const [selectedVerticals, setSelectedVerticals] = useState(['All']);
  const [selectedTrustScores, setSelectedTrustScores] = useState(['All']);
  
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [showMSADropdown, setShowMSADropdown] = useState(false);
  const [showVerticalDropdown, setShowVerticalDropdown] = useState(false);
  const [showTrustScoreDropdown, setShowTrustScoreDropdown] = useState(false);
  
  const [selectedPG, setSelectedPG] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('quarter');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    type: 'follow-up',
    description: ''
  });
  
  // Mock data for the PG details
  const mockPGData = [
    { 
      id: 1, 
      name: 'Miami Primary Care', 
      msa: 'Miami, FL', 
      vertical: 'Primary', 
      stage: 'BOFU', 
      daysInStage: 45,
      stageDate: '2023-10-15',
      patients: 5200,
      practitioners: { md: 4, npp: 2 }, 
      trustScore: 84, 
      reachOuts: '12/20', 
      engagementROI: '60%',
      acquisitionScore: 91
    },
    { 
      id: 2, 
      name: 'Sunshine Pediatrics', 
      msa: 'Miami, FL', 
      vertical: 'Specialty', 
      stage: 'MOFU', 
      daysInStage: 30,
      stageDate: '2023-10-30',
      patients: 3800,
      practitioners: { md: 3, npp: 1 }, 
      trustScore: 76, 
      reachOuts: '8/15', 
      engagementROI: '53%',
      acquisitionScore: 78
    },
    { 
      id: 3, 
      name: 'Coral Gables Cardiology', 
      msa: 'Miami, FL', 
      vertical: 'Specialty', 
      stage: 'Contacted', 
      daysInStage: 15,
      stageDate: '2023-11-15',
      patients: 2100,
      practitioners: { md: 2, npp: 3 }, 
      trustScore: 92, 
      reachOuts: '18/20', 
      engagementROI: '90%',
      acquisitionScore: 95
    },
    { 
      id: 4, 
      name: 'Brickell Family Medicine', 
      msa: 'Miami, FL', 
      vertical: 'Primary', 
      stage: 'TOFU', 
      daysInStage: 7,
      stageDate: '2023-11-23',
      patients: 1500,
      practitioners: { md: 1, npp: 1 }, 
      trustScore: 45, 
      reachOuts: '3/10', 
      engagementROI: '30%',
      acquisitionScore: 52
    },
    { 
      id: 5, 
      name: 'Doral Medical Group', 
      msa: 'Miami, FL', 
      vertical: 'Primary', 
      stage: 'BOFU', 
      daysInStage: 60,
      stageDate: '2023-09-30',
      patients: 4300,
      practitioners: { md: 3, npp: 2 }, 
      trustScore: 88, 
      reachOuts: '15/20', 
      engagementROI: '75%',
      acquisitionScore: 87
    },
    { 
      id: 6, 
      name: 'South Beach Health', 
      msa: 'Miami, FL', 
      vertical: 'Primary', 
      stage: 'Premium', 
      daysInStage: 90,
      stageDate: '2023-08-30',
      patients: 6800,
      practitioners: { md: 5, npp: 3 }, 
      trustScore: 95, 
      reachOuts: '20/20', 
      engagementROI: '95%',
      acquisitionScore: 98
    },
    { 
      id: 7, 
      name: 'Bayfront Medical Group', 
      msa: 'Miami, FL', 
      vertical: 'Primary', 
      stage: 'MOFU', 
      daysInStage: 42,
      stageDate: '2023-10-20',
      patients: 4100,
      practitioners: { md: 3, npp: 2 }, 
      trustScore: 82, 
      reachOuts: '14/20', 
      engagementROI: '70%',
      acquisitionScore: 85
    }
  ];
  
  // Get all available values for filters
  const allStages = ['All', ...new Set(mockPGData.map(pg => pg.stage))];
  const allMSAs = ['All', ...new Set(mockPGData.map(pg => pg.msa))];
  const allVerticals = ['All', ...new Set(mockPGData.map(pg => pg.vertical))];
  const trustScoreRanges = [
    { id: 'All', label: 'All' },
    { id: 'high', label: 'High (80+)', min: 80, max: 100 },
    { id: 'medium', label: 'Medium (60-79)', min: 60, max: 79 },
    { id: 'low', label: 'Low (Below 60)', min: 0, max: 59 }
  ];
  
  // Filter PGs based on all selected filters
  const filteredPGs = mockPGData.filter(pg => {
    // Search term filter
    const matchesSearch = 
      pg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pg.msa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pg.vertical.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Stage filter
    const matchesStage = selectedStages.includes('All') || selectedStages.includes(pg.stage);
    
    // MSA filter
    const matchesMSA = selectedMSAs.includes('All') || selectedMSAs.includes(pg.msa);
    
    // Vertical filter
    const matchesVertical = selectedVerticals.includes('All') || selectedVerticals.includes(pg.vertical);
    
    // Trust Score filter
    const matchesTrustScore = selectedTrustScores.includes('All') || 
      selectedTrustScores.some(scoreId => {
        const scoreRange = trustScoreRanges.find(range => range.id === scoreId);
        return scoreRange && pg.trustScore >= scoreRange.min && pg.trustScore <= scoreRange.max;
      });
    
    return matchesSearch && matchesStage && matchesMSA && matchesVertical && matchesTrustScore;
  });
  
  // Get stats for the top summary cards based on filtered data
  const totalPatients = filteredPGs.reduce((sum, pg) => sum + pg.patients, 0);
  const practitioners = {
    total: filteredPGs.reduce((sum, pg) => sum + pg.practitioners.md + pg.practitioners.npp, 0),
    md: filteredPGs.reduce((sum, pg) => sum + pg.practitioners.md, 0),
    npp: filteredPGs.reduce((sum, pg) => sum + pg.practitioners.npp, 0)
  };
  const avgTrustScore = filteredPGs.length > 0 
    ? Math.round(filteredPGs.reduce((sum, pg) => sum + pg.trustScore, 0) / filteredPGs.length)
    : 0;
  const bigShotPGs = filteredPGs.filter(pg => pg.acquisitionScore >= 85).length;
  
  // Mock EHR data for PG details
  const ehrSystems = {
    1: { name: 'Epic', verified: true, integrationDetails: [
      { name: 'API Integration', completed: true },
      { name: 'Billing Integration', completed: true },
      { name: 'Direct Document Flow', completed: true }
    ]},
    2: { name: 'Athena', verified: false, integrationDetails: [
      { name: 'API Integration', completed: true },
      { name: 'Billing Integration', completed: false },
      { name: 'Direct Document Flow', completed: false }
    ]},
    3: { name: 'Cerner', verified: true, integrationDetails: [
      { name: 'API Integration', completed: true },
      { name: 'Billing Integration', completed: true },
      { name: 'Direct Document Flow', completed: false }
    ]},
    4: { name: 'eClinicalWorks', verified: false, integrationDetails: [
      { name: 'API Integration', completed: false },
      { name: 'Billing Integration', completed: false },
      { name: 'Direct Document Flow', completed: false }
    ]},
    5: { name: 'Allscripts', verified: true, integrationDetails: [
      { name: 'API Integration', completed: true },
      { name: 'Billing Integration', completed: false },
      { name: 'Direct Document Flow', completed: true }
    ]},
    6: { name: 'Epic', verified: true, integrationDetails: [
      { name: 'API Integration', completed: true },
      { name: 'Billing Integration', completed: true },
      { name: 'Direct Document Flow', completed: true }
    ]},
    7: { name: 'Athena', verified: true, integrationDetails: [
      { name: 'API Integration', completed: true },
      { name: 'Billing Integration', completed: true },
      { name: 'Direct Document Flow', completed: false }
    ]}
  };
  
  // Mock key tactics data
  const keyTactics = {
    1: [
      { text: 'Shared EHR integration video', completed: true },
      { text: 'Hosting joint webinar', completed: true },
      { text: 'Invited to FHIR', completed: false }
    ],
    2: [
      { text: 'Shared EHR integration video', completed: true },
      { text: 'Hosting joint webinar', completed: false },
      { text: 'Demo presentation', completed: true }
    ],
    3: [
      { text: 'Shared EHR integration video', completed: true },
      { text: 'Hosting joint webinar', completed: true },
      { text: 'Demo presentation', completed: true }
    ],
    4: [
      { text: 'Shared EHR integration video', completed: false },
      { text: 'Initial outreach', completed: true }
    ],
    5: [
      { text: 'Shared EHR integration video', completed: true },
      { text: 'Demo presentation', completed: true },
      { text: 'Technical assessment', completed: false }
    ],
    6: [
      { text: 'Shared EHR integration video', completed: true },
      { text: 'Hosting joint webinar', completed: true },
      { text: 'Demo presentation', completed: true },
      { text: 'Technical assessment', completed: true }
    ],
    7: [
      { text: 'Shared EHR integration video', completed: true },
      { text: 'Demo presentation', completed: true },
      { text: 'Technical assessment', completed: true },
      { text: 'Contract discussion', completed: false }
    ]
  };
  
  // Mock pain points data
  const painPoints = {
    1: [
      { text: 'Too costly compared to current solution', severity: 'high', date: 'Oct 15, 2023' },
      { text: 'Unclear which model for CCM services', severity: 'medium', date: 'Oct 20, 2023' },
      { text: 'Worried about compliance risk with RPM', severity: 'high', date: 'Nov 5, 2023' }
    ],
    2: [
      { text: 'Integration timeline too long', severity: 'medium', date: 'Oct 30, 2023' },
      { text: 'Unclear which model for CCM services', severity: 'low', date: 'Nov 10, 2023' }
    ],
    3: [
      { text: 'Too costly compared to current solution', severity: 'high', date: 'Nov 15, 2023' }
    ],
    4: [
      { text: 'Unclear which model for CCM services', severity: 'low', date: 'Nov 23, 2023' }
    ],
    5: [
      { text: 'Integration timeline too long', severity: 'high', date: 'Sep 30, 2023' },
      { text: 'Worried about compliance risk with RPM', severity: 'medium', date: 'Oct 15, 2023' }
    ],
    6: [
      { text: 'Staff training concerns', severity: 'low', date: 'Aug 15, 2023' }
    ],
    7: [
      { text: 'Integration timeline too long', severity: 'medium', date: 'Oct 15, 2023' },
      { text: 'Concerned about data migration', severity: 'high', date: 'Oct 30, 2023' }
    ]
  };
  
  // Mock KPI data for the selected PG over time
  const mockKpiData = {
    quarter: [
      { name: 'Q1', 'Stage 1': 200, 'Stage 2': 150, 'Stage 3': 100, 'Stage 4': 80, 'Stage 5': 50 },
      { name: 'Q2', 'Stage 1': 300, 'Stage 2': 230, 'Stage 3': 180, 'Stage 4': 140, 'Stage 5': 100 },
      { name: 'Q3', 'Stage 1': 450, 'Stage 2': 350, 'Stage 3': 280, 'Stage 4': 220, 'Stage 5': 170 },
      { name: 'Q4', 'Stage 1': 520, 'Stage 2': 420, 'Stage 3': 350, 'Stage 4': 270, 'Stage 5': 210 }
    ],
    month: [
      { name: 'Jan', 'Stage 1': 200, 'Stage 2': 150, 'Stage 3': 100, 'Stage 4': 80, 'Stage 5': 50 },
      { name: 'Feb', 'Stage 1': 250, 'Stage 2': 180, 'Stage 3': 120, 'Stage 4': 100, 'Stage 5': 80 },
      { name: 'Mar', 'Stage 1': 280, 'Stage 2': 220, 'Stage 3': 150, 'Stage 4': 120, 'Stage 5': 100 },
      { name: 'Apr', 'Stage 1': 350, 'Stage 2': 280, 'Stage 3': 200, 'Stage 4': 160, 'Stage 5': 120 },
      { name: 'May', 'Stage 1': 420, 'Stage 2': 330, 'Stage 3': 250, 'Stage 4': 200, 'Stage 5': 150 },
      { name: 'Jun', 'Stage 1': 480, 'Stage 2': 380, 'Stage 3': 280, 'Stage 4': 220, 'Stage 5': 170 },
      { name: 'Jul', 'Stage 1': 520, 'Stage 2': 410, 'Stage 3': 300, 'Stage 4': 240, 'Stage 5': 190 },
      { name: 'Aug', 'Stage 1': 580, 'Stage 2': 450, 'Stage 3': 340, 'Stage 4': 270, 'Stage 5': 210 },
      { name: 'Sep', 'Stage 1': 650, 'Stage 2': 500, 'Stage 3': 380, 'Stage 4': 300, 'Stage 5': 240 },
      { name: 'Oct', 'Stage 1': 620, 'Stage 2': 480, 'Stage 3': 360, 'Stage 4': 290, 'Stage 5': 230 },
      { name: 'Nov', 'Stage 1': 640, 'Stage 2': 490, 'Stage 3': 370, 'Stage 4': 300, 'Stage 5': 240 },
      { name: 'Dec', 'Stage 1': 600, 'Stage 2': 470, 'Stage 3': 350, 'Stage 4': 280, 'Stage 5': 230 }
    ],
    week: [
      { name: 'W1', 'Stage 1': 180, 'Stage 2': 140, 'Stage 3': 90, 'Stage 4': 70, 'Stage 5': 40 },
      { name: 'W2', 'Stage 1': 190, 'Stage 2': 145, 'Stage 3': 95, 'Stage 4': 75, 'Stage 5': 45 },
      { name: 'W3', 'Stage 1': 200, 'Stage 2': 150, 'Stage 3': 100, 'Stage 4': 80, 'Stage 5': 50 },
      { name: 'W4', 'Stage 1': 220, 'Stage 2': 170, 'Stage 3': 110, 'Stage 4': 90, 'Stage 5': 60 },
      { name: 'W5', 'Stage 1': 240, 'Stage 2': 190, 'Stage 3': 130, 'Stage 4': 100, 'Stage 5': 70 },
      { name: 'W6', 'Stage 1': 270, 'Stage 2': 210, 'Stage 3': 150, 'Stage 4': 120, 'Stage 5': 80 },
      { name: 'W7', 'Stage 1': 300, 'Stage 2': 230, 'Stage 3': 170, 'Stage 4': 140, 'Stage 5': 90 },
      { name: 'W8', 'Stage 1': 330, 'Stage 2': 260, 'Stage 3': 190, 'Stage 4': 150, 'Stage 5': 100 },
      { name: 'W9', 'Stage 1': 360, 'Stage 2': 280, 'Stage 3': 210, 'Stage 4': 170, 'Stage 5': 120 },
      { name: 'W10', 'Stage 1': 390, 'Stage 2': 310, 'Stage 3': 230, 'Stage 4': 190, 'Stage 5': 140 },
      { name: 'W11', 'Stage 1': 420, 'Stage 2': 330, 'Stage 3': 250, 'Stage 4': 200, 'Stage 5': 160 },
      { name: 'W12', 'Stage 1': 450, 'Stage 2': 350, 'Stage 3': 270, 'Stage 4': 220, 'Stage 5': 180 }
    ]
  };
  
  // Mock data for individual PG metrics over time
  const mockPGMetricsData = {
    1: { // Miami Primary Care
      quarter: [
        { name: 'Q1', 'Patients': 3200, 'TrustScore': 65, 'Engagement': 35 },
        { name: 'Q2', 'Patients': 4100, 'TrustScore': 72, 'Engagement': 48 },
        { name: 'Q3', 'Patients': 4800, 'TrustScore': 78, 'Engagement': 62 },
        { name: 'Q4', 'Patients': 5200, 'TrustScore': 84, 'Engagement': 75 }
      ],
      month: [
        { name: 'Jan', 'Patients': 3200, 'TrustScore': 65, 'Engagement': 35 },
        { name: 'Feb', 'Patients': 3400, 'TrustScore': 67, 'Engagement': 38 },
        { name: 'Mar', 'Patients': 3600, 'TrustScore': 68, 'Engagement': 40 },
        { name: 'Apr', 'Patients': 3800, 'TrustScore': 70, 'Engagement': 42 },
        { name: 'May', 'Patients': 4100, 'TrustScore': 72, 'Engagement': 48 },
        { name: 'Jun', 'Patients': 4300, 'TrustScore': 74, 'Engagement': 52 },
        { name: 'Jul', 'Patients': 4500, 'TrustScore': 75, 'Engagement': 55 },
        { name: 'Aug', 'Patients': 4800, 'TrustScore': 78, 'Engagement': 62 },
        { name: 'Sep', 'Patients': 4900, 'TrustScore': 80, 'Engagement': 65 },
        { name: 'Oct', 'Patients': 5000, 'TrustScore': 82, 'Engagement': 70 },
        { name: 'Nov', 'Patients': 5100, 'TrustScore': 83, 'Engagement': 72 },
        { name: 'Dec', 'Patients': 5200, 'TrustScore': 84, 'Engagement': 75 }
      ],
      week: [
        { name: 'W1', 'Patients': 5150, 'TrustScore': 83, 'Engagement': 73 },
        { name: 'W2', 'Patients': 5170, 'TrustScore': 83, 'Engagement': 73 },
        { name: 'W3', 'Patients': 5180, 'TrustScore': 84, 'Engagement': 74 },
        { name: 'W4', 'Patients': 5200, 'TrustScore': 84, 'Engagement': 75 }
      ]
    },
    2: { // Sunshine Pediatrics
      quarter: [
        { name: 'Q1', 'Patients': 2200, 'TrustScore': 60, 'Engagement': 30 },
        { name: 'Q2', 'Patients': 2800, 'TrustScore': 68, 'Engagement': 40 },
        { name: 'Q3', 'Patients': 3400, 'TrustScore': 72, 'Engagement': 45 },
        { name: 'Q4', 'Patients': 3800, 'TrustScore': 76, 'Engagement': 53 }
      ],
      month: [
        { name: 'Jan', 'Patients': 2200, 'TrustScore': 60, 'Engagement': 30 },
        { name: 'Feb', 'Patients': 2400, 'TrustScore': 62, 'Engagement': 32 },
        { name: 'Mar', 'Patients': 2600, 'TrustScore': 65, 'Engagement': 35 },
        { name: 'Apr', 'Patients': 2800, 'TrustScore': 68, 'Engagement': 40 },
        { name: 'May', 'Patients': 3000, 'TrustScore': 70, 'Engagement': 42 },
        { name: 'Jun', 'Patients': 3100, 'TrustScore': 70, 'Engagement': 42 },
        { name: 'Jul', 'Patients': 3200, 'TrustScore': 71, 'Engagement': 43 },
        { name: 'Aug', 'Patients': 3400, 'TrustScore': 72, 'Engagement': 45 },
        { name: 'Sep', 'Patients': 3500, 'TrustScore': 73, 'Engagement': 48 },
        { name: 'Oct', 'Patients': 3600, 'TrustScore': 74, 'Engagement': 50 },
        { name: 'Nov', 'Patients': 3700, 'TrustScore': 75, 'Engagement': 52 },
        { name: 'Dec', 'Patients': 3800, 'TrustScore': 76, 'Engagement': 53 }
      ],
      week: [
        { name: 'W1', 'Patients': 3750, 'TrustScore': 75, 'Engagement': 52 },
        { name: 'W2', 'Patients': 3760, 'TrustScore': 75, 'Engagement': 52 },
        { name: 'W3', 'Patients': 3780, 'TrustScore': 76, 'Engagement': 53 },
        { name: 'W4', 'Patients': 3800, 'TrustScore': 76, 'Engagement': 53 }
      ]
    },
    // Add similar data for other PGs (3-6)
    3: { // Coral Gables Cardiology
      quarter: [
        { name: 'Q1', 'Patients': 1500, 'TrustScore': 78, 'Engagement': 60 },
        { name: 'Q2', 'Patients': 1800, 'TrustScore': 85, 'Engagement': 72 },
        { name: 'Q3', 'Patients': 2000, 'TrustScore': 90, 'Engagement': 85 },
        { name: 'Q4', 'Patients': 2100, 'TrustScore': 92, 'Engagement': 90 }
      ],
      month: [
        { name: 'Jan', 'Patients': 1500, 'TrustScore': 78, 'Engagement': 60 },
        { name: 'Feb', 'Patients': 1600, 'TrustScore': 80, 'Engagement': 65 },
        { name: 'Mar', 'Patients': 1700, 'TrustScore': 82, 'Engagement': 68 },
        { name: 'Apr', 'Patients': 1800, 'TrustScore': 85, 'Engagement': 72 },
        { name: 'May', 'Patients': 1850, 'TrustScore': 87, 'Engagement': 75 },
        { name: 'Jun', 'Patients': 1900, 'TrustScore': 88, 'Engagement': 78 },
        { name: 'Jul', 'Patients': 1950, 'TrustScore': 89, 'Engagement': 80 },
        { name: 'Aug', 'Patients': 2000, 'TrustScore': 90, 'Engagement': 85 },
        { name: 'Sep', 'Patients': 2050, 'TrustScore': 91, 'Engagement': 88 },
        { name: 'Oct', 'Patients': 2080, 'TrustScore': 91, 'Engagement': 88 },
        { name: 'Nov', 'Patients': 2100, 'TrustScore': 92, 'Engagement': 90 },
        { name: 'Dec', 'Patients': 2100, 'TrustScore': 92, 'Engagement': 90 }
      ],
      week: [
        { name: 'W1', 'Patients': 2080, 'TrustScore': 91, 'Engagement': 88 },
        { name: 'W2', 'Patients': 2090, 'TrustScore': 91, 'Engagement': 89 },
        { name: 'W3', 'Patients': 2100, 'TrustScore': 92, 'Engagement': 90 },
        { name: 'W4', 'Patients': 2100, 'TrustScore': 92, 'Engagement': 90 }
      ]
    },
    // Add data for PG 7
    7: { // Bayfront Medical Group
      quarter: [
        { name: 'Q1', 'Patients': 2800, 'TrustScore': 70, 'Engagement': 45 },
        { name: 'Q2', 'Patients': 3200, 'TrustScore': 75, 'Engagement': 55 },
        { name: 'Q3', 'Patients': 3700, 'TrustScore': 80, 'Engagement': 65 },
        { name: 'Q4', 'Patients': 4100, 'TrustScore': 82, 'Engagement': 70 }
      ],
      month: [
        { name: 'Jan', 'Patients': 2800, 'TrustScore': 70, 'Engagement': 45 },
        { name: 'Feb', 'Patients': 2900, 'TrustScore': 71, 'Engagement': 48 },
        { name: 'Mar', 'Patients': 3000, 'TrustScore': 72, 'Engagement': 50 },
        { name: 'Apr', 'Patients': 3200, 'TrustScore': 75, 'Engagement': 55 },
        { name: 'May', 'Patients': 3300, 'TrustScore': 76, 'Engagement': 58 },
        { name: 'Jun', 'Patients': 3400, 'TrustScore': 77, 'Engagement': 60 },
        { name: 'Jul', 'Patients': 3500, 'TrustScore': 78, 'Engagement': 62 },
        { name: 'Aug', 'Patients': 3700, 'TrustScore': 80, 'Engagement': 65 },
        { name: 'Sep', 'Patients': 3800, 'TrustScore': 80, 'Engagement': 66 },
        { name: 'Oct', 'Patients': 3900, 'TrustScore': 81, 'Engagement': 68 },
        { name: 'Nov', 'Patients': 4000, 'TrustScore': 82, 'Engagement': 69 },
        { name: 'Dec', 'Patients': 4100, 'TrustScore': 82, 'Engagement': 70 }
      ],
      week: [
        { name: 'W1', 'Patients': 4000, 'TrustScore': 81, 'Engagement': 68 },
        { name: 'W2', 'Patients': 4050, 'TrustScore': 82, 'Engagement': 69 },
        { name: 'W3', 'Patients': 4080, 'TrustScore': 82, 'Engagement': 69 },
        { name: 'W4', 'Patients': 4100, 'TrustScore': 82, 'Engagement': 70 }
      ]
    }
  };
  
  // Add default data for any PG that might not have specific data
  const defaultPGMetrics = {
    quarter: [
      { name: 'Q1', 'Patients': 1000, 'TrustScore': 50, 'Engagement': 20 },
      { name: 'Q2', 'Patients': 1200, 'TrustScore': 55, 'Engagement': 25 },
      { name: 'Q3', 'Patients': 1400, 'TrustScore': 60, 'Engagement': 30 },
      { name: 'Q4', 'Patients': 1500, 'TrustScore': 65, 'Engagement': 35 }
    ],
    month: [
      { name: 'Jan', 'Patients': 1000, 'TrustScore': 50, 'Engagement': 20 },
      { name: 'Dec', 'Patients': 1500, 'TrustScore': 65, 'Engagement': 35 }
    ],
    week: [
      { name: 'W1', 'Patients': 1450, 'TrustScore': 63, 'Engagement': 33 },
      { name: 'W4', 'Patients': 1500, 'TrustScore': 65, 'Engagement': 35 }
    ]
  };
  
  // Add stage duration data for PGs and average
  const stageDurationData = {
    1: { // Miami Primary Care
      'Targets': 15,
      'Outreach': 25,
      'Pilots': 30,
      'Onboarded': 20,
      'Premium': 10,
      'totalDays': 100,
      'longestStage': 'Pilots',
      'longestStageDays': 30,
      'bottleneck': 'Pilots'
    },
    2: { // Sunshine Pediatrics
      'Targets': 12,
      'Outreach': 22,
      'Pilots': 28,
      'Onboarded': 18,
      'Premium': 8,
      'totalDays': 88,
      'longestStage': 'Pilots',
      'longestStageDays': 28,
      'bottleneck': 'Pilots'
    },
    3: { // Coral Gables Cardiology
      'Targets': 18,
      'Outreach': 28,
      'Pilots': 35,
      'Onboarded': 25,
      'Premium': 12,
      'totalDays': 118,
      'longestStage': 'Pilots',
      'longestStageDays': 35,
      'bottleneck': 'Pilots'
    },
    // Average across all PGs
    'average': {
      'Targets': 12,
      'Outreach': 18,
      'Pilots': 25,
      'Onboarded': 20,
      'Premium': 15,
      'totalDays': 90,
      'longestStage': 'Pilots',
      'longestStageDays': 25
    },
    // Add data for PG 7
    7: {
      'Targets': 14,
      'Outreach': 20,
      'Pilots': 28,
      'Onboarded': 0,
      'Premium': 0,
      'totalDays': 62,
      'longestStage': 'Pilots',
      'longestStageDays': 28,
      'bottleneck': 'Pilots'
    }
  };
  
  // Default stage duration data for any PG that might not have specific data
  const defaultStageDuration = {
    'Targets': 10,
    'Outreach': 15,
    'Pilots': 20,
    'Onboarded': 15,
    'Premium': 10,
    'totalDays': 70,
    'longestStage': 'Pilots',
    'longestStageDays': 20,
    'bottleneck': 'Pilots'
  };
  
  // PG metrics colors
  const pgMetricsColors = {
    'Patients': '#0ea5e9',
    'TrustScore': '#10b981',
    'Engagement': '#f59e0b'
  };
  
  // Stage colors matching the image
  const stageColors = {
    'Stage 1': '#ef4444',
    'Stage 2': '#fb7185', 
    'Stage 3': '#fbbf24',
    'Stage 4': '#10b981',
    'Stage 5': '#0ea5e9'
  };
  
  // KPI descriptions and thresholds
  const kpiInfo = {
    trustScore: {
      description: 'Stakeholder Trust Score',
      threshold: 80,
      unit: ''
    },
    responseRate: {
      description: 'Response Rate to Outreach',
      threshold: 60,
      unit: '%'
    },
    engagement: {
      description: 'Engagement Duration',
      threshold: 50,
      unit: 'min'
    },
    acquisitionScore: {
      description: 'Overall Acquisition Score',
      threshold: 85,
      unit: ''
    }
  };
  
  // Milestone data based on the selected PG
  const milestones = [
    { name: 'Deck Sent', date: 'Feb 15, 2023', position: '30%' },
    { name: 'Demo', date: 'Apr 10, 2023', position: '65%' },
    { name: 'Pilot Started', date: 'May 22, 2023', position: '85%' }
  ];
  
  // Helper function to handle multi-select filter changes
  const handleFilterChange = (value, selectedValues, setSelectedValues) => {
    if (value === 'All') {
      // If "All" is selected, clear all other selections
      setSelectedValues(['All']);
    } else {
      // Handle adding/removing values
      let newValues = [...selectedValues];
      
      // Always remove "All" when selecting a specific value
      newValues = newValues.filter(v => v !== 'All');
      
      if (selectedValues.includes(value)) {
        // Remove the value if already selected
        newValues = newValues.filter(v => v !== value);
      } else {
        // Add the value
        newValues.push(value);
      }
      
      // If no values selected, default back to "All"
      if (newValues.length === 0) {
        newValues = ['All'];
      }
      
      setSelectedValues(newValues);
    }
  };
  
  // Helper function to get display text for multi-select filters
  const getFilterDisplayText = (selectedValues, allValues, displayNameMap = null) => {
    if (selectedValues.includes('All')) {
      return 'All';
    }
    
    if (selectedValues.length === 1) {
      const value = selectedValues[0];
      return displayNameMap ? (displayNameMap[value] || value) : value;
    }
    
    if (selectedValues.length <= 2) {
      return selectedValues.map(v => displayNameMap ? (displayNameMap[v] || v) : v).join(', ');
    }
    
    return `${selectedValues.length} selected`;
  };
  
  // Helper functions for colors and indicators
  const getTrustScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow/Orange
    return '#ef4444'; // Red
  };
  
  const getEngagementROIColor = (roi) => {
    const percentage = parseInt(roi);
    if (percentage >= 60) return '#10b981'; // Green
    if (percentage >= 40) return '#f59e0b'; // Yellow/Orange
    return '#ef4444'; // Red
  };
  
  const getAcquisitionScoreIndicator = (score) => {
    if (score >= 85) return { icon: '🔥', label: 'High priority', className: 'high-priority' };
    if (score >= 60) return { icon: '💡', label: 'Medium priority', className: 'medium-priority' };
    return { icon: '🧊', label: 'Low priority', className: 'low-priority' };
  };
  
  const isReadyForNextStage = (pg) => {
    const stageInfo = stageProgression[pg.stage];
    if (!stageInfo || !stageInfo.next) return false;
    return pg.daysInStage >= stageInfo.avgDays;
  };
  
  const isStuckInStage = (pg) => {
    const stageInfo = stageProgression[pg.stage];
    if (!stageInfo || !stageInfo.threshold) return false;
    return pg.daysInStage >= stageInfo.threshold;
  };
  
  // Handle PG click to open detail view
  const handlePGClick = (pg) => {
    setSelectedPG(pg);
  };
  
  // Close PG detail view
  const handleClosePGDetail = () => {
    setSelectedPG(null);
  };
  
  // Calculate stats for selected PG
  const getPGStats = (pg) => {
    if (!pg) return {};
    
    const tactics = keyTactics[pg.id] || [];
    const totalTactics = tactics.length;
    const completedTactics = tactics.filter(t => t.completed).length;
    const successRate = totalTactics > 0 ? Math.round((completedTactics / totalTactics) * 100) : 0;
    
    return {
      totalTactics,
      completedTactics,
      successRate
    };
  };
  
  // Handle time range selection
  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range.toLowerCase());
  };
  
  // Add these new state variables
  const [selectedStageFilter, setSelectedStageFilter] = useState('All Stages');
  const [timeDisplayFormat, setTimeDisplayFormat] = useState('Monthly');
  const [showPGSpecificMetrics, setShowPGSpecificMetrics] = useState(true);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipContent, setTooltipContent] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const responseChartRef = useRef(null);
  
  // Add a new function to handle stage filter changes
  const handleStageFilterChange = (stage) => {
    setSelectedStageFilter(stage);
  };
  
  // Add a function to handle time display format changes
  const handleTimeDisplayFormatChange = (format) => {
    setTimeDisplayFormat(format);
  };
  
  // Target response times (in hours) for each channel
  const targetResponseTimes = {
    phone: 1.0,
    email: 4.0,
    linkedin: 6.0,
    other: 2.0
  };

  // Get response data for a specific PG
  const getPGResponseData = (pgName) => {
    // Create mock data for the selected PG with 5 weeks
    const pgResponseData = {
      phone: [],
      email: [],
      linkedin: [],
      other: []
    };
    
    // Generate 5 weeks of response data for each channel
    const generateWeeklyData = (channel, responseCounts) => {
      const data = [];
      
      // Calculate a seed based on PG name for consistent randomness
      const pgNameHash = pgName.split('').reduce((hash, char) => char.charCodeAt(0) + hash, 0);
      
      // Create a distribution of response times appropriate for each channel
      let responseTimes;
      switch (channel) {
        case 'phone':
          // Phone should have mostly fast responses (< 2h)
          responseTimes = [0.3, 0.5, 0.8, 1.1, 1.3, 1.6, 1.9, 2.2];
          break;
        case 'email':
          // Email with medium response times (2-4h)
          responseTimes = [1.8, 2.3, 2.8, 3.2, 3.7, 4.1, 4.5, 4.9];
          break;
        case 'linkedin':
          // LinkedIn with longer responses (3-6h)
          responseTimes = [3.2, 3.8, 4.5, 5.0, 5.5, 6.2];
          break;
        default: // other
          // Other channels with a mix (1-3h)
          responseTimes = [1.1, 1.5, 1.9, 2.3, 2.8];
      }
      
      // Generate data for each week
      for (let week = 1; week <= 5; week++) {
        // Get count for this week (can vary based on channel)
        const count = responseCounts[week - 1] || 1;
        
        for (let i = 0; i < count; i++) {
          // Add randomness to response times but keep the distribution characteristics
          const baseTime = responseTimes[i % responseTimes.length];
          // Adjust response time with a variation based on PG name hash
          const variation = ((pgNameHash + week + i) % 20) / 100; // ±10% variation
          const responseTime = Math.round((baseTime * (1 + variation - 0.1)) * 10) / 10;
          
          data.push({
            week: week,
            weekLabel: `Week ${week}`,
            date: `Week ${week}`,
            responseTime: responseTime,
            pgName: pgName,
            persona: ['CMO', 'CEO', 'Director', 'Operations'][Math.floor(Math.random() * 4)],
            outcome: ['Interested', 'Replied', 'No Reply'][Math.floor(Math.random() * 3)],
            region: ['NE', 'SE', 'MW', 'SW', 'W'][Math.floor(Math.random() * 5)]
          });
        }
      }
      
      return data;
    };
    
    // Set response counts for each channel across the 5 weeks
    // Format: [Week1, Week2, Week3, Week4, Week5]
    pgResponseData.phone = generateWeeklyData('phone', [2, 3, 2, 2, 1]);
    pgResponseData.email = generateWeeklyData('email', [2, 2, 3, 2, 1]);
    pgResponseData.linkedin = generateWeeklyData('linkedin', [1, 2, 1, 1, 1]);
    pgResponseData.other = generateWeeklyData('other', [1, 1, 1, 1, 1]);
    
    return pgResponseData;
  };
  
  // Calculate averages for response times
  const calculateAverages = (responseData) => {
    return {
      phone: responseData.phone.reduce((sum, item) => sum + item.responseTime, 0) / (responseData.phone.length || 1),
      email: responseData.email.reduce((sum, item) => sum + item.responseTime, 0) / (responseData.email.length || 1),
      linkedin: responseData.linkedin.reduce((sum, item) => sum + item.responseTime, 0) / (responseData.linkedin.length || 1),
      other: responseData.other.reduce((sum, item) => sum + item.responseTime, 0) / (responseData.other.length || 1)
    };
  };
  
  // Helper function to get response time position percentage (for Y-axis)
  const getResponseTimePosition = (hours) => {
    // Ensure hours is within valid range
    const clampedHours = Math.min(Math.max(hours, 0.1), 12);
    
    // Use log scale for better distribution across different time ranges
    // This better separates the lower time values (30min-2h) which are more critical
    const logBase = 1.5;
    const result = 100 - ((Math.log(clampedHours) / Math.log(logBase)) / 
                         (Math.log(12) / Math.log(logBase)) * 100);
    
    // Ensure result is within bounds
    return Math.min(Math.max(result, 5), 95);
  };
  
  // Helper function to get date position percentage (for X-axis)
  const getDatePositionPercentage = (dateString, index, totalPoints) => {
    // Each channel gets its own "lane" for data distribution
    if (totalPoints <= 1) return 50;
    
    // Available percentage of column width to use (leave margins)
    const usableWidth = 70;
    const margin = (100 - usableWidth) / 2;
    
    // Calculate position - distribute evenly across the usable width
    const step = usableWidth / (totalPoints - 1);
    let position = margin + (index * step);
    
    // Add a small variation to prevent perfect alignment
    // Use date string to create a deterministic but varied offset
    const dateHash = dateString.split('').reduce((hash, char) => char.charCodeAt(0) + hash, 0);
    const variation = ((dateHash % 9) - 4) * 1.5;
    
    position += variation;
    
    // Ensure position is within bounds
    return Math.min(Math.max(position, margin), 100 - margin);
  };
  
  // Week-based helper function for x-axis positioning
  const getWeekPositionPercentage = (weekNum) => {
    // Use 5 weeks (1-5)
    const totalWeeks = 5;
    const usableWidth = 80;
    const margin = (100 - usableWidth) / 2;
    
    // Distribute evenly for week positions
    const step = usableWidth / (totalWeeks - 1);
    const position = margin + ((weekNum - 1) * step);
    
    return position;
  };
  
  // Helper function to determine dot color based on response time
  const getDotColor = (responseTime, channel) => {
    const target = targetResponseTimes[channel] || 2;
    
    if (responseTime <= target * 0.8) {
      return 'var(--color-success)';
    } else if (responseTime <= target * 1.2) {
      return 'var(--color-warning)';
    } else {
      return 'var(--color-danger)';
    }
  };
  
  // Helper function to format response time
  const formatResponseTime = (hours) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };
  
  // Handle tooltip for response dots
  const handleDotMouseEnter = (e, channel, index, responseData) => {
    const item = responseData[channel][index];
    
    // Get position relative to the chart container
    const chartRect = responseChartRef.current.getBoundingClientRect();
    const dotRect = e.currentTarget.getBoundingClientRect();
    
    // Calculate center position of the dot
    const dotCenterX = dotRect.left + (dotRect.width / 2) - chartRect.left;
    const dotTopY = dotRect.top - chartRect.top - 10; // Position tooltip above dot
    
    // Ensure tooltip stays within chart boundaries
    const xPos = Math.min(Math.max(dotCenterX, 100), chartRect.width - 200);
    
    setTooltipPosition({ x: xPos, y: dotTopY });
    setTooltipContent({
      persona: item.persona,
      responseTime: formatResponseTime(item.responseTime),
      outcome: item.outcome,
      date: item.weekLabel,
      channel: channel.charAt(0).toUpperCase() + channel.slice(1) // Capitalize channel name
    });
    setActiveTooltip({ channel, index });
  };

  const handleDotMouseLeave = () => {
    // Using a timeout to prevent tooltip from disappearing too quickly
    setTimeout(() => {
      setActiveTooltip(null);
      setTooltipContent(null);
    }, 100);
  };
  
  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowStageDropdown(false);
      setShowMSADropdown(false);
      setShowVerticalDropdown(false);
      setShowTrustScoreDropdown(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  // Handle dropdown toggle without closing when clicking inside
  const handleDropdownToggle = (event, dropdown, setDropdown) => {
    event.stopPropagation();
    
    // Close all other dropdowns
    if (setDropdown !== setShowStageDropdown) setShowStageDropdown(false);
    if (setDropdown !== setShowMSADropdown) setShowMSADropdown(false);
    if (setDropdown !== setShowVerticalDropdown) setShowVerticalDropdown(false);
    if (setDropdown !== setShowTrustScoreDropdown) setShowTrustScoreDropdown(false);
    
    // Toggle the clicked dropdown
    setDropdown(!dropdown);
  };
  
  // Reset all filters to default state
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedStages([stageMappings[stage] || 'All']);
    setSelectedMSAs(['All']);
    setSelectedVerticals(['All']);
    setSelectedTrustScores(['All']);
  };
  
  // Mock task timeline data
  const mockTaskTimeline = {
    1: [
      { 
        id: 1, 
        title: 'Initial Contact', 
        date: '2023-09-10', 
        completed: true, 
        type: 'contact',
        description: 'First outreach via email'
      },
      { 
        id: 2, 
        title: 'Follow-up Call', 
        date: '2023-09-25', 
        completed: true, 
        type: 'follow-up',
        description: 'Discussed integration possibilities'
      },
      { 
        id: 3, 
        title: 'Demo Presentation', 
        date: '2023-10-15', 
        completed: true, 
        type: 'meeting',
        description: 'Presented product features to stakeholders'
      },
      { 
        id: 4, 
        title: 'Contract Discussion', 
        date: '2023-11-05', 
        completed: false, 
        type: 'meeting',
        description: 'Review contract terms and pricing'
      },
      { 
        id: 5, 
        title: 'Follow-up on Decision', 
        date: '2023-11-20', 
        completed: false, 
        type: 'follow-up',
        description: 'Check on contract signing status'
      }
    ],
    2: [
      { 
        id: 1, 
        title: 'Initial Contact', 
        date: '2023-08-15', 
        completed: true, 
        type: 'contact',
        description: 'First outreach via LinkedIn'
      },
      { 
        id: 2, 
        title: 'Intro Meeting', 
        date: '2023-09-05', 
        completed: true, 
        type: 'meeting',
        description: 'Introduction to our services'
      },
      { 
        id: 3, 
        title: 'Follow-up Email', 
        date: '2023-09-20', 
        completed: true, 
        type: 'follow-up',
        description: 'Sent additional materials'
      },
      { 
        id: 4, 
        title: 'Technical Assessment', 
        date: '2023-10-10', 
        completed: false, 
        type: 'meeting',
        description: 'Evaluate technical requirements'
      }
    ],
    // Add more mock data for other PGs
    3: [
      { 
        id: 1, 
        title: 'Initial Contact', 
        date: '2023-10-01', 
        completed: true, 
        type: 'contact',
        description: 'First outreach via phone'
      },
      { 
        id: 2, 
        title: 'Follow-up Meeting', 
        date: '2023-10-15', 
        completed: true, 
        type: 'meeting',
        description: 'Discussed their needs'
      },
      { 
        id: 3, 
        title: 'Send Proposal', 
        date: '2023-11-01', 
        completed: false, 
        type: 'follow-up',
        description: 'Prepare and send formal proposal'
      }
    ],
    4: [
      { 
        id: 1, 
        title: 'Initial Contact', 
        date: '2023-11-10', 
        completed: true, 
        type: 'contact',
        description: 'First outreach via email'
      },
      { 
        id: 2, 
        title: 'Schedule Demo', 
        date: '2023-11-25', 
        completed: false, 
        type: 'follow-up',
        description: 'Set up product demonstration'
      }
    ],
    5: [
      { 
        id: 1, 
        title: 'Initial Contact', 
        date: '2023-09-05', 
        completed: true, 
        type: 'contact',
        description: 'First outreach via email'
      },
      { 
        id: 2, 
        title: 'Follow-up Call', 
        date: '2023-09-20', 
        completed: true, 
        type: 'follow-up',
        description: 'Discussed their requirements'
      },
      { 
        id: 3, 
        title: 'Technical Meeting', 
        date: '2023-10-10', 
        completed: true, 
        type: 'meeting',
        description: 'Met with their IT team'
      },
      { 
        id: 4, 
        title: 'Proposal Presentation', 
        date: '2023-10-25', 
        completed: true, 
        type: 'meeting',
        description: 'Presented our solution'
      },
      { 
        id: 5, 
        title: 'Contract Negotiation', 
        date: '2023-11-15', 
        completed: false, 
        type: 'meeting',
        description: 'Finalize contract details'
      }
    ],
    6: [
      { 
        id: 1, 
        title: 'Initial Contact', 
        date: '2023-07-10', 
        completed: true, 
        type: 'contact',
        description: 'First outreach via LinkedIn'
      },
      { 
        id: 2, 
        title: 'Intro Meeting', 
        date: '2023-07-25', 
        completed: true, 
        type: 'meeting',
        description: 'Introduction to our platform'
      },
      { 
        id: 3, 
        title: 'Technical Assessment', 
        date: '2023-08-15', 
        completed: true, 
        type: 'meeting',
        description: 'Technical requirements gathering'
      },
      { 
        id: 4, 
        title: 'Proposal Review', 
        date: '2023-09-05', 
        completed: true, 
        type: 'meeting',
        description: 'Reviewed our proposal'
      },
      { 
        id: 5, 
        title: 'Contract Signing', 
        date: '2023-09-20', 
        completed: true, 
        type: 'meeting',
        description: 'Finalized the agreement'
      },
      { 
        id: 6, 
        title: 'Onboarding Call', 
        date: '2023-10-05', 
        completed: true, 
        type: 'meeting',
        description: 'Kickoff and onboarding'
      },
      { 
        id: 7, 
        title: 'Training Session', 
        date: '2023-10-15', 
        completed: true, 
        type: 'meeting',
        description: 'Staff training on platform'
      },
      { 
        id: 8, 
        title: 'Go-Live', 
        date: '2023-10-25', 
        completed: true, 
        type: 'milestone',
        description: 'Platform implementation complete'
      },
      { 
        id: 9, 
        title: 'Post-Implementation Review', 
        date: '2023-11-15', 
        completed: false, 
        type: 'follow-up',
        description: 'Review implementation success'
      }
    ],
    // Add a PG with a more realistic "days since last contact" value
    7: [
      { 
        id: 1, 
        title: 'Initial Contact', 
        date: '2023-08-15', 
        completed: true, 
        type: 'contact',
        description: 'First outreach via email'
      },
      { 
        id: 2, 
        title: 'Follow-up Call', 
        date: '2023-08-30', 
        completed: true, 
        type: 'follow-up',
        description: 'Discussed their needs'
      },
      { 
        id: 3, 
        title: 'Demo Presentation', 
        date: '2023-09-15', 
        completed: true, 
        type: 'meeting',
        description: 'Presented our platform'
      },
      { 
        id: 4, 
        title: 'Technical Discussion', 
        date: '2023-09-30', 
        completed: true, 
        type: 'meeting',
        description: 'Discussed integration details'
      },
      { 
        id: 5, 
        title: 'Status Check Call', 
        date: '2023-10-15', 
        completed: true, 
        type: 'contact',
        description: 'Checked on decision progress'
      },
      { 
        id: 6, 
        title: 'Follow-up Meeting', 
        date: '2023-10-30', 
        completed: true, 
        type: 'meeting',
        description: 'Addressed remaining concerns'
      },
      { 
        id: 7, 
        title: 'Decision Follow-up', 
        date: '2023-12-15', 
        completed: false, 
        type: 'follow-up',
        description: 'Check on final decision'
      }
    ]
  };

  // Handle adding a new task
  const handleAddTask = () => {
    setShowAddTaskModal(true);
  };

  // Handle saving a new task
  const handleSaveTask = () => {
    if (!newTask.title || !newTask.dueDate) return;
    
    // In a real app, this would be an API call
    // For now, we'll just update our mock data
    const pgTasks = mockTaskTimeline[selectedPG.id] || [];
    const newTaskObj = {
      id: pgTasks.length + 1,
      title: newTask.title,
      date: newTask.dueDate,
      completed: false,
      type: newTask.type,
      description: newTask.description
    };
    
    // This would be replaced with proper state management in a real app
    mockTaskTimeline[selectedPG.id] = [...pgTasks, newTaskObj];
    
    // Reset the form and close the modal
    setNewTask({
      title: '',
      dueDate: '',
      type: 'follow-up',
      description: ''
    });
    setShowAddTaskModal(false);
  };
  
  return (
    <div className="stage-detail-container">
      {!selectedPG ? (
        <>
          <div className="stage-detail-header">
            <h1>{stageDisplayNames[stageMappings[stage]] || stage} Stage Details</h1>
            <button className="close-button" onClick={onClose}>
              <FiX />
            </button>
          </div>
          
          <div className="stats-summary">
            <div className="stat-card">
              <div className="stat-label">PATIENTS</div>
              <div className="stat-value">{totalPatients.toLocaleString()}</div>
              <div className="stat-subtitle">Across all PGs</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-label">PRACTITIONERS</div>
              <div className="stat-value">{practitioners.total}</div>
              <div className="stat-subtitle">
                <div className="stat-practitioner-chips">
                  <div className="stat-practitioner-chip md-chip">
                    <MdLocalHospital className="practitioner-icon" />
                    <span>{practitioners.md} MDs</span>
                  </div>
                  <div className="stat-practitioner-chip npp-chip">
                    <FiUser className="practitioner-icon" />
                    <span>{practitioners.npp} NPPs</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-label">AVG TRUST SCORE</div>
              <div className="stat-value">{avgTrustScore}</div>
              <div className="stat-subtitle">Calculated from all stakeholders</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-label">BIG SHOT PGS</div>
              <div className="stat-value">{bigShotPGs}</div>
              <div className="stat-subtitle">Score ≥ 85</div>
            </div>
          </div>
          
          <div className="filter-controls">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search PG or stakeholder..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-actions">
              <div className="filter-dropdowns">
                <div className="filter-dropdown-container">
                  <div 
                    className={`filter-dropdown ${!selectedMSAs.includes('All') ? 'active' : ''}`}
                    onClick={(e) => handleDropdownToggle(e, showMSADropdown, setShowMSADropdown)}
                  >
                    <span>MSA: {getFilterDisplayText(selectedMSAs, allMSAs)}</span>
                    <FiChevronDown />
                  </div>
                  {showMSADropdown && (
                    <div className="dropdown-menu">
                      {allMSAs.map((msaOption, index) => (
                        <div 
                          key={index} 
                          className={`dropdown-item ${selectedMSAs.includes(msaOption) ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFilterChange(msaOption, selectedMSAs, setSelectedMSAs);
                          }}
                        >
                          {selectedMSAs.includes(msaOption) && <FiCheck className="dropdown-check" />}
                          {msaOption}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="filter-dropdown-container">
                  <div 
                    className={`filter-dropdown ${!selectedVerticals.includes('All') ? 'active' : ''}`}
                    onClick={(e) => handleDropdownToggle(e, showVerticalDropdown, setShowVerticalDropdown)}
                  >
                    <span>Vertical: {getFilterDisplayText(selectedVerticals, allVerticals)}</span>
                    <FiChevronDown />
                  </div>
                  {showVerticalDropdown && (
                    <div className="dropdown-menu">
                      {allVerticals.map((verticalOption, index) => (
                        <div 
                          key={index} 
                          className={`dropdown-item ${selectedVerticals.includes(verticalOption) ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFilterChange(verticalOption, selectedVerticals, setSelectedVerticals);
                          }}
                        >
                          {selectedVerticals.includes(verticalOption) && <FiCheck className="dropdown-check" />}
                          {verticalOption}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="filter-dropdown-container">
                  <div 
                    className={`filter-dropdown ${!selectedStages.includes('All') ? 'active' : ''}`}
                    onClick={(e) => handleDropdownToggle(e, showStageDropdown, setShowStageDropdown)}
                  >
                    <span>Stage: {getFilterDisplayText(selectedStages, allStages, stageDisplayNames)}</span>
                    <FiChevronDown />
                  </div>
                  {showStageDropdown && (
                    <div className="dropdown-menu">
                      {allStages.map((stageOption, index) => (
                        <div 
                          key={index} 
                          className={`dropdown-item ${selectedStages.includes(stageOption) ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFilterChange(stageOption, selectedStages, setSelectedStages);
                          }}
                        >
                          {selectedStages.includes(stageOption) && <FiCheck className="dropdown-check" />}
                          {stageDisplayNames[stageOption] || stageOption}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="filter-dropdown-container">
                  <div 
                    className={`filter-dropdown ${!selectedTrustScores.includes('All') ? 'active' : ''}`}
                    onClick={(e) => handleDropdownToggle(e, showTrustScoreDropdown, setShowTrustScoreDropdown)}
                  >
                    <span>Trust Score: {getFilterDisplayText(selectedTrustScores, trustScoreRanges.map(r => r.id))}</span>
                    <FiChevronDown />
                  </div>
                  {showTrustScoreDropdown && (
                    <div className="dropdown-menu">
                      {trustScoreRanges.map((scoreRange, index) => (
                        <div 
                          key={index} 
                          className={`dropdown-item ${selectedTrustScores.includes(scoreRange.id) ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFilterChange(scoreRange.id, selectedTrustScores, setSelectedTrustScores);
                          }}
                        >
                          {selectedTrustScores.includes(scoreRange.id) && <FiCheck className="dropdown-check" />}
                          {scoreRange.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {(searchTerm || !selectedMSAs.includes('All') || !selectedVerticals.includes('All') || 
                !selectedStages.includes('All') || !selectedTrustScores.includes('All')) && (
                <button className="clear-filters-btn" onClick={clearAllFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          </div>
          
          <div className="pg-table-container">
            <table className="pg-table">
              <thead>
                <tr>
                  <th className="pg-name-col">
                    PG Name <FiInfo className="info-icon" />
                  </th>
                  <th className="msa-col">
                    MSA <FiInfo className="info-icon" />
                  </th>
                  <th className="vertical-col">
                    Vertical <FiInfo className="info-icon" />
                  </th>
                  <th className="stage-col">
                    Stage <FiInfo className="info-icon" />
                  </th>
                  <th className="days-in-stage-col">
                    Days in Stage <FiInfo className="info-icon" />
                  </th>
                  <th className="patients-col">
                    Patients <FiInfo className="info-icon" />
                  </th>
                  <th className="practitioners-col">
                    Practitioners <FiInfo className="info-icon" />
                  </th>
                  <th className="trust-score-col">
                    Trust Score <FiInfo className="info-icon" />
                  </th>
                  <th className="engagement-col">
                    Engagement <FiInfo className="info-icon" />
                  </th>
                  <th className="acquisition-score-col">
                    Acquisition Score <span className="priority-indicator">🔥</span> <FiInfo className="info-icon" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPGs.length > 0 ? (
                  filteredPGs.map(pg => (
                    <tr key={pg.id}>
                      <td className="pg-name-col">
                        <div 
                          className="pg-name-link"
                          onClick={() => handlePGClick(pg)}
                        >
                          {pg.name}
                          <FiExternalLink className="external-link-icon" />
                        </div>
                      </td>
                      <td className="msa-col">{pg.msa}</td>
                      <td className="vertical-col">
                        <span className={`vertical-tag ${pg.vertical.toLowerCase()}`}>{pg.vertical}</span>
                      </td>
                      <td className="stage-col">
                        <div className="stage-info">
                          <span className={`stage-tag ${pg.stage.toLowerCase()}`}>
                            {stageDisplayNames[pg.stage] || pg.stage}
                          </span>
                          {isReadyForNextStage(pg) && stageProgression[pg.stage]?.next && (
                            <div className="stage-progression">
                              <FiArrowRight className="stage-arrow" />
                              <span className={`stage-tag ${stageProgression[pg.stage].next.toLowerCase()}`}>
                                {stageDisplayNames[stageProgression[pg.stage].next]}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="days-in-stage-col">
                        <div className="days-info">
                          <span className={`days-badge ${
                            pg.daysInStage >= 90 ? 'days-critical' :
                            pg.daysInStage >= 60 ? 'days-warning' :
                            pg.daysInStage >= 45 ? 'days-medium' :
                            pg.daysInStage >= 30 ? 'days-normal' :
                            'days-recent'
                          }`}>
                            {pg.daysInStage} days
                          </span>
                          {isStuckInStage(pg) && (
                            <div className="days-alert" title="PG has been in this stage longer than recommended">!</div>
                          )}
                          {isReadyForNextStage(pg) && !isStuckInStage(pg) && (
                            <div className="days-ready" title="Ready to move to next stage">✓</div>
                          )}
                        </div>
                        <div className="stage-date">{pg.stageDate}</div>
                      </td>
                      <td className="patients-col">{pg.patients.toLocaleString()}</td>
                      <td className="practitioners-col">
                        <div className="practitioner-chips">
                          <div className="practitioner-chip md-chip" title="Medical Doctors">
                            <MdLocalHospital className="practitioner-icon" />
                            <span>{pg.practitioners.md}</span>
                          </div>
                          {pg.practitioners.npp > 0 && (
                            <div className="practitioner-chip npp-chip" title="Non-Physician Providers">
                              <FiUser className="practitioner-icon" />
                              <span>{pg.practitioners.npp}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="trust-score-col">
                        <div className="score-bar">
                          <div 
                            className="score-indicator" 
                            style={{ 
                              width: `${Math.min(100, pg.trustScore)}%`,
                              backgroundColor: getTrustScoreColor(pg.trustScore)
                            }}
                          />
                          <span>{pg.trustScore}</span>
                        </div>
                      </td>
                      <td className="engagement-col">
                        <div className="engagement-container">
                          <div className="reach-outs">{pg.reachOuts}</div>
                          <div className="score-bar">
                            <div 
                              className="score-indicator" 
                              style={{ 
                                width: pg.engagementROI,
                                backgroundColor: getEngagementROIColor(pg.engagementROI)
                              }}
                            />
                            <span>{pg.engagementROI}</span>
                          </div>
                        </div>
                      </td>
                      <td className="acquisition-score-col">
                        <div className="acquisition-score">
                          <span 
                            className={`acquisition-badge ${getAcquisitionScoreIndicator(pg.acquisitionScore).className}`}
                            title={getAcquisitionScoreIndicator(pg.acquisitionScore).label}
                          >
                            {getAcquisitionScoreIndicator(pg.acquisitionScore).icon}
                          </span>
                          <span className="score-value">{pg.acquisitionScore}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="empty-table-message">No results match your filters</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="pg-detail-view">
          <div className="pg-detail-header">
            <div className="pg-detail-title">
              <button className="back-button" onClick={handleClosePGDetail}>
                <FiArrowRight className="back-arrow" /> Back to {stage} Stage
              </button>
              <h2>{selectedPG.name}</h2>
            </div>
            <button className="close-button" onClick={onClose}>
              <FiX />
            </button>
          </div>
          
          <div className="pg-summary-stats">
            <div className="pg-summary-card">
              <div className="summary-label">Stage</div>
              <div className="summary-value">
                <span className={`stage-tag ${selectedPG.stage.toLowerCase()}`}>
                  {stageDisplayNames[selectedPG.stage] || selectedPG.stage}
                </span>
              </div>
            </div>
            
            <div className="pg-summary-card">
              <div className="summary-label">MSA</div>
              <div className="summary-value">{selectedPG.msa}</div>
            </div>
            
            <div className="pg-summary-card">
              <div className="summary-label">Vertical</div>
              <div className="summary-value">
                <span className={`vertical-tag ${selectedPG.vertical.toLowerCase()}`}>{selectedPG.vertical}</span>
              </div>
            </div>
            
            <div className="pg-summary-card">
              <div className="summary-label">Patients</div>
              <div className="summary-value">{selectedPG.patients.toLocaleString()}</div>
            </div>
            
            <div className="pg-summary-card">
              <div className="summary-label">Practitioners</div>
              <div className="summary-value">
                <div className="practitioner-chips">
                  <div className="practitioner-chip md-chip" title="Medical Doctors">
                    <MdLocalHospital className="practitioner-icon" />
                    <span>{selectedPG.practitioners.md}</span>
                  </div>
                  {selectedPG.practitioners.npp > 0 && (
                    <div className="practitioner-chip npp-chip" title="Non-Physician Providers">
                      <FiUser className="practitioner-icon" />
                      <span>{selectedPG.practitioners.npp}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="pg-summary-card">
              <div className="summary-label">Trust Score</div>
              <div className="summary-value">
                <div className="score-bar summary-score-bar">
                  <div 
                    className="score-indicator" 
                    style={{ 
                      width: `${Math.min(100, selectedPG.trustScore)}%`,
                      backgroundColor: getTrustScoreColor(selectedPG.trustScore)
                    }}
                  />
                  <span>{selectedPG.trustScore}</span>
                </div>
              </div>
            </div>
            
            <div className="pg-summary-card">
              <div className="summary-label">Acquisition Score</div>
              <div className="summary-value acquisition-summary">
                <span 
                  className={`acquisition-badge ${getAcquisitionScoreIndicator(selectedPG.acquisitionScore).className}`}
                  title={getAcquisitionScoreIndicator(selectedPG.acquisitionScore).label}
                >
                  {getAcquisitionScoreIndicator(selectedPG.acquisitionScore).icon}
                </span>
                <span className="score-value">{selectedPG.acquisitionScore}</span>
              </div>
            </div>
          </div>
          
          <div className="pg-detail-grid">
            {/* EHR System Card */}
            <div className="detail-card ehr-system-card">
              <div className="detail-card-header">
                <div className="detail-card-title">
                  <span className="detail-icon">🏥</span>
                  EHR System
                </div>
              </div>
              
              <div className="ehr-dropdown">
                <select className="ehr-select">
                  <option disabled>Select EHR System</option>
                  <option value="Athena" selected={ehrSystems[selectedPG.id].name === 'Athena'}>Athena</option>
                  <option value="Kareo" selected={ehrSystems[selectedPG.id].name === 'Kareo'}>Kareo</option>
                  <option value="Epic" selected={ehrSystems[selectedPG.id].name === 'Epic'}>Epic</option>
                  <option value="Cerner" selected={ehrSystems[selectedPG.id].name === 'Cerner'}>Cerner</option>
                  <option value="Allscripts" selected={ehrSystems[selectedPG.id].name === 'Allscripts'}>Allscripts</option>
                  <option value="eClinicalWorks" selected={ehrSystems[selectedPG.id].name === 'eClinicalWorks'}>eClinicalWorks</option>
                  <option value="NextGen" selected={ehrSystems[selectedPG.id].name === 'NextGen'}>NextGen</option>
                  <option value="Meditech" selected={ehrSystems[selectedPG.id].name === 'Meditech'}>Meditech</option>
                  <option value="Other" selected={ehrSystems[selectedPG.id].name === 'Other'}>Other</option>
                </select>
              </div>
            </div>
            
            {/* Key Tactics Card */}
            <div className="detail-card key-tactics-card">
              <div className="detail-card-header">
                <div className="detail-card-title">
                  <span className="detail-icon">✅</span>
                  Key Tactics
                </div>
              </div>
              
              <div className="tactics-list">
                {keyTactics[selectedPG.id].map((tactic, index) => (
                  <div key={index} className="tactic-item">
                    <div className={`tactic-status ${tactic.completed ? 'completed' : 'pending'}`}>
                      {tactic.completed ? <FiCheckCircle /> : <FiClock />}
                    </div>
                    <div className="tactic-content">
                      <div className="tactic-text">{tactic.text}</div>
                      <div className="tactic-status-text">
                        {tactic.completed ? "Completed" : "In progress"}
                      </div>
                    </div>
                    <div className="tactic-actions">
                      <button className="expand-btn">
                        <FiExternalLink />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="add-tactic">
                  <span>+ Add Tactic</span>
                </div>
              </div>
            </div>
            
            {/* Pain Points Card */}
            <div className="detail-card pain-points-card">
              <div className="detail-card-header">
                <div className="detail-card-title">
                  <span className="detail-icon">🔴</span>
                  Pain Points
                </div>
              </div>
              
              <div className="pain-points-list">
                {painPoints[selectedPG.id].map((point, index) => (
                  <div key={index} className="pain-point-item">
                    <div className={`pain-severity ${point.severity}`}></div>
                    <div className="pain-content">
                      <div className="pain-text">{point.text}</div>
                      <div className="pain-date">From {point.date}</div>
                    </div>
                    <div className="pain-actions">
                      <button className="expand-btn">
                        <FiExternalLink />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="add-pain-point">
                  <span>+ Add Pain Point</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add Task Modal */}
          <AddTaskModal 
            show={showAddTaskModal}
            onClose={() => setShowAddTaskModal(false)}
            task={newTask}
            setTask={setNewTask}
            onSave={handleSaveTask}
          />
          
          <div className="side-by-side-container">
            {/* Task Timeline Card */}
            <div className="side-by-side-item">
              <TaskTimeline 
                tasks={mockTaskTimeline[selectedPG.id] || []} 
                onAddTask={handleAddTask}
              />
            </div>
            
            {/* Growth Metrics Section */}
            <div className="side-by-side-item">
              <div className="growth-metrics-section">
                <h3>Growth Metrics</h3>
                <div className="growth-subtitle">Historical data and projections for this PG</div>
                
                <div className="growth-filters">
                  <div className="filter-group">
                    <label>Time Period:</label>
                    <select 
                      value={selectedTimeRange}
                      onChange={(e) => handleTimeRangeChange(e.target.value)}
                      className="chart-filter"
                    >
                      <option value="quarter">Quarters</option>
                      <option value="month">Months</option>
                      <option value="week">Weeks</option>
                    </select>
                  </div>
                </div>
                
                <div className="stage-legend">
                  {Object.entries(pgMetricsColors).map(([metric, color]) => (
                    <div key={metric} className="legend-item">
                      <span className="legend-color" style={{ backgroundColor: color }}></span>
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
                
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart
                      data={selectedPG ? (mockPGMetricsData[selectedPG.id] || defaultPGMetrics)[selectedTimeRange] || [] : []}
                      margin={{ top: 10, right: 10, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        domain={['auto', 'auto']}
                        allowDataOverflow={false}
                        padding={{ top: 20, bottom: 20 }}
                      />
                      <Tooltip 
                        formatter={(value, name) => [`${value}${name === 'TrustScore' ? '/100' : name === 'Engagement' ? ' min' : ''}`, name]}
                        labelFormatter={(label) => `${label}`}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          padding: '8px 12px'
                        }}
                      />
                      
                      {/* PG-specific metrics lines */}
                      {Object.entries(pgMetricsColors).map(([metric, color]) => (
                        <Line
                          key={metric}
                          type="monotone"
                          dataKey={metric}
                          stroke={color}
                          strokeWidth={2}
                          dot={{ r: 4, fill: color, stroke: color }}
                          activeDot={{ r: 6 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
          
          <div className="metrics-bottom-row">
            <div className="stage-duration-card">
              <div className="chart-header">
                <div className="chart-title">
                  <span className="chart-icon">⏱️</span>
                  <span>Stage Duration</span>
                </div>
              </div>
              
              <div className="stage-duration-chart">
                <div className="chart-y-axis">
                  <div className="y-axis-label">Days in Stage</div>
                  <div className="y-axis-ticks">
                    <div className="y-tick">30</div>
                    <div className="y-tick">25</div>
                    <div className="y-tick">20</div>
                    <div className="y-tick">15</div>
                    <div className="y-tick">10</div>
                    <div className="y-tick">5</div>
                    <div className="y-tick">0</div>
                  </div>
                </div>
                <div className="bar-chart-container">
                  {['Targets', 'Outreach', 'Pilots', 'Onboarded', 'Premium'].map(stageName => {
                    const pgData = stageDurationData[selectedPG.id] || defaultStageDuration;
                    const avgData = stageDurationData.average;
                    const pgValue = pgData[stageName];
                    const avgValue = avgData[stageName];
                    
                    return (
                      <div key={stageName} className="bar-group">
                        <div className="bar-pair">
                          <div 
                            className="bar pg-bar" 
                            style={{ 
                              height: `${(pgValue / 30) * 100}%`,
                              alignSelf: 'flex-end'
                            }}
                            title={`${selectedPG.name}: ${pgValue} days in ${stageName} stage`}
                          >
                            <div className="bar-value">{pgValue}</div>
                          </div>
                          <div 
                            className="bar avg-bar" 
                            style={{ 
                              height: `${(avgValue / 30) * 100}%`,
                              alignSelf: 'flex-end'
                            }}
                            title={`Average: ${avgValue} days in ${stageName} stage`}
                          >
                            <div className="bar-value">{avgValue}</div>
                          </div>
                        </div>
                        <div className="bar-label">{stageName}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="duration-stats-row">
                {(() => {
                  const pgData = stageDurationData[selectedPG.id] || defaultStageDuration;
                  return (
                    <>
                      <div className="duration-stat">
                        <div className="duration-value">{pgData.totalDays}</div>
                        <div className="duration-label">Total Days</div>
                      </div>
                      <div className="duration-stat">
                        <div className="duration-value">{pgData.longestStageDays}</div>
                        <div className="duration-label">Longest Stage</div>
                      </div>
                      <div className="duration-stat">
                        <div className="duration-value bottleneck">{pgData.bottleneck}</div>
                        <div className="duration-label">Bottleneck</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
            
            <div className="response-metrics-card">
              <div className="chart-title">
                <span className="chart-icon">⏱️</span>
                <span>Response Metrics</span>
              </div>
              
              <div className="response-summary">
                <div className="response-summary-text">
                  <span className="pg-name">{selectedPG.name}</span> response times across all channels
                </div>
              </div>
              
              <div className="pg-response-chart" ref={responseChartRef}>
                {(() => {
                  const responseData = getPGResponseData(selectedPG.name);
                  const averages = calculateAverages(responseData);
                  
                  return (
                    <>
                      <div className="response-time-axis">
                        <div className="time-label">12h</div>
                        <div className="time-label">6h</div>
                        <div className="time-label">4h</div>
                        <div className="time-label">2h</div>
                        <div className="time-label">1h</div>
                        <div className="time-label">30min</div>
                      </div>
                      
                      <div className="channels-container">
                        {/* Week labels on x-axis */}
                        <div className="week-labels">
                          <div className="week-label" style={{ left: `${getWeekPositionPercentage(1)}%` }}>Week 1</div>
                          <div className="week-label" style={{ left: `${getWeekPositionPercentage(2)}%` }}>Week 2</div>
                          <div className="week-label" style={{ left: `${getWeekPositionPercentage(3)}%` }}>Week 3</div>
                          <div className="week-label" style={{ left: `${getWeekPositionPercentage(4)}%` }}>Week 4</div>
                          <div className="week-label" style={{ left: `${getWeekPositionPercentage(5)}%` }}>Week 5</div>
                        </div>
                        
                        {/* Week grid lines */}
                        <div className="week-grid-lines">
                          <div className="week-grid-line" style={{ left: `${getWeekPositionPercentage(1)}%` }}></div>
                          <div className="week-grid-line" style={{ left: `${getWeekPositionPercentage(2)}%` }}></div>
                          <div className="week-grid-line" style={{ left: `${getWeekPositionPercentage(3)}%` }}></div>
                          <div className="week-grid-line" style={{ left: `${getWeekPositionPercentage(4)}%` }}></div>
                          <div className="week-grid-line" style={{ left: `${getWeekPositionPercentage(5)}%` }}></div>
                        </div>
                        
                        {/* Phone channel */}
                        <div className="channel-column">
                          <div className="channel-icon phone-icon">
                            <FiPhone />
                          </div>
                          <div className="channel-label">Phone</div>
                          <div className="channel-count">{responseData.phone.length}</div>
                          <div className="channel-target-line" style={{ bottom: `${getResponseTimePosition(targetResponseTimes.phone)}%` }}></div>
                          <div className="dots-container">
                            {responseData.phone.map((item, index) => (
                              <div 
                                key={`phone-${index}`}
                                className="data-dot"
                                style={{
                                  bottom: `${getResponseTimePosition(item.responseTime)}%`,
                                  left: `${getWeekPositionPercentage(item.week)}%`,
                                  backgroundColor: getDotColor(item.responseTime, 'phone')
                                }}
                                onMouseEnter={(e) => handleDotMouseEnter(e, 'phone', index, responseData)}
                                onMouseLeave={handleDotMouseLeave}
                              />
                            ))}
                          </div>
                          
                          {/* Average response time */}
                          <div className="average-line" style={{ bottom: `${getResponseTimePosition(averages.phone)}%` }}>
                            <span className="average-label">{formatResponseTime(averages.phone)}</span>
                          </div>
                        </div>
                        
                        {/* Email channel */}
                        <div className="channel-column">
                          <div className="channel-icon email-icon">
                            <FiMail />
                          </div>
                          <div className="channel-label">Email</div>
                          <div className="channel-count">{responseData.email.length}</div>
                          <div className="channel-target-line" style={{ bottom: `${getResponseTimePosition(targetResponseTimes.email)}%` }}></div>
                          <div className="dots-container">
                            {responseData.email.map((item, index) => (
                              <div 
                                key={`email-${index}`}
                                className="data-dot"
                                style={{
                                  bottom: `${getResponseTimePosition(item.responseTime)}%`,
                                  left: `${getWeekPositionPercentage(item.week)}%`,
                                  backgroundColor: getDotColor(item.responseTime, 'email')
                                }}
                                onMouseEnter={(e) => handleDotMouseEnter(e, 'email', index, responseData)}
                                onMouseLeave={handleDotMouseLeave}
                              />
                            ))}
                          </div>
                          
                          {/* Average response time */}
                          <div className="average-line" style={{ bottom: `${getResponseTimePosition(averages.email)}%` }}>
                            <span className="average-label">{formatResponseTime(averages.email)}</span>
                          </div>
                        </div>
                        
                        {/* LinkedIn channel */}
                        <div className="channel-column">
                          <div className="channel-icon linkedin-icon">
                            <FiLinkedin />
                          </div>
                          <div className="channel-label">LinkedIn</div>
                          <div className="channel-count">{responseData.linkedin.length}</div>
                          <div className="channel-target-line" style={{ bottom: `${getResponseTimePosition(targetResponseTimes.linkedin)}%` }}></div>
                          <div className="dots-container">
                            {responseData.linkedin.map((item, index) => (
                              <div 
                                key={`linkedin-${index}`}
                                className="data-dot"
                                style={{
                                  bottom: `${getResponseTimePosition(item.responseTime)}%`,
                                  left: `${getWeekPositionPercentage(item.week)}%`,
                                  backgroundColor: getDotColor(item.responseTime, 'linkedin')
                                }}
                                onMouseEnter={(e) => handleDotMouseEnter(e, 'linkedin', index, responseData)}
                                onMouseLeave={handleDotMouseLeave}
                              />
                            ))}
                          </div>
                          
                          {/* Average response time */}
                          <div className="average-line" style={{ bottom: `${getResponseTimePosition(averages.linkedin)}%` }}>
                            <span className="average-label">{formatResponseTime(averages.linkedin)}</span>
                          </div>
                        </div>
                        
                        {/* Other channels */}
                        <div className="channel-column">
                          <div className="channel-icon other-icon">
                            <FiMoreHorizontal />
                          </div>
                          <div className="channel-label">Others</div>
                          <div className="channel-count">{responseData.other.length}</div>
                          <div className="channel-target-line" style={{ bottom: `${getResponseTimePosition(targetResponseTimes.other)}%` }}></div>
                          <div className="dots-container">
                            {responseData.other.map((item, index) => (
                              <div 
                                key={`other-${index}`}
                                className="data-dot"
                                style={{
                                  bottom: `${getResponseTimePosition(item.responseTime)}%`,
                                  left: `${getWeekPositionPercentage(item.week)}%`,
                                  backgroundColor: getDotColor(item.responseTime, 'other')
                                }}
                                onMouseEnter={(e) => handleDotMouseEnter(e, 'other', index, responseData)}
                                onMouseLeave={handleDotMouseLeave}
                              />
                            ))}
                          </div>
                          
                          {/* Average response time */}
                          <div className="average-line" style={{ bottom: `${getResponseTimePosition(averages.other)}%` }}>
                            <span className="average-label">{formatResponseTime(averages.other)}</span>
                          </div>
                        </div>
                        
                        {/* Floating tooltip */}
                        {tooltipContent && (
                          <div 
                            className="response-tooltip" 
                            style={{ 
                              left: `${tooltipPosition.x}px`, 
                              top: `${tooltipPosition.y - 10}px`
                            }}
                          >
                            <div className="tooltip-header">
                              <strong>{tooltipContent.channel}</strong> - {tooltipContent.date}
                            </div>
                            <div><span className="tooltip-label">Contact:</span> {tooltipContent.persona}</div>
                            <div><span className="tooltip-label">Response:</span> {tooltipContent.responseTime}</div>
                            <div><span className="tooltip-label">Outcome:</span> {tooltipContent.outcome}</div>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default StageDetailView; 