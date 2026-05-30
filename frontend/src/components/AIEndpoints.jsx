import { motion } from 'framer-motion';
import {
  Briefcase,
  Copy,
  Send,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import React, { useState } from 'react';
import '../styles/pages/AI.css';
import { THEME_COLORS } from '../styles/theme';

const aiEndpoints = [
  {
    id: 'skill-predictor',
    name: 'Skill Predictor',
    description: 'Predict future skill demands based on job market trends',
    icon: <Target size={20} />,
    color: THEME_COLORS.primary.main,
    endpoint: '/api/ai/skill-predictor',
    features: ['Market Analysis', 'Trend Prediction', 'Skill Mapping']
  },
  {
    id: 'job-matcher',
    name: 'Job Matcher',
    description: 'Find the best job matches based on your skills and preferences',
    icon: <Briefcase size={20} />,
    color: THEME_COLORS.secondary.main,
    endpoint: '/api/ai/job-matcher',
    features: ['Smart Matching', 'Salary Insights', 'Location Analysis']
  },
  {
    id: 'career-advisor',
    name: 'Career Advisor',
    description: 'Get personalized career advice and growth recommendations',
    icon: <TrendingUp size={20} />,
    color: THEME_COLORS.success.main,
    endpoint: '/api/ai/career-advisor',
    features: ['Career Planning', 'Skill Gaps', 'Learning Path']
  },
  {
    id: 'market-analyzer',
    name: 'Market Analyzer',
    description: 'Analyze job market conditions and industry trends',
    icon: <Users size={20} />,
    color: THEME_COLORS.warning.main,
    endpoint: '/api/ai/market-analyzer',
    features: ['Market Trends', 'Demand Analysis', 'Competitive Intelligence']
  }
];

const sampleRequests = [
  {
    endpoint: 'skill-predictor',
    title: 'Predict React Skills Demand',
    query: 'What will be the demand for React developers in the next 2 years?',
    category: 'Skill Prediction'
  },
  {
    endpoint: 'job-matcher',
    title: 'Find Frontend Jobs',
    query: 'Find frontend developer jobs for someone with 5 years of experience in React and Node.js',
    category: 'Job Matching'
  },
  {
    endpoint: 'career-advisor',
    title: 'Career Growth Path',
    query: 'I\'m a mid-level developer, what should I learn to become a senior developer?',
    category: 'Career Advice'
  },
  {
    endpoint: 'market-analyzer',
    title: 'Tech Market Analysis',
    query: 'Analyze the current demand for AI/ML skills in the tech industry',
    category: 'Market Analysis'
  }
];

function AIEndpoints({ sendQueryToGroq }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState(aiEndpoints[0]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const reply = await sendQueryToGroq(query.trim());
      console.log('AI reply:', reply, 'typeof:', typeof reply);
      setResponse({
        response: reply && typeof reply === 'object' && 'reply' in reply ? reply.reply : JSON.stringify(reply),
      });
      setQuery('');
    } catch (error) {
      console.error('Error:', error);
      setResponse({ response: 'No response from AI.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSampleRequest = (sample) => {
    const endpoint = aiEndpoints.find(ep => ep.id === sample.endpoint);
    if (endpoint) {
      setSelectedEndpoint(endpoint);
      setQuery(sample.query);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderResponse = (response) => {
    if (!response) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="ai-response"
      >
        <div className="ai-response__card">
          <div className="ai-response__header">
            <h3 className="ai-response__title">AI Response</h3>
            <button 
              className="ai-response__copy-btn"
              onClick={() => copyToClipboard(response.response)}
              title="Copy response"
            >
              <Copy size={16} />
            </button>
          </div>
          <div className="ai-response__content">
            <pre>{response.response || 'No response from AI.'}</pre>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="page-wrapper">
      <div className="layout-container">
        <div className="ai-endpoints">
          <div className="ai-endpoints__header">
            <h1 className="ai-endpoints__title">AI Endpoints</h1>
            <p className="ai-endpoints__subtitle">
              Leverage AI-powered insights for career planning and skill development
            </p>
          </div>

          <div className="ai-endpoints__container">
            {/* Endpoint Selection */}
            <div className="ai-endpoints__sidebar">
              <div className="ai-endpoints__card">
                <h3 className="ai-endpoints__card-title">Available Endpoints</h3>
                <div className="ai-endpoints__list">
                  {aiEndpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      className={`ai-endpoint-btn ${selectedEndpoint.id === endpoint.id ? 'ai-endpoint-btn--active' : ''}`}
                      onClick={() => setSelectedEndpoint(endpoint)}
                    >
                      <div className="ai-endpoint-btn__icon" style={{ color: endpoint.color }}>
                        {endpoint.icon}
                      </div>
                      <div className="ai-endpoint-btn__content">
                        <h4 className="ai-endpoint-btn__name">{endpoint.name}</h4>
                        <p className="ai-endpoint-btn__description">{endpoint.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sample Requests */}
              <div className="ai-endpoints__card">
                <h3 className="ai-endpoints__card-title">Sample Requests</h3>
                <div className="ai-endpoints__samples">
                  {sampleRequests.map((sample, index) => (
                    <button
                      key={index}
                      className="ai-sample-btn"
                      onClick={() => handleSampleRequest(sample)}
                    >
                      <div className="ai-sample-btn__content">
                        <h4 className="ai-sample-btn__title">{sample.title}</h4>
                        <p className="ai-sample-btn__category">{sample.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Interface */}
            <div className="ai-endpoints__main">
              {/* Selected Endpoint Info */}
              <div className="ai-endpoints__card ai-selected-endpoint">
                <div className="ai-selected-endpoint__header">
                  <div className="ai-selected-endpoint__avatar" style={{ backgroundColor: selectedEndpoint.color }}>
                    {selectedEndpoint.icon}
                  </div>
                  <div className="ai-selected-endpoint__info">
                    <h3 className="ai-selected-endpoint__name">{selectedEndpoint.name}</h3>
                    <p className="ai-selected-endpoint__description">{selectedEndpoint.description}</p>
                  </div>
                </div>
                <div className="ai-selected-endpoint__features">
                  {selectedEndpoint.features.map((feature, index) => (
                    <span 
                      key={index} 
                      className="ai-feature-chip"
                      style={{ borderColor: selectedEndpoint.color, color: selectedEndpoint.color }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Query Interface */}
              <div className="ai-endpoints__card ai-query-interface">
                <form onSubmit={handleSubmit} className="ai-query-form">
                  <div className="ai-query-form__field">
                    <label className="ai-query-form__label">Enter your query</label>
                    <textarea
                      className="ai-query-form__textarea"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={`Ask ${selectedEndpoint.name} anything about skills, jobs, or career planning...`}
                      rows={4}
                    />
                  </div>
                  <div className="ai-query-form__footer">
                    <div className="ai-query-form__meta">
                      <span className="ai-query-chip ai-query-chip--info">{selectedEndpoint.endpoint}</span>
                      <span className="ai-query-chip ai-query-chip--default">API v1.0</span>
                    </div>
                    <button
                      type="submit"
                      className="ai-query-form__submit"
                      disabled={loading || !query.trim()}
                    >
                      {loading ? (
                        <>
                          <div className="ai-spinner"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Query
                        </>
                      )}
                    </button>
                  </div>
                </form>
                {/* AI Response block directly below the form */}
                <div className="ai-response__card" style={{marginTop: '1.5rem'}}>
                  <div className="ai-response__header">
                    <h3 className="ai-response__title">AI Response</h3>
                  </div>
                  <div className="ai-response__content">
                  <pre>
                    {loading
                      ? 'Waiting for response...'
                      : response && response.response
                        ? response.response
                        : 'No response yet.'}
                  </pre>
                  </div>
                </div>
              </div>
              {/* End Query Interface */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIEndpoints;
