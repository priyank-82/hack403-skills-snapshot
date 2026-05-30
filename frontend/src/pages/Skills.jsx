import React from 'react';
import { motion } from 'framer-motion';
import SkillProfileForm from '../components/SkillProfileForm';
import '../styles/pages/Skills.css';

function Skills() {
  return (
    <div className="skills-page">
      <div className="skills-page__container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="skills-page__content"
        >
          <SkillProfileForm />
        </motion.div>
      </div>
    </div>
  );
}

export default Skills;
