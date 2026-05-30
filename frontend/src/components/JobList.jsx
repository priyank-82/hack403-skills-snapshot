import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronDown } from 'lucide-react';
import { companies } from '../utils/companies';
import '../styles/components/JobList.css';

const JOBS_PER_PAGE = 5;

const JobList = () => {
  const companyId = useSelector((state) => state.ui.selectedCompany) || '';
  const companyObj = companies.find(c => c.id === companyId);
  const companyName = companyObj ? companyObj.name : '';
  const companyLogo = companyObj ? companyObj.logo : '';
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [expandedJob, setExpandedJob] = useState(null);

  useEffect(() => {
    if (!companyName) return;
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = `http://localhost:8000/job-postings?company_name=${encodeURIComponent(companyName)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch job postings');
        const data = await response.json();
        const jobsArray = Array.isArray(data?.data?.postings) ? data.data.postings : [];
        setJobs(jobsArray);
        setPage(1); // Reset to first page on new company
      } catch (err) {
        setError(err.message || 'Failed to fetch job postings');
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, [companyName]);

  const handleToggleExpanded = (jobId) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  // Pagination logic
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const paginatedJobs = jobs.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  const handlePreviousPage = () => setPage((prevPage) => Math.max(1, prevPage - 1));
  const handleNextPage = () => setPage((prevPage) => Math.min(totalPages, prevPage + 1));

  const renderLoadingState = () => (
    <div className="job-list__loading-container">
      <div className="job-list__loading-spinner"></div>
      <p className="job-list__loading-text">Loading job postings...</p>
    </div>
  );

  const renderErrorState = () => (
    <div className="job-list__error-container">
      <div className="job-list__error-alert">
        {error}
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="job-list__empty-container">
      <h3 className="job-list__empty-title">No jobs found</h3>
      <p className="job-list__empty-subtitle">Try another company or check back later.</p>
    </div>
  );

  const renderJobCard = (job) => {
    const isExpanded = expandedJob === job.id;
    const shouldShowToggle = job.body && job.body.length > 200;
    const displayDescription = isExpanded ? job.body : (shouldShowToggle ? job.body.slice(0, 200) + '...' : job.body);

    return (
      <div key={job.id} className="job-list__job-card">
        <div className="job-list__job-header">
          <div className="job-list__job-info">
            <h3 className="job-list__job-title">{job.title_raw}</h3>
            <p className="job-list__job-company">
              {job.company_name} — {job.city_name}
            </p>
          </div>
        </div>
        
        <p className="job-list__job-description">{displayDescription}</p>
        
        {shouldShowToggle && (
          <button 
            className="job-list__show-more-button"
            onClick={() => handleToggleExpanded(job.id)}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
            <ChevronDown 
              className={`job-list__expand-icon ${isExpanded ? 'job-list__expand-icon--expanded' : ''}`}
            />
          </button>
        )}
      </div>
    );
  };

  const renderPagination = () => (
    <div className="job-list__pagination">
      <button 
        className="job-list__pagination-button"
        onClick={handlePreviousPage} 
        disabled={page === 1}
      >
        Previous
      </button>
      <p className="job-list__pagination-info">
        Page {page} of {totalPages}
      </p>
      <button 
        className="job-list__pagination-button"
        onClick={handleNextPage} 
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );

  if (isLoading) return renderLoadingState();
  if (error) return renderErrorState();
  if (!jobs.length) return renderEmptyState();

  return (
    <div className="job-list">
      <div className="job-list__header">
        {companyLogo && (
          <img 
            src={companyLogo} 
            alt={companyName} 
            className="job-list__company-logo"
          />
        )}
        <h2 className="job-list__title">
          Job Postings for {companyName}
        </h2>
      </div>
      
      <div className="job-list__grid">
        {paginatedJobs.map(renderJobCard)}
      </div>
      
      {renderPagination()}
    </div>
  );
};

export default JobList;
