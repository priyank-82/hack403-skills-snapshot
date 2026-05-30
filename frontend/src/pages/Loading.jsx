import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Brain, 
  Briefcase, 
  Sparkles
} from 'lucide-react';
import '../styles/pages/Loading.css';

// Simple loading spinner component
export const LoadingSpinner = ({ size = 40, color = 'primary' }) => (
  <div className="loading-container">
    <div 
      className="loading-spinner" 
      style={{ 
        width: size, 
        height: size,
        borderColor: color === 'primary' ? '#e5e7eb' : '#e5e7eb',
        borderTopColor: color === 'primary' ? '#DB3725' : color
      }}
    />
  </div>
);

// Loading with text
export const LoadingWithText = ({ text = 'Loading...', size = 40 }) => (
  <div className="loading-with-text">
    <div 
      className="loading-spinner" 
      style={{ width: size, height: size }}
    />
    <p className="loading-text">
      {text}
    </p>
  </div>
);

// Full page loading screen
export const FullPageLoader = ({ 
  message = 'Loading Skills Snapshot...', 
  submessage = 'Please wait while we prepare your experience',
  showProgress = false,
  progress = 0
}) => (
  <div className="full-page-loader">
    {/* Background Animation */}
    <motion.div
      className="full-page-loader__background"
      animate={{
        backgroundPosition: ['0% 0%', '100% 100%'],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear'
      }}
    />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="full-page-loader__content"
    >
      {/* Logo Animation */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }}
        className="full-page-loader__logo"
      >
        <Brain size={64} />
      </motion.div>

      {/* Title */}
      <h1 className="full-page-loader__title">
        Skills Snapshot
      </h1>

      {/* Main Message */}
      <h2 className="full-page-loader__message">
        {message}
      </h2>

      {/* Sub Message */}
      <p className="full-page-loader__submessage">
        {submessage}
      </p>

      {/* Progress Bar */}
      {showProgress && (
        <div className="full-page-loader__progress">
          <div className="progress-bar">
            <div 
              className="progress-bar__fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="progress-text">
            {progress}%
          </p>
        </div>
      )}

      {/* Loading Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="full-page-loader__spinner"
      >
        <div className="loading-spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
      </motion.div>

      {/* Loading dots animation */}
      <div className="full-page-loader__dots">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="loading-dot"
          />
        ))}
      </div>
    </motion.div>
  </div>
);

// Phoenix.edu themed loading
export const PhoenixLoader = ({ 
  message = 'Connecting to Phoenix.edu...',
  submessage = 'Authenticating your credentials'
}) => (
  <div className="phoenix-loader">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="phoenix-loader__content"
    >
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="phoenix-loader__icon"
      >
        <GraduationCap size={72} />
      </motion.div>

      <h1 className="phoenix-loader__title">
        University of Phoenix
      </h1>

      <h2 className="phoenix-loader__message">
        {message}
      </h2>

      <p className="phoenix-loader__submessage">
        {submessage}
      </p>

      <div className="phoenix-loader__spinner">
        <div className="loading-spinner loading-spinner--white" />
      </div>
    </motion.div>
  </div>
);

// Dashboard loading skeleton
export const DashboardSkeleton = () => (
  <div className="dashboard-skeleton">
    <div className="dashboard-skeleton__header">
      <div className="skeleton-text skeleton-text--large skeleton-text--40"></div>
    </div>
    
    <div className="dashboard-skeleton__cards">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="dashboard-skeleton__card">
          <div className="skeleton-text skeleton-text--60"></div>
          <div className="skeleton-text skeleton-text--40"></div>
          <div className="skeleton-rectangle skeleton-rectangle--large"></div>
        </div>
      ))}
    </div>

    <div className="dashboard-skeleton__chart">
      <div className="skeleton-text skeleton-text--30"></div>
      <div className="skeleton-rectangle skeleton-rectangle--chart"></div>
    </div>
  </div>
);

// Job loading skeleton
export const JobSkeleton = () => (
  <div className="job-skeleton">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="job-skeleton__item">
        <div className="job-skeleton__header">
          <div className="skeleton-circle"></div>
          <div className="job-skeleton__info">
            <div className="skeleton-text skeleton-text--60"></div>
            <div className="skeleton-text skeleton-text--40"></div>
          </div>
        </div>
        <div className="skeleton-text skeleton-text--100"></div>
        <div className="skeleton-text skeleton-text--80"></div>
        <div className="job-skeleton__tags">
          <div className="skeleton-tag"></div>
          <div className="skeleton-tag"></div>
          <div className="skeleton-tag"></div>
        </div>
      </div>
    ))}
  </div>
);

// AI Chat loading
export const AIChatLoader = ({ message = 'AI is thinking...' }) => (
  <div className="ai-chat-loader">
    <motion.div
      animate={{ 
        rotate: [0, 360],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
        scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
      }}
      className="ai-chat-loader__icon"
    >
      <Sparkles size={24} />
    </motion.div>
    
    <p className="ai-chat-loader__message">
      {message}
    </p>
    
    <div className="ai-chat-loader__dots">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2
          }}
          className="ai-chat-loader__dot"
        />
      ))}
    </div>
  </div>
);

// Company selection loading
export const CompanySelectionLoader = () => (
  <div className="company-selection-loader">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="company-selection-loader__content"
    >
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }}
        className="company-selection-loader__icon"
      >
        <Briefcase size={56} />
      </motion.div>

      <h2 className="company-selection-loader__title">
        Loading Companies
      </h2>

      <p className="company-selection-loader__message">
        Fetching available companies for your selection...
      </p>

      <div className="company-selection-loader__spinner">
        <div className="loading-spinner loading-spinner--white" />
      </div>
    </motion.div>
  </div>
);

// Main Loading component with different variants
function Loading({ 
  variant = 'full', 
  message,
  submessage,
  showProgress = false,
  progress = 0,
  size = 40 
}) {
  switch (variant) {
    case 'spinner':
      return <LoadingSpinner size={size} />;
    
    case 'text':
      return <LoadingWithText text={message} size={size} />;
    
    case 'phoenix':
      return <PhoenixLoader message={message} submessage={submessage} />;
    
    case 'dashboard':
      return <DashboardSkeleton />;
    
    case 'jobs':
      return <JobSkeleton />;
    
    case 'ai':
      return <AIChatLoader message={message} />;
    
    case 'company':
      return <CompanySelectionLoader />;
    
    case 'full':
    default:
      return (
        <FullPageLoader 
          message={message}
          submessage={submessage}
          showProgress={showProgress}
          progress={progress}
        />
      );
  }
}

export default Loading;
