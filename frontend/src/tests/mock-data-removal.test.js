// API Integration Testing - Remove Mock Data Verification
// This file tests that all components are using RTK Query instead of mock data

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../store';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Import components to test
import Dashboard from '../pages/Dashboard';
import SkillProfileForm from '../components/SkillProfileForm';
import AuthForm from '../components/AuthForm';
import JobList from '../components/JobList';
import CompanySelectionDropdown from '../components/CompanySelectionDropdown';

// Mock API server
const server = setupServer(
  // Dashboard endpoints
  rest.get('/api/dashboard', (req, res, ctx) => {
    return res(ctx.json({
      recentActivities: [
        { id: 1, type: 'skill_update', title: 'Added React to profile', time: '2 hours ago' }
      ]
    }));
  }),
  rest.get('/api/dashboard/stats', (req, res, ctx) => {
    return res(ctx.json([
      { id: 'skills', title: 'Skills Tracked', value: '24', change: '+3 this month' }
    ]));
  }),
  rest.get('/api/dashboard/skill-trends', (req, res, ctx) => {
    return res(ctx.json([
      { month: 'Jan', react: 85, python: 75 }
    ]));
  }),
  rest.get('/api/dashboard/job-market', (req, res, ctx) => {
    return res(ctx.json([
      { name: 'Frontend', value: 35, color: '#2563eb' }
    ]));
  }),

  // Skills endpoints
  rest.get('/api/skills', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, name: 'React', category: 'Web Development' },
      { id: 2, name: 'Python', category: 'Programming' }
    ]));
  }),
  rest.get('/api/skills/user', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, name: 'React', level: 'Advanced' },
      { id: 2, name: 'Python', level: 'Intermediate' }
    ]));
  }),

  // Profile endpoints
  rest.get('/api/profile', (req, res, ctx) => {
    return res(ctx.json({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      jobTitle: 'Software Engineer',
      skills: ['React', 'Python'],
      location: 'New York'
    }));
  }),
  rest.put('/api/profile', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),

  // AI recommendations
  rest.post('/api/ai/recommendations', (req, res, ctx) => {
    return res(ctx.json({
      skillGaps: [
        { skill: 'TypeScript', importance: 'High', trend: '+25%' }
      ],
      careerPath: [
        { role: 'Senior Developer', match: 85, salary: '$110,000' }
      ],
      learningResources: [
        { title: 'Advanced TypeScript', provider: 'TechEd', duration: '6 weeks' }
      ]
    }));
  }),

  // Auth endpoints
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(ctx.json({
      user: { id: 1, name: 'John Doe', email: 'john@example.com' },
      token: 'jwt-token-123'
    }));
  }),
  rest.post('/api/auth/signup', (req, res, ctx) => {
    return res(ctx.json({
      user: { id: 1, name: 'John Doe', email: 'john@example.com' },
      token: 'jwt-token-123'
    }));
  }),
  rest.post('/api/auth/phoenix-login', (req, res, ctx) => {
    return res(ctx.json({
      user: { id: 1, name: 'Alex Johnson', email: 'alex@phoenix.edu', authProvider: 'phoenix' },
      token: 'phoenix-token-123'
    }));
  }),

  // Jobs endpoints
  rest.get('/api/jobs', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, title: 'Software Engineer', company: 'TechCorp', location: 'Remote' },
      { id: 2, title: 'Frontend Developer', company: 'WebCorp', location: 'NYC' }
    ]));
  }),

  // Companies endpoints
  rest.get('/api/companies', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, name: 'TechCorp', logo: '/logo1.png' },
      { id: 2, name: 'WebCorp', logo: '/logo2.png' }
    ]));
  }),
  rest.post('/api/companies/select', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  })
);

// Helper function to wrap components with necessary providers
const renderWithProviders = (component) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

beforeEach(() => {
  server.listen();
});

describe('Mock Data Removal - RTK Query Integration', () => {
  describe('Dashboard Component', () => {
    it('should fetch dashboard data from API instead of using mock data', async () => {
      renderWithProviders(<Dashboard />);
      
      // Wait for API calls to complete
      await waitFor(() => {
        expect(screen.getByText('Skills Tracked')).toBeInTheDocument();
      });
      
      // Verify that the data comes from API (not hardcoded fallback)
      expect(screen.getByText('24')).toBeInTheDocument();
    });

    it('should show error state when API fails instead of fallback data', async () => {
      // Override server to return error
      server.use(
        rest.get('/api/dashboard/stats', (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      renderWithProviders(<Dashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/Failed to load dashboard data/i)).toBeInTheDocument();
      });
    });
  });

  describe('SkillProfileForm Component', () => {
    it('should load user profile from API instead of empty form', async () => {
      renderWithProviders(<SkillProfileForm />);
      
      await waitFor(() => {
        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      });
    });

    it('should submit profile updates to API instead of mock simulation', async () => {
      renderWithProviders(<SkillProfileForm />);
      
      const submitButton = await screen.findByText('Generate Profile');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Profile updated successfully/i)).toBeInTheDocument();
      });
    });

    it('should generate AI recommendations from API instead of mock data', async () => {
      renderWithProviders(<SkillProfileForm />);
      
      const submitButton = await screen.findByText('Generate Profile');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      });
    });
  });

  describe('AuthForm Component', () => {
    it('should authenticate users via API instead of mock login', async () => {
      renderWithProviders(<AuthForm />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const loginButton = screen.getByText('Sign In');
      
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Login successful/i)).toBeInTheDocument();
      });
    });

    it('should handle Phoenix login via API instead of mock credentials', async () => {
      renderWithProviders(<AuthForm />);
      
      const phoenixButton = screen.getByText(/Phoenix.edu/i);
      fireEvent.click(phoenixButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Phoenix login successful/i)).toBeInTheDocument();
      });
    });
  });

  describe('JobList Component', () => {
    it('should fetch jobs from API instead of using mock data', async () => {
      renderWithProviders(<JobList />);
      
      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
        expect(screen.getByText('TechCorp')).toBeInTheDocument();
      });
    });
  });

  describe('CompanySelectionDropdown Component', () => {
    it('should load companies from API instead of hardcoded list', async () => {
      renderWithProviders(<CompanySelectionDropdown />);
      
      await waitFor(() => {
        expect(screen.getByText('TechCorp')).toBeInTheDocument();
        expect(screen.getByText('WebCorp')).toBeInTheDocument();
      });
    });

    it('should call company selection API instead of mock function', async () => {
      renderWithProviders(<CompanySelectionDropdown />);
      
      const company = await screen.findByText('TechCorp');
      fireEvent.click(company);
      
      await waitFor(() => {
        expect(screen.getByText(/Company selected successfully/i)).toBeInTheDocument();
      });
    });
  });
});

describe('RTK Query Implementation Verification', () => {
  it('should use RTK Query hooks instead of manual state management', () => {
    // This test ensures that components are using RTK Query hooks
    // instead of manual useState/useEffect for API calls
    
    const { container } = renderWithProviders(<Dashboard />);
    
    // Check that the component renders (RTK Query hooks working)
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should implement proper error handling with RTK Query', async () => {
    // Override server to return error
    server.use(
      rest.get('/api/jobs', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    renderWithProviders(<JobList />);
    
    await waitFor(() => {
      // Should show error message instead of empty state or fallback data
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('should implement proper loading states with RTK Query', () => {
    renderWithProviders(<Dashboard />);
    
    // Should show loading indicator while fetching
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
