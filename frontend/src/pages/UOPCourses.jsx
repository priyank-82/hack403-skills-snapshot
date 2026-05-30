import React from 'react';
import { motion } from 'framer-motion';
import UOPCourseContent from '../components/UOPCourseContent';
import '../styles/pages/UOPCourses.css';

const UOPCourses = () => {
  return (
    <div className="uop-courses-page">
      <div className="uop-courses-page__container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="uop-courses-page__content"
        >
          <UOPCourseContent />
        </motion.div>
      </div>
    </div>
  );
};

export default UOPCourses;
