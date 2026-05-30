import React, { useState } from 'react';
import { useAuth } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { useGetCompaniesFromJobsQuery } from '../store/api';
import '../styles/pages/CompanySelection.css';

function CompanySelection() {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const { data: companies = [], isLoading, error } = useGetCompaniesFromJobsQuery();

  const handleCompanySelect = async () => {
    if (!selectedCompany) return;
    
    setSubmitting(true);
    
    try {
      const company = companies.find(c => c.id === selectedCompany);
      
      const updatedUser = {
        ...user,
        company: company,
        companyId: company.id,
        companySelected: true
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      updateUser(updatedUser);
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Error selecting company:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="company-selection-page">
        <div className="company-selection__loading">
          <div className="company-selection__spinner"></div>
          <p>Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="company-selection-page">
      <div className="company-selection__container">
        <div className="company-selection__card">
          <h1 className="company-selection__title">Select Your Company</h1>
          
          {error && (
            <div className="company-selection__alert company-selection__alert--error">
              Failed to load companies
            </div>
          )}

          <div className="company-selection__form">
            <div className="company-selection__field-group">
              <label className="company-selection__label" htmlFor="company-select">
                Company
              </label>
              <select
                id="company-select"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="company-selection__select"
              >
                <option value="">Select a company...</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name} ({company.jobCount} jobs)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleCompanySelect}
              disabled={!selectedCompany || submitting}
              className="company-selection__submit-btn"
            >
              {submitting ? (
                <>
                  <div className="company-selection__spinner"></div>
                  Processing...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanySelection;
