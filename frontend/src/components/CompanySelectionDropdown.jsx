import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Building2 } from 'lucide-react';
import { useNotifications } from '../hooks';
import { setSelectedCompany } from '../store/uiSlice';
import { companies } from '../utils/companies';
import '../styles/components/CompanySelectionDropdown.css';


const CompanySelectionDropdown = ({ compact = false }) => {
  const [error, setError] = useState(null);
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectedCompany = useSelector((state) => state.ui.selectedCompany) || '';
  const dispatch = useDispatch();
  const { showSuccess, showError } = useNotifications();

  const handleCompanyChange = async (event) => {
    const companyId = event.target.value;
    dispatch(setSelectedCompany(companyId));
    setJobPostings([]);
    setError(null);
    
    if (!companyId) return;
    
    const company = companies.find(c => c.id === companyId);
    if (!company) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/job-postings?company_name=${company.name}`);
      if (!response.ok) throw new Error('Failed to fetch job postings');
      const data = await response.json();
      setJobPostings(data);
      showSuccess(`Fetched job postings for ${company.name}`);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch job postings';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderCompactVersion = () => (
    <div className="company-dropdown">
      <div className="company-dropdown__form-control">
        <label className="company-dropdown__label">
          {loading ? 'Loading...' : 'Select a Company'}
        </label>
        <select
          className="company-dropdown__select"
          value={selectedCompany}
          onChange={handleCompanyChange}
          disabled={loading}
        >
          <option value="">Select a company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>
      
      {loading && (
        <div className="company-dropdown__loading">
          <div className="company-dropdown__loading-spinner"></div>
        </div>
      )}
      
      {error && (
        <div className="company-dropdown__error">
          {error}
        </div>
      )}
      
      {jobPostings.length > 0 && (
        <div className="company-dropdown__job-postings">
          <h4 className="company-dropdown__job-postings-title">Job Postings:</h4>
          <ul className="company-dropdown__job-list">
            {jobPostings.map((job, idx) => (
              <li key={job.id || idx} className="company-dropdown__job-item">
                {job.title || JSON.stringify(job)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderFullVersion = () => (
    <div className="company-dropdown__card">
      <div className="company-dropdown__card-content">
        <div className="company-dropdown__header">
          <h3 className="company-dropdown__title">Company Selection</h3>
        </div>
        
        {error && (
          <div className="company-dropdown__error">
            {error}
          </div>
        )}
        
        <div className="company-dropdown__form-control">
          <label className="company-dropdown__label">
            {loading ? 'Loading companies...' : 'Select a Company'}
          </label>
          <select
            className="company-dropdown__select"
            value={selectedCompany}
            onChange={handleCompanyChange}
            disabled={loading}
          >
            <option value="">Select a company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        
        {loading && (
          <div className="company-dropdown__loading-info">
            <div className="company-dropdown__loading-info-spinner"></div>
            <p className="company-dropdown__loading-info-text">
              Loading job postings...
            </p>
          </div>
        )}
        
        {jobPostings.length > 0 && (
          <div className="company-dropdown__job-postings">
            <h4 className="company-dropdown__job-postings-title">Job Postings:</h4>
            <ul className="company-dropdown__job-list">
              {jobPostings.map((job, idx) => (
                <li key={job.id || idx} className="company-dropdown__job-item">
                  {job.title || JSON.stringify(job)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  return compact ? renderCompactVersion() : renderFullVersion();
};

export default CompanySelectionDropdown;
