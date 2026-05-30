import React, { useState } from 'react';
import {
  useHealthCheckQuery,
  useLoginMutation,
  useGetCurrentUserQuery,
  useGetLightcastTokenQuery,
  useGetJobPostingsQuery,
  useSearchSkillsQuery,
  useGetJobsQuery,
  useCreateJobMutation,
  useCreateJobAlertMutation,
  useLazyGetJobsByLocationQuery,
} from '../store/api';

/**
 * Example component demonstrating RTK Query hooks usage
 * This shows how to use the various API hooks that have been created
 */
function RTKQueryExample() {
  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    password: ''
  });
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    location: '',
    skills: []
  });
  const [searchLocation, setSearchLocation] = useState('');

  // Example 1: Health Check Query
  const { data: healthStatus, isLoading: healthLoading } = useHealthCheckQuery();

  // Example 2: Authentication
  const [login, { isLoading: loginLoading, error: loginError }] = useLoginMutation();
  const { data: currentUser, isLoading: userLoading } = useGetCurrentUserQuery();

  // Example 3: Lightcast API
  const { data: lightcastToken } = useGetLightcastTokenQuery();
  const { data: jobPostings, isLoading: jobPostingsLoading } = useGetJobPostingsQuery({
    location: 'New York',
    skills: ['javascript', 'react'],
    experience_level: 'mid_level'
  });

  // Example 4: Skills Search
  const { data: skills, isLoading: skillsLoading } = useSearchSkillsQuery({
    query: 'javascript',
    limit: 10
  });

  // Example 5: Job Management
  const { data: jobs, isLoading: jobsLoading, refetch: refetchJobs } = useGetJobsQuery({
    page: 1,
    limit: 10
  });

  const [createJob, { isLoading: createJobLoading }] = useCreateJobMutation();
  const [createAlert] = useCreateJobAlertMutation();

  // Example 6: Lazy Query
  const [searchJobsByLocation, { 
    data: locationJobs, 
    isLoading: locationJobsLoading 
  }] = useLazyGetJobsByLocationQuery();

  // Event handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(loginCredentials).unwrap();
      console.log('Login successful:', result);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await createJob(jobData).unwrap();
      console.log('Job created successfully');
      refetchJobs(); // Refresh jobs list
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  const handleCreateAlert = async () => {
    try {
      await createAlert({
        keywords: ['javascript', 'react'],
        location: 'San Francisco',
        salary_min: 100000,
        email_notifications: true
      }).unwrap();
      console.log('Alert created successfully');
    } catch (error) {
      console.error('Failed to create alert:', error);
    }
  };

  const handleLocationSearch = () => {
    if (searchLocation) {
      searchJobsByLocation({ location: searchLocation, limit: 20 });
    }
  };

  return (
    <div className="rtk-query-example">
      <h1>RTK Query Examples</h1>

      {/* Health Check Example */}
      <section>
        <h2>1. Health Check</h2>
        {healthLoading ? (
          <div>Checking health...</div>
        ) : (
          <div>Health Status: {healthStatus?.status || 'Unknown'}</div>
        )}
      </section>

      {/* Authentication Example */}
      <section>
        <h2>2. Authentication</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={loginCredentials.email}
            onChange={(e) => setLoginCredentials({
              ...loginCredentials,
              email: e.target.value
            })}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginCredentials.password}
            onChange={(e) => setLoginCredentials({
              ...loginCredentials,
              password: e.target.value
            })}
          />
          <button type="submit" disabled={loginLoading}>
            {loginLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {loginError && <div>Login Error: {loginError.message}</div>}
        {userLoading ? (
          <div>Loading user...</div>
        ) : currentUser ? (
          <div>Welcome, {currentUser.name}!</div>
        ) : null}
      </section>

      {/* Lightcast API Example */}
      <section>
        <h2>3. Lightcast API</h2>
        <div>Token Status: {lightcastToken ? 'Active' : 'Not available'}</div>
        {jobPostingsLoading ? (
          <div>Loading job postings...</div>
        ) : jobPostings ? (
          <div>
            <h3>Job Postings ({jobPostings.total || 0})</h3>
            {jobPostings.jobs?.slice(0, 3).map((job, index) => (
              <div key={index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <h4>{job.title}</h4>
                <p>{job.company?.name}</p>
                <p>{job.location?.city}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* Skills Search Example */}
      <section>
        <h2>4. Skills Search</h2>
        {skillsLoading ? (
          <div>Loading skills...</div>
        ) : skills ? (
          <div>
            <h3>JavaScript Skills</h3>
            {skills.items?.slice(0, 5).map((skill, index) => (
              <div key={index}>{skill.name}</div>
            ))}
          </div>
        ) : null}
      </section>

      {/* Job Management Example */}
      <section>
        <h2>5. Job Management</h2>
        <form onSubmit={handleCreateJob}>
          <input
            type="text"
            placeholder="Job Title"
            value={jobData.title}
            onChange={(e) => setJobData({
              ...jobData,
              title: e.target.value
            })}
          />
          <textarea
            placeholder="Job Description"
            value={jobData.description}
            onChange={(e) => setJobData({
              ...jobData,
              description: e.target.value
            })}
          />
          <input
            type="text"
            placeholder="Location"
            value={jobData.location}
            onChange={(e) => setJobData({
              ...jobData,
              location: e.target.value
            })}
          />
          <button type="submit" disabled={createJobLoading}>
            {createJobLoading ? 'Creating...' : 'Create Job'}
          </button>
        </form>

        <button onClick={handleCreateAlert}>Create Job Alert</button>

        {jobsLoading ? (
          <div>Loading jobs...</div>
        ) : jobs ? (
          <div>
            <h3>Jobs ({jobs.total || 0})</h3>
            {jobs.items?.slice(0, 3).map((job, index) => (
              <div key={job.id || index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <h4>{job.title}</h4>
                <p>{job.description}</p>
                <p>{job.location}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* Lazy Query Example */}
      <section>
        <h2>6. Lazy Query - Search Jobs by Location</h2>
        <div>
          <input
            type="text"
            placeholder="Enter location"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
          <button onClick={handleLocationSearch}>Search Jobs</button>
        </div>
        {locationJobsLoading && <div>Searching jobs...</div>}
        {locationJobs && (
          <div>
            <h3>Jobs in {searchLocation}</h3>
            {locationJobs.items?.slice(0, 3).map((job, index) => (
              <div key={job.id || index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <h4>{job.title}</h4>
                <p>{job.company?.name}</p>
                <p>{job.location?.city}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default RTKQueryExample;
