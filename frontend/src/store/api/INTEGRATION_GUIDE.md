# RTK Query Hooks Integration Guide

This guide shows how to integrate the RTK Query hooks into your existing React components.

## 1. Basic Setup

First, ensure your store is configured with the new RTK Query API:

```javascript
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './api/baseApi';
import authSlice from './authSlice';
import uiSlice from './uiSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(baseApi.middleware),
});

setupListeners(store.dispatch);
```

## 2. Import Hooks in Your Components

Replace old API imports with the new RTK Query hooks:

```javascript
// Old way
import { useGetJobsQuery, useApplyToJobMutation } from '../store/api';

// New way
import { 
  useGetJobsQuery, 
  useSubmitJobApplicationMutation,
  useCreateJobAlertMutation,
  useSearchJobsQuery 
} from '../store/api';
```

## 3. Authentication Components

### Login Component
```javascript
import React, { useState } from 'react';
import { useLoginMutation, useGetCurrentUserQuery } from '../store/api';

function LoginComponent() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [login, { isLoading, error }] = useLoginMutation();
  const { data: currentUser, isLoading: userLoading } = useGetCurrentUserQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials).unwrap();
      // Handle successful login
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  if (userLoading) return <div>Loading user...</div>;
  if (currentUser) return <div>Welcome, {currentUser.name}!</div>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        placeholder="Email"
      />
      <input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div>Error: {error.data?.message || 'Login failed'}</div>}
    </form>
  );
}
```

## 4. Job Listing Components

### Updated JobList Component
```javascript
import React, { useState } from 'react';
import { 
  useGetJobsQuery, 
  useSubmitJobApplicationMutation,
  useCreateJobAlertMutation,
  useSearchJobsQuery 
} from '../store/api';

function JobList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    salary_min: '',
    job_type: ''
  });

  // Get jobs with pagination and filters
  const { 
    data: jobsData, 
    isLoading, 
    error,
    refetch 
  } = useGetJobsQuery({
    page,
    limit: 10,
    search: searchTerm,
    ...filters
  });

  // Search jobs
  const { 
    data: searchResults, 
    isLoading: searchLoading 
  } = useSearchJobsQuery({
    query: searchTerm,
    filters
  }, {
    skip: !searchTerm
  });

  // Job application mutation
  const [submitJobApplication, { isLoading: isApplying }] = useSubmitJobApplicationMutation();

  // Job alert mutation
  const [createJobAlert] = useCreateJobAlertMutation();

  const handleApplyToJob = async (jobId) => {
    try {
      await submitJobApplication({ job_id: jobId }).unwrap();
      // Handle success
    } catch (err) {
      console.error('Application failed:', err);
    }
  };

  const handleCreateAlert = async () => {
    try {
      await createJobAlert({
        keywords: [searchTerm],
        location: filters.location,
        salary_min: filters.salary_min,
        email_notifications: true
      }).unwrap();
      // Handle success
    } catch (err) {
      console.error('Alert creation failed:', err);
    }
  };

  if (isLoading) return <div>Loading jobs...</div>;
  if (error) return <div>Error loading jobs: {error.message}</div>;

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({...filters, location: e.target.value})}
        />
        <button onClick={handleCreateAlert}>Create Alert</button>
      </div>

      {jobsData?.items?.map(job => (
        <div key={job.id} className="job-card">
          <h3>{job.title}</h3>
          <p>{job.company?.name}</p>
          <p>{job.location}</p>
          <button 
            onClick={() => handleApplyToJob(job.id)}
            disabled={isApplying}
          >
            {isApplying ? 'Applying...' : 'Apply'}
          </button>
        </div>
      ))}

      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Previous
      </button>
      <span>Page {page}</span>
      <button onClick={() => setPage(page + 1)}>
        Next
      </button>
    </div>
  );
}
```

## 5. Skills and Lightcast Integration

### Skills Component
```javascript
import React, { useState } from 'react';
import { 
  useGetSkillsQuery,
  useSearchSkillsQuery,
  useGetTrendingSkillsQuery,
  useGetLightcastTokenQuery 
} from '../store/api';

function SkillsComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get Lightcast token
  const { data: token } = useGetLightcastTokenQuery();
  
  // Get all skills
  const { data: skills, isLoading: skillsLoading } = useGetSkillsQuery({
    limit: 50
  });
  
  // Search skills
  const { data: searchResults, isLoading: searchLoading } = useSearchSkillsQuery({
    query: searchTerm,
    limit: 10
  }, {
    skip: !searchTerm
  });
  
  // Get trending skills
  const { data: trendingSkills } = useGetTrendingSkillsQuery();

  return (
    <div>
      <h2>Skills Management</h2>
      
      <input
        type="text"
        placeholder="Search skills..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && (
        <div>
          <h3>Search Results</h3>
          {searchLoading ? (
            <div>Searching...</div>
          ) : (
            searchResults?.items?.map(skill => (
              <div key={skill.id}>{skill.name}</div>
            ))
          )}
        </div>
      )}

      <div>
        <h3>Trending Skills</h3>
        {trendingSkills?.items?.map(skill => (
          <div key={skill.id}>{skill.name}</div>
        ))}
      </div>

      <div>
        <h3>All Skills</h3>
        {skillsLoading ? (
          <div>Loading skills...</div>
        ) : (
          skills?.items?.map(skill => (
            <div key={skill.id}>{skill.name}</div>
          ))
        )}
      </div>
    </div>
  );
}
```

## 6. Company Management

### Company Component
```javascript
import React, { useState } from 'react';
import { 
  useGetCompaniesQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation 
} from '../store/api';

function CompanyManagement() {
  const [newCompany, setNewCompany] = useState({
    name: '',
    description: '',
    industry: '',
    location: ''
  });

  const { data: companies, isLoading, refetch } = useGetCompaniesQuery();
  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation();
  const [deleteCompany] = useDeleteCompanyMutation();

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      await createCompany(newCompany).unwrap();
      setNewCompany({ name: '', description: '', industry: '', location: '' });
      refetch();
    } catch (err) {
      console.error('Failed to create company:', err);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    try {
      await deleteCompany(companyId).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to delete company:', err);
    }
  };

  return (
    <div>
      <h2>Company Management</h2>
      
      <form onSubmit={handleCreateCompany}>
        <input
          type="text"
          placeholder="Company Name"
          value={newCompany.name}
          onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
        />
        <textarea
          placeholder="Description"
          value={newCompany.description}
          onChange={(e) => setNewCompany({...newCompany, description: e.target.value})}
        />
        <input
          type="text"
          placeholder="Industry"
          value={newCompany.industry}
          onChange={(e) => setNewCompany({...newCompany, industry: e.target.value})}
        />
        <input
          type="text"
          placeholder="Location"
          value={newCompany.location}
          onChange={(e) => setNewCompany({...newCompany, location: e.target.value})}
        />
        <button type="submit" disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create Company'}
        </button>
      </form>

      <div>
        <h3>Companies</h3>
        {isLoading ? (
          <div>Loading companies...</div>
        ) : (
          companies?.items?.map(company => (
            <div key={company.id} className="company-card">
              <h4>{company.name}</h4>
              <p>{company.description}</p>
              <p>Industry: {company.industry}</p>
              <p>Location: {company.location}</p>
              <button onClick={() => handleDeleteCompany(company.id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

## 7. Lazy Queries for On-Demand Loading

### Location-Based Job Search
```javascript
import React, { useState } from 'react';
import { useLazyGetJobsByLocationQuery } from '../store/api';

function LocationJobSearch() {
  const [location, setLocation] = useState('');
  const [trigger, { data: jobs, isLoading, error }] = useLazyGetJobsByLocationQuery();

  const handleSearch = () => {
    if (location) {
      trigger({ location, limit: 20 });
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button onClick={handleSearch}>Search Jobs</button>
      
      {isLoading && <div>Searching...</div>}
      {error && <div>Error: {error.message}</div>}
      {jobs && (
        <div>
          {jobs.items?.map(job => (
            <div key={job.id}>
              <h3>{job.title}</h3>
              <p>{job.company?.name}</p>
              <p>{job.location?.city}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 8. Error Handling Best Practices

```javascript
import React from 'react';
import { useGetJobByIdQuery } from '../store/api';

function JobDetail({ jobId }) {
  const { 
    data: job, 
    isLoading, 
    error,
    isError,
    refetch 
  } = useGetJobByIdQuery(jobId);

  if (isLoading) return <div>Loading job details...</div>;
  
  if (isError) {
    const errorMessage = error?.data?.message || 'Failed to load job';
    return (
      <div>
        <div>Error: {errorMessage}</div>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h1>{job?.title}</h1>
      <p>{job?.description}</p>
      <p>Company: {job?.company?.name}</p>
      <p>Location: {job?.location}</p>
    </div>
  );
}
```

## 9. Performance Optimization

### Conditional Queries
```javascript
// Only fetch when user is authenticated
const { data: userProfile } = useGetUserProfileQuery(undefined, {
  skip: !isAuthenticated
});

// Only fetch when component is visible
const { data: analytics } = useGetJobStatsQuery(undefined, {
  skip: !isVisible
});
```

### Polling and Refetching
```javascript
const { data: realtimeJobs } = useGetJobsQuery(undefined, {
  pollingInterval: 30000, // Poll every 30 seconds
  refetchOnFocus: true,   // Refetch when window gains focus
  refetchOnReconnect: true // Refetch when connection is restored
});
```

## 10. Common Patterns

### Loading States
```javascript
function JobComponent() {
  const { data, isLoading, isFetching, isError } = useGetJobsQuery();

  if (isLoading) return <div>Initial loading...</div>;
  if (isError) return <div>Error occurred</div>;

  return (
    <div>
      {isFetching && <div>Updating...</div>}
      {/* Render job data */}
    </div>
  );
}
```

### Cache Management
```javascript
import { useDispatch } from 'react-redux';
import { baseApi } from '../store/api/baseApi';

function JobManagement() {
  const dispatch = useDispatch();

  const handleInvalidateCache = () => {
    // Invalidate all job-related queries
    dispatch(baseApi.util.invalidateTags(['Job']));
  };

  const handlePrefetchJob = (jobId) => {
    // Prefetch job details
    dispatch(baseApi.util.prefetch('getJobById', jobId));
  };

  return (
    <div>
      <button onClick={handleInvalidateCache}>Refresh All Jobs</button>
      <button onClick={() => handlePrefetchJob(123)}>Prefetch Job</button>
    </div>
  );
}
```

This guide should help you integrate the RTK Query hooks into your existing components. The hooks provide automatic caching, loading states, error handling, and background refetching out of the box.

```
if (!localStorage.getItem('token')) {
  localStorage.removeItem('selectedCompany');
}
```

```
localStorage.removeItem('selectedCompany');
```
