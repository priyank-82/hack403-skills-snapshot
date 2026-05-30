import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Building2,
  TrendingUp,
  Target,
  Zap,
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../services/auth';
import { DashboardSkeleton } from './Loading';
import CompanySelectionDropdown from '../components/CompanySelectionDropdown';
import { dashboardData } from '../data/competitorsData';
import '../styles/pages/Dashboard.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [showAllCommonSkills, setShowAllCommonSkills] = useState(false);
  const [showAllMissingSkills, setShowAllMissingSkills] = useState(false);
  const [showAllCompetitors, setShowAllCompetitors] = useState(false);
  const [showAllOrgSkills, setShowAllOrgSkills] = useState(false);

  // Use the imported data
  const commonSkills = dashboardData.common_skills.map(skill => ({
    name: skill,
    level: 'Intermediate,category:General'
  }));
  
  const missingSkills = dashboardData.missing_skills;
  const competitors = dashboardData.competitors;
  const orgSkills = dashboardData.org_skills;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#ef4444';
      case 'Important': return '#f59e0b';
      case 'Nice to have': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Get displayed items (first 3 by default, all if expanded)
  const getDisplayedItems = (items, showAll) => {
    return showAll ? items : items.slice(0, 3);
  };

  const hasMoreItems = (items, showAll) => {
    return items.length > 3 && !showAll;
  };
  const canShowLess = (items, showAll) => {
    return items.length > 3 && showAll;
  };

  const skillGrowthData = [
    { month: 'Jan', ai: 10, cyber: 8, cloud: 12, data: 7 },
    { month: 'Feb', ai: 15, cyber: 10, cloud: 16, data: 9 },
    { month: 'Mar', ai: 22, cyber: 14, cloud: 20, data: 13 },
    { month: 'Apr', ai: 30, cyber: 18, cloud: 25, data: 17 },
    { month: 'May', ai: 28, cyber: 20, cloud: 27, data: 19 },
    { month: 'Jun', ai: 35, cyber: 25, cloud: 32, data: 23 },
    { month: 'Jul', ai: 40, cyber: 28, cloud: 36, data: 27 },
  ];

  return (
    <div className="page-wrapper">
      <div className="layout-container">
        {/* Header */}
        <motion.div 
          className="content-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="dashboard__welcome">
            <h2 className="dashboard__welcome-title">
              Welcome back, {user?.name || 'User'}! ��
            </h2>
          </div>
          <h2 className="dashboard__title dashboard__title--center">
            Skills Intelligence Dashboard
          </h2>
          <p className="dashboard__subtitle dashboard__subtitle--center">
            Comprehensive analysis of your skills, gaps, and competitive landscape
          </p>
        </motion.div>

        {/* Company Selection */}
        <motion.div 
          className="content-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <CompanySelectionDropdown />
        </motion.div>

        {/* Main Dashboard Grid - All three blocks on the same line */}
        <div className="layout-grid layout-grid--3">
          {/* Skills to Competitors Mapping - FIRST BLOCK */}
          <motion.div 
            className="layout-card layout-card--elevated dashboard__card-spaced"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ borderLeft: '3px solid #3b82f6' }}
          >
            <div className="dashboard__section-header">
              <div className="dashboard__section-icon" style={{ backgroundColor: '#3b82f6' }}>
                <Users size={20} />
              </div>
              <div className="dashboard__section-title">
                <h3>Competitor Skill Match</h3>
                <p>Competitive landscape analysis</p>
              </div>
            </div>
            <div className="dashboard__competitors-list">
              {getDisplayedItems(competitors, showAllCompetitors).map((competitor, index) => (
                <motion.div 
                  key={`${competitor.skill}-${competitor.company}`}
                  className="dashboard__competitor-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <div className="dashboard__competitor-skill">
                    <Target size={14} />
                    <span>{competitor.skill}</span>
                  </div>
                  <div className="dashboard__competitor-company">
                    <Building2 size={14} />
                    <span>{competitor.company}</span>
                  </div>
                  <div className="dashboard__competitor-stats">
                    <span className="dashboard__competitor-employees">
                      {competitor.employees} employees
                    </span>
                    <span className="dashboard__competitor-share">
                      {competitor.marketShare} market share
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            {hasMoreItems(competitors, showAllCompetitors) && (
              <motion.button
                className="dashboard__show-more-btn"
                onClick={() => setShowAllCompetitors(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={16} /> Show More
              </motion.button>
            )}
            {canShowLess(competitors, showAllCompetitors) && (
              <motion.button
                className="dashboard__show-more-btn"
                onClick={() => setShowAllCompetitors(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronUp size={16} /> Show Less
              </motion.button>
            )}
          </motion.div>

          {/* Skills Already Possessed - SECOND BLOCK */}
          <motion.div 
            className="layout-card layout-card--elevated dashboard__card-spaced"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{ borderLeft: '3px solid #10b981' }}
          >
            <div className="dashboard__section-header">
              <div className="dashboard__section-icon" style={{ backgroundColor: '#10b981' }}>
                <CheckCircle size={20} />
              </div>
              <div className="dashboard__section-title">
                <h3>Skills Already Possessed</h3>
                <p>Your current skill portfolio</p>
              </div>
            </div>
            <div className="dashboard__skills-grid">
              {getDisplayedItems(commonSkills, showAllCommonSkills).map((skill, index) => (
                <motion.div 
                  key={skill.name}
                  className="dashboard__skill-item dashboard__skill-item--possessed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <div className="dashboard__skill-header">
                    <span className="dashboard__skill-name">{skill.name}</span>
                    <span className="dashboard__skill-level">{skill.level}</span>
                  </div>
                  <span className="dashboard__skill-category">{skill.category}</span>
                </motion.div>
              ))}
            </div>
            {hasMoreItems(commonSkills, showAllCommonSkills) && (
              <motion.button
                className="dashboard__show-more-btn"
                onClick={() => setShowAllCommonSkills(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={16} /> Show More
              </motion.button>
            )}
            {canShowLess(commonSkills, showAllCommonSkills) && (
              <motion.button
                className="dashboard__show-more-btn"
                onClick={() => setShowAllCommonSkills(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronUp size={16} /> Show Less
              </motion.button>
            )}
          </motion.div>

          {/* Skills That Are Missing - THIRD BLOCK */}
          <motion.div 
            className="layout-card layout-card--elevated dashboard__card-spaced"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ borderLeft: '3px solid #ef4444' }}
          >
            <div className="dashboard__section-header">
              <div className="dashboard__section-icon" style={{ backgroundColor: '#ef4444' }}>
                <AlertCircle size={20} />
              </div>
              <div className="dashboard__section-title">
                <h3>Skills That Are Missing</h3>
                <p>Critical gaps to address</p>
              </div>
            </div>
            <div className="dashboard__skills-grid">
              {getDisplayedItems(missingSkills, showAllMissingSkills).map((skill, index) => (
                <motion.div 
                  key={skill.name}
                  className="dashboard__skill-item dashboard__skill-item--missing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <div className="dashboard__skill-header">
                    <span className="dashboard__skill-name">{skill.name}</span>
                    <span 
                      className="dashboard__skill-demand"
                      style={{ color: getDemandColor(skill.demand) }}
                    >
                      {skill.demand} Demand
                    </span>
                  </div>
                  <span 
                    className="dashboard__skill-priority"
                    style={{ color: getPriorityColor(skill.priority) }}
                  >
                    {skill.priority} Priority
                  </span>
                </motion.div>
              ))}
            </div>
            {hasMoreItems(missingSkills, showAllMissingSkills) && (
              <motion.button
                className="dashboard__show-more-btn"
                onClick={() => setShowAllMissingSkills(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={16} /> Show More
              </motion.button>
            )}
            {canShowLess(missingSkills, showAllMissingSkills) && (
              <motion.button
                className="dashboard__show-more-btn"
                onClick={() => setShowAllMissingSkills(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronUp size={16} /> Show Less
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Summary Stats + Top Skill Growth Trend */}
        <motion.div 
          className="content-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="dashboard__summary-row">
            <div className="dashboard__summary-vertical">
              <div className="dashboard__summary-card">
                <div className="dashboard__summary-icon" style={{ backgroundColor: '#10b981' }}>
                  <CheckCircle size={18} />
                </div>
                <div className="dashboard__summary-content">
                  <h4>Total Skills Possessed</h4>
                  <span className="dashboard__summary-value">{commonSkills.length}</span>
                </div>
              </div>
              <div className="dashboard__summary-card">
                <div className="dashboard__summary-icon" style={{ backgroundColor: '#ef4444' }}>
                  <AlertCircle size={18} />
                </div>
                <div className="dashboard__summary-content">
                  <h4>Skills to Develop</h4>
                  <span className="dashboard__summary-value">{missingSkills.length}</span>
                </div>
              </div>
              <div className="dashboard__summary-card">
                <div className="dashboard__summary-icon" style={{ backgroundColor: '#3b82f6' }}>
                  <Users size={18} />
                </div>
                <div className="dashboard__summary-content">
                  <h4>Competitors Tracked</h4>
                  <span className="dashboard__summary-value">{competitors.length}</span>
                </div>
              </div>
            </div>
            <div className="dashboard__summary-card dashboard__trend-card">
              <div className="dashboard__section-title" style={{ marginBottom: '1rem' }}>
                <h4>Top Skill Growth Trend</h4>
                <p>Recent growth in top skills</p>
              </div>
              <div className="dashboard__trend-chart-placeholder" style={{ padding: 0, background: 'none', border: 'none', height: 200 }}>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={skillGrowthData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 13 }} />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 13 }} />
                    <Line type="monotone" dataKey="ai" name="AI/ML" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="cyber" name="Cyber Security" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="cloud" name="Cloud Computing" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="data" name="Data Analytics" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
