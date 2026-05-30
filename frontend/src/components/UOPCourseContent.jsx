import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  GraduationCap, 
  Award, 
  TrendingUp, 
  ChevronRight,
  Star,
  Clock,
  Users,
  Target,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { courseSkillMappingAPI } from '../api/courseSkillMapping';
import { companies } from '../utils/companies';
import Loading from '../pages/Loading';
import '../styles/components/UOPCourseContent.css';

const UOPCourseContent = () => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const selectedCompany = useSelector((state) => state.ui.selectedCompany);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!selectedCompany) {
        setCourseData(null);
        return;
      }

      const company = companies.find(c => c.id === selectedCompany);
      if (!company) return;

      setLoading(true);
      setError(null);

      try {
        const response = await courseSkillMappingAPI.getCourseSkillMapping(company.name);
        
        if (response.success) {
          const formattedData = courseSkillMappingAPI.formatCourseSkillMapping(response.data);
          setCourseData(formattedData);
        } else {
          setError(response.error || 'Failed to fetch course data');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [selectedCompany]);

  if (!selectedCompany) {
    return (
      <div className="uop-course-content">
        <motion.div 
          className="uop-course-content__placeholder"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          >
            <GraduationCap size={48} className="uop-course-content__placeholder-icon" />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Select a Company
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Choose a company to see relevant UOP courses and skills
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="uop-course-content">
        <Loading variant="spinner" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="uop-course-content">
        <div className="uop-course-content__error">
          <h3>Error Loading Course Data</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!courseData || courseData.skills.length === 0) {
    return (
      <div className="uop-course-content">
        <div className="uop-course-content__empty">
          <BookOpen size={32} className="uop-course-content__empty-icon" />
          <h3>No Course Data Available</h3>
          <p>Course mapping data is not available for this company</p>
        </div>
      </div>
    );
  }

  const displayedSkills = showAllSkills ? courseData.skills : courseData.skills.slice(0, 5);
  const topCourses = courseSkillMappingAPI.getTopUOPCourses(courseData, showAllCourses ? 20 : 8);

  // Use the natural order from API response (which matches the backend skills order)
  const sortedSkills = displayedSkills;

  return (
    <div className="uop-course-content">
      {/* Header */}
      <motion.div 
        className="uop-course-content__header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="uop-course-content__header-icon"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          <GraduationCap size={28} />
        </motion.div>
        <motion.div 
          className="uop-course-content__header-content"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2>University of Phoenix Professional Development</h2>
          <p>Advance your career with courses and programs aligned with in-demand skills</p>
        </motion.div>
      </motion.div>

      {/* Statistics */}
      <motion.div 
        className="uop-course-content__stats"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <motion.div 
          className="uop-course-content__stat"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="uop-course-content__stat-icon">
            <Target size={24} />
          </div>
          <div className="uop-course-content__stat-content">
            <motion.span 
              className="uop-course-content__stat-value"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {courseData.totalSkills}
            </motion.span>
            <span className="uop-course-content__stat-label">Skills Mapped</span>
          </div>
        </motion.div>
        <motion.div 
          className="uop-course-content__stat"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="uop-course-content__stat-icon">
            <BookOpen size={24} />
          </div>
          <div className="uop-course-content__stat-content">
            <motion.span 
              className="uop-course-content__stat-value"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              {courseData.totalCourses}
            </motion.span>
            <span className="uop-course-content__stat-label">Total Courses</span>
          </div>
        </motion.div>
        <motion.div 
          className="uop-course-content__stat"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="uop-course-content__stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="uop-course-content__stat-content">
            <motion.span 
              className="uop-course-content__stat-value"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              {Math.round(courseData.totalCourses / courseData.totalSkills * 10) / 10}
            </motion.span>
            <span className="uop-course-content__stat-label">Avg Courses/Skill</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="uop-course-content__grid">
        {/* Professional Development Focus Section */}
        <motion.div 
          className="uop-course-content__section uop-course-content__section--featured"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          whileHover={{ y: -4 }}
        >
          <motion.div 
            className="uop-course-content__section-header"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div 
              className="uop-course-content__section-header-icon"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
            >
              <Award size={20} />
            </motion.div>
            <div>
              <h3>Professional Development Courses</h3>
              <p>Targeted skill-building programs for career advancement</p>
            </div>
          </motion.div>
          
          <div className="uop-course-content__pd-highlights">
            {sortedSkills.slice(0, 3).map((skill, index) => (
              <motion.div 
                key={skill.name}
                className="uop-course-content__pd-item"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  className="uop-course-content__pd-skill"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                >
                  <Sparkles size={14} />
                  <span>{skill.name}</span>
                </motion.div>
                <motion.div 
                  className="uop-course-content__pd-courses"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.4, type: "spring" }}
                >
                  {skill.totalPdCourses > 0 ? (
                    <span className="uop-course-content__pd-count">
                      {skill.totalPdCourses} PD Courses Available
                    </span>
                  ) : (
                    <span className="uop-course-content__pd-count uop-course-content__pd-count--none">
                      See Degree Programs
                    </span>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Skills Section */}
        <motion.div 
          className="uop-course-content__section"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="uop-course-content__section-header">
            <h3>Skills with UOP Course Options</h3>
            <p>Top skills from your profile matched with University of Phoenix offerings</p>
          </div>
          
          <div className="uop-course-content__skills-list">
            {sortedSkills.map((skill, index) => (
              <motion.div 
                key={skill.name}
                className="uop-course-content__skill-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <div className="uop-course-content__skill-header">
                  <span className="uop-course-content__skill-name">{skill.name}</span>
                  <span className="uop-course-content__skill-count">
                    {skill.totalCourses} courses
                  </span>
                </div>
                <div className="uop-course-content__skill-breakdown">
                  {skill.totalDegreeCourses > 0 && (
                    <span className="uop-course-content__skill-badge uop-course-content__skill-badge--degree">
                      <GraduationCap size={14} />
                      {skill.totalDegreeCourses} Degree
                    </span>
                  )}
                  {skill.totalPdCourses > 0 && (
                    <span className="uop-course-content__skill-badge uop-course-content__skill-badge--pd">
                      <Award size={14} />
                      {skill.totalPdCourses} Prof Dev
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {courseData.skills.length > 5 && (
            <button
              className="uop-course-content__show-more"
              onClick={() => setShowAllSkills(!showAllSkills)}
            >
              {showAllSkills ? (
                <>
                  <ChevronUp size={16} />
                  Show Less Skills
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Show More Skills ({courseData.skills.length - 5} more)
                </>
              )}
            </button>
          )}
        </motion.div>

        {/* Top Courses Section */}
        <motion.div 
          className="uop-course-content__section"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="uop-course-content__section-header">
            <h3>Recommended UOP Courses</h3>
            <p>Most relevant courses across all mapped skills</p>
          </div>
          
          <div className="uop-course-content__courses-list">
            {topCourses.map((course, index) => (
              <motion.div 
                key={course.name}
                className="uop-course-content__course-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
              >
                <div className="uop-course-content__course-header">
                  <BookOpen size={18} />
                  <span className="uop-course-content__course-name">{course.name}</span>
                </div>
                <div className="uop-course-content__course-meta">
                  <span className="uop-course-content__course-frequency">
                    <Star size={14} />
                    Covers {course.frequency} skills
                  </span>
                  <ChevronRight size={16} className="uop-course-content__course-arrow" />
                </div>
              </motion.div>
            ))}
          </div>

          {topCourses.length > 8 && (
            <button
              className="uop-course-content__show-more"
              onClick={() => setShowAllCourses(!showAllCourses)}
            >
              {showAllCourses ? (
                <>
                  <ChevronUp size={16} />
                  Show Less Courses
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Show More Courses
                </>
              )}
            </button>
          )}
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div 
        className="uop-course-content__cta"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
      >
        <motion.div 
          className="uop-course-content__cta-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            Ready to Advance Your Career?
          </motion.h3>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            Take advantage of University of Phoenix Professional Development courses designed to bridge your skills gap and accelerate your career growth
          </motion.p>
          <motion.div 
            className="uop-course-content__cta-buttons"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.5, type: "spring" }}
          >
            <motion.button 
              className="uop-course-content__cta-button uop-course-content__cta-button--primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Award size={20} />
              Professional Development
            </motion.button>
            <motion.button 
              className="uop-course-content__cta-button uop-course-content__cta-button--secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <GraduationCap size={20} />
              Degree Programs
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UOPCourseContent;
