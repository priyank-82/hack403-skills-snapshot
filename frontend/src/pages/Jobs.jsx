import React from 'react';
import JobList from '../components/JobList';
import '../styles/pages/Jobs.css';

function Jobs() {
  return (
    <div className="jobs-page">
      <div className="jobs-page__container">
        <JobList />
      </div>
    </div>
  );
}

export default Jobs;
