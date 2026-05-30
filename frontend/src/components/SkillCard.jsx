import React from 'react';
import { Star, TrendingUp } from 'lucide-react';
import '../styles/components/SkillCard.css';

const SkillCard = ({ skill, level, category, trend, isNew = false }) => {
  const levelLabels = {
    1: 'Beginner',
    2: 'Novice',
    3: 'Intermediate', 
    4: 'Advanced',
    5: 'Expert'
  };

  const getProgressWidth = (level) => {
    return (level / 5) * 100;
  };

  return (
    <div className={`skill-card skill-card--level-${level}`}>
      {isNew && (
        <div className="skill-card__new-badge">
          New
        </div>
      )}
      
      <div className="skill-card__content">
        <div className="skill-card__header">
          <div className={`skill-card__avatar skill-card__avatar--level-${level}`}>
            <Star size={16} />
          </div>
          <div className="skill-card__info">
            <h3 className="skill-card__title">{skill}</h3>
            <p className="skill-card__category">{category}</p>
          </div>
        </div>

        <div className="skill-card__level-section">
          <div className="skill-card__level-header">
            <p className="skill-card__level-label">{levelLabels[level]}</p>
            <p className="skill-card__level-score">{level}/5</p>
          </div>
          <div className="skill-card__progress-bar">
            <div 
              className={`skill-card__progress-fill skill-card__progress-fill--level-${level}`}
              style={{ width: `${getProgressWidth(level)}%` }}
            />
          </div>
        </div>

        {trend && (
          <div className="skill-card__trend">
            <TrendingUp className="skill-card__trend-icon" />
            <p className="skill-card__trend-text">{trend} demand</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillCard;
