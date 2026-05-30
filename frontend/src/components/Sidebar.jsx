import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  BarChart3,
  Bot,
  Briefcase,
  Code,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/components/Sidebar.css';

const menuItems = [
  { 
    text: 'Dashboard', 
    icon: <BarChart3 size={20} />, 
    path: '/dashboard',
    description: 'Overview & Analytics'
  },
  { 
    text: 'Jobs', 
    icon: <Briefcase size={20} />, 
    path: '/jobs',
    description: 'Job Market Analysis'
  },
  { 
    text: 'Skills', 
    icon: <Target size={20} />, 
    path: '/skills',
    description: 'Skill Profiling'
  },
  { 
    text: 'UOP Content', 
    icon: <Code size={20} />, 
    path: '/api-tester',
    description: 'Professional Development',
    badge: 'PD'
  },
  { 
    text: 'AI Assistant', 
    icon: <Bot size={20} />, 
    path: '/ai',
    description: 'AI-Powered Insights',
    badge: 'NEW'
  },
];

const statsItems = [
  { icon: <TrendingUp size={16} />, label: 'Job Growth', value: '+15%' },
  { icon: <Users size={16} />, label: 'Active Users', value: '1.2K' },
  { icon: <Award size={16} />, label: 'Skills Tracked', value: '500+' },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__content">
        <h2 className="sidebar__title">Navigation</h2>
        
        <nav className="sidebar__nav">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="sidebar__nav-item"
            >
              <button
                onClick={() => handleNavigation(item.path)}
                className={`sidebar__nav-button ${
                  location.pathname === item.path ? 'sidebar__nav-button--active' : ''
                }`}
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                <div className="sidebar__nav-icon">
                  {item.icon}
                </div>
                <div className="sidebar__nav-text">
                  <div className="sidebar__nav-title">
                    <span>{item.text}</span>
                    {item.badge && (
                      <span className={`sidebar__badge sidebar__badge--${item.badge.toLowerCase()}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="sidebar__nav-description">
                    {item.description}
                  </p>
                </div>
              </button>
            </motion.div>
          ))}
        </nav>

        <div className="sidebar__divider"></div>

        <div className="sidebar__insights">
          <h3 className="sidebar__insights-title">Insights</h3>
          
          {statsItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="sidebar__insight-item"
            >
              <div className="sidebar__insight-info">
                <div className="sidebar__insight-icon">
                  {stat.icon}
                </div>
                <p className="sidebar__insight-label">
                  {stat.label}
                </p>
              </div>
              <p className="sidebar__insight-value">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
