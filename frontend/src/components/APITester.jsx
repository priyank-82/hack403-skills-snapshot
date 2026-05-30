import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Award, Clock, Users, Star } from 'lucide-react';

const APITester = () => {
  const courseCategories = [
    {
      title: "Professional Development",
      icon: <GraduationCap size={24} />,
      color: "#6366f1",
      description: "Advance your career with specialized training programs"
    },
    {
      title: "Skill Enhancement",
      icon: <Award size={24} />,
      color: "#10b981",
      description: "Build industry-relevant skills and competencies"
    },
    {
      title: "Leadership Training",
      icon: <Users size={24} />,
      color: "#f59e0b",
      description: "Develop leadership capabilities and team management skills"
    },
    {
      title: "Certification Programs",
      icon: <Star size={24} />,
      color: "#ef4444",
      description: "Earn recognized certifications to validate your expertise"
    }
  ];

  const featuredCourses = [
    {
      title: "Project Management Essentials",
      duration: "8 weeks",
      level: "Intermediate",
      category: "Professional Development"
    },
    {
      title: "Data Analysis for Business",
      duration: "6 weeks", 
      level: "Beginner",
      category: "Skill Enhancement"
    },
    {
      title: "Strategic Leadership",
      duration: "12 weeks",
      level: "Advanced",
      category: "Leadership Training"
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="layout-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="content-section">
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              UOP Content
            </h1>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#6b7280',
              marginBottom: '32px'
            }}>
              University of Phoenix Professional Development and Learning Resources
            </p>
          </div>

          <div className="layout-grid layout-grid--2" style={{ marginBottom: '32px' }}>
            {courseCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="layout-card layout-card--elevated"
                style={{ 
                  borderLeft: `4px solid ${category.color}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="layout-flex" style={{ alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ 
                    padding: '12px', 
                    backgroundColor: category.color, 
                    borderRadius: '8px', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {category.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '600', 
                      color: '#1f2937',
                      marginBottom: '8px'
                    }}>
                      {category.title}
                    </h3>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {category.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="layout-card">
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#1f2937',
              marginBottom: '24px'
            }}>
              Featured Courses
            </h2>
            
            <div className="layout-grid layout-grid--3">
              {featuredCourses.map((course, index) => (
                <motion.div
                  key={course.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="layout-card layout-card--small"
                  style={{ 
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="layout-flex" style={{ alignItems: 'center', marginBottom: '12px' }}>
                    <BookOpen size={20} color="#6366f1" />
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: '#6366f1',
                      backgroundColor: '#eef2ff',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      {course.category}
                    </span>
                  </div>
                  
                  <h3 style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600', 
                    color: '#1f2937',
                    marginBottom: '8px'
                  }}>
                    {course.title}
                  </h3>
                  
                  <div className="layout-flex" style={{ gap: '16px', fontSize: '0.875rem', color: '#6b7280' }}>
                    <div className="layout-flex" style={{ alignItems: 'center', gap: '4px' }}>
                      <Clock size={16} />
                      <span>{course.duration}</span>
                    </div>
                    <span>•</span>
                    <span>{course.level}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="layout-card" style={{ marginTop: '32px', textAlign: 'center' }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Ready to Start Learning?
            </h3>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280',
              marginBottom: '24px'
            }}>
              Explore our comprehensive library of courses and start your professional development journey today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Browse All Courses
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default APITester;