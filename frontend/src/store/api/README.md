# RTK Query API Hooks

This directory contains RTK Query hooks for all API endpoints in the Skills Snapshot application.

## Structure

```
src/store/api/
├── baseApi.ts          # Base API configuration with authentication
├── rootApi.ts          # Root API endpoints (auth, users, companies)
├── lightcastApi.ts     # Lightcast API endpoints (skills, jobs, occupations)
├── jobPostingsApi.ts   # Job Postings API endpoints (jobs, alerts, applications)
├── index.ts            # Central export file
└── README.md           # This file
```

## Setup

1. **Install dependencies**:
```bash
npm install @reduxjs/toolkit react-redux
```

2. **Configure your store** (in `src/store/index.ts`):
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

3. **Wrap your app with the Provider** (in `src/index.tsx`):
```typescript
import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

## Usage Examples

### Authentication

```typescript
import { useLoginMutation, useGetCurrentUserQuery } from '../store/api';

function LoginForm() {
  const [login, { isLoading, error }] = useLoginMutation();
  const { data: user, isLoading: userLoading } = useGetCurrentUserQuery();

  const handleSubmit = async (credentials) => {
    try {
      const result = await login(credentials).unwrap();
      // Handle successful login
    } catch (error) {
      // Handle login error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Login form fields */}
    </form>
  );
}
```

### Lightcast API

```typescript
import { 
  useGetLightcastTokenQuery, 
  useGetJobPostingsQuery,
  useSearchSkillsQuery 
} from '../store/api';

function JobSearch() {
  // Get Lightcast token
  const { data: token } = useGetLightcastTokenQuery();
  
  // Get job postings with filters
  const { data: jobs, isLoading, error } = useGetJobPostingsQuery({
    location: 'New York',
    skills: ['javascript', 'react'],
    experience_level: 'mid_level'
  });

  // Search skills
  const { data: skills, isLoading: skillsLoading } = useSearchSkillsQuery({
    query: 'javascript',
    limit: 10
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Job Postings</h2>
      {jobs?.jobs?.map(job => (
        <div key={job.id}>
          <h3>{job.title}</h3>
          <p>{job.company.name}</p>
          <p>{job.location.city}</p>
        </div>
      ))}
    </div>
  );
}
```

### Job Postings API

```typescript
import { 
  useGetJobsQuery,
  useCreateJobMutation,
  useCreateJobAlertMutation 
} from '../store/api';

function JobManager() {
  const { data: jobs, isLoading, refetch } = useGetJobsQuery({
    page: 1,
    limit: 10
  });

  const [createJob, { isLoading: creating }] = useCreateJobMutation();
  const [createAlert] = useCreateJobAlertMutation();

  const handleCreateJob = async (jobData) => {
    try {
      await createJob(jobData).unwrap();
      refetch(); // Refetch jobs list
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  const handleCreateAlert = async (alertData) => {
    try {
      await createAlert(alertData).unwrap();
    } catch (error) {
      console.error('Failed to create alert:', error);
    }
  };

  return (
    <div>
      <button onClick={() => handleCreateJob(jobData)}>
        {creating ? 'Creating...' : 'Create Job'}
      </button>
      <button onClick={() => handleCreateAlert(alertData)}>
        Create Alert
      </button>
      {/* Job list */}
    </div>
  );
}
```

### Lazy Queries

```typescript
import { useLazyGetJobsByLocationQuery } from '../store/api';

function LocationJobSearch() {
  const [searchJobs, { data: jobs, isLoading, error }] = useLazyGetJobsByLocationQuery();

  const handleLocationSearch = (location) => {
    searchJobs({ location, limit: 20 });
  };

  return (
    <div>
      <button onClick={() => handleLocationSearch('San Francisco')}>
        Search SF Jobs
      </button>
      {isLoading && <div>Loading...</div>}
      {jobs && (
        <div>
          {jobs.items.map(job => (
            <div key={job.id}>{job.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Error Handling

```typescript
import { useGetJobByIdQuery } from '../store/api';

function JobDetail({ jobId }) {
  const { 
    data: job, 
    isLoading, 
    error,
    isError 
  } = useGetJobByIdQuery(jobId);

  if (isLoading) return <div>Loading...</div>;
  
  if (isError) {
    return (
      <div>
        Error: {error?.data?.message || 'Something went wrong'}
      </div>
    );
  }

  return (
    <div>
      <h1>{job.title}</h1>
      <p>{job.description}</p>
    </div>
  );
}
```

## Available Hooks

### Root API
- `useHealthCheckQuery()`
- `useLoginMutation()`
- `useLogoutMutation()`
- `useRefreshTokenMutation()`
- `useGetCurrentUserQuery()`
- `useGetUserProfileQuery()`
- `useUpdateUserProfileMutation()`
- `useDeleteUserProfileMutation()`
- `useGetCompaniesQuery()`
- `useGetCompanyByIdQuery()`
- `useCreateCompanyMutation()`
- `useUpdateCompanyMutation()`
- `useDeleteCompanyMutation()`
- `useUpdateUserCompanyMutation()`

### Lightcast API
- `useGetLightcastRootQuery()`
- `useGetLightcastTokenQuery()`
- `useGetJobPostingsQuery()`
- `useGetSkillsQuery()`
- `useGetSkillByIdQuery()`
- `useSearchSkillsQuery()`
- `useGetTrendingSkillsQuery()`
- `useGetOccupationsQuery()`
- `useGetOccupationByIdQuery()`
- `useSearchOccupationsQuery()`
- `useGetSkillsByOccupationQuery()`
- `useGetLaborMarketDataQuery()`
- `useGetEducationProgramsQuery()`
- `useGetSkillsGapAnalysisQuery()`

### Job Postings API
- `useGetJobsQuery()`
- `useGetJobByIdQuery()`
- `useCreateJobMutation()`
- `useUpdateJobMutation()`
- `useDeleteJobMutation()`
- `useSearchJobsQuery()`
- `useGetJobsByCompanyQuery()`
- `useGetJobsByLocationQuery()`
- `useGetJobsBySkillQuery()`
- `useGetJobsBySalaryRangeQuery()`
- `useGetJobCategoriesQuery()`
- `useGetJobsByCategoryQuery()`
- `useGetJobStatsQuery()`
- `useGetTrendingJobsQuery()`
- `useGetMarketInsightsQuery()`
- `useGetSkillsDemandQuery()`
- `useCreateJobAlertMutation()`
- `useGetUserJobAlertsQuery()`
- `useUpdateJobAlertMutation()`
- `useDeleteJobAlertMutation()`
- `useSubmitJobApplicationMutation()`
- `useGetUserJobApplicationsQuery()`
- `useGetJobApplicationByIdQuery()`
- `useUpdateJobApplicationStatusMutation()`

## Features

- **Automatic caching**: RTK Query automatically caches responses
- **Background refetching**: Automatically refetch data when needed
- **Optimistic updates**: Update UI immediately for better UX
- **Error handling**: Built-in error states and retry logic
- **Loading states**: Automatic loading state management
- **TypeScript support**: Full TypeScript support with proper typing
- **Authentication**: Automatic token management and refresh
- **Tag-based invalidation**: Efficient cache invalidation

## Configuration

Environment variables needed:
- `REACT_APP_API_BASE_URL`: Base URL for your API (default: http://localhost:3001)
- `REACT_APP_LIGHTCAST_API_URL`: Lightcast API URL (default: http://0.0.0.0:8000)
- `REACT_APP_LIGHTCAST_API_KEY`: Lightcast API key (optional)

## Notes

- All hooks return the standard RTK Query result object with `data`, `isLoading`, `error`, etc.
- Lazy queries don't run immediately and return a trigger function
- Mutations return a trigger function and result object
- Tags are used for cache invalidation - creating/updating/deleting items will invalidate related queries
- Authentication is handled automatically with token refresh on 401 errors
