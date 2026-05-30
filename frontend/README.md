# Skills Snapshot - AI-Powered Career Companion

A modern, responsive React application for career planning, skill analysis, and job matching using AI-powered insights.

## ✨ Features

- **Dashboard**: Comprehensive overview with analytics and insights
- **Job Market Analysis**: Browse and analyze job opportunities with advanced filtering
- **Skill Profiling**: Build detailed skill profiles with AI-powered recommendations
- **AI Assistant**: Multiple AI endpoints for career guidance and predictions
- **Real-time Job Data**: Integration with Emsi Services for live job market data
- **Modern UI**: Beautiful, responsive design with Material-UI components
- **Animations**: Smooth transitions and interactions using Framer Motion
- **Loading States**: Comprehensive loading components with skeletons and animations
- **Phoenix.edu SSO**: Secure single sign-on with University of Phoenix

## 🏗️ Architecture

### Frontend Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top navigation bar
│   ├── Sidebar.jsx         # Left navigation sidebar
│   ├── JobList.jsx         # Job listings with filtering
│   ├── SkillProfileForm.jsx # Skill profile builder
│   ├── AIEndpoints.jsx     # AI assistant interface
│   └── AuthForm.jsx        # Authentication component
├── pages/
│   ├── Dashboard.jsx       # Main dashboard page
│   ├── Jobs.jsx           # Job market analysis page
│   ├── Skills.jsx         # Skill profiling page
│   ├── AI.jsx             # AI assistant page
│   ├── Login.jsx          # Authentication page
│   ├── PhoenixLogin.jsx   # Phoenix.edu login page
│   ├── CompanySelection.jsx # Company selection page
│   ├── Loading.jsx        # Loading components and states
│   └── LoadingDemo.jsx    # Demo page for loading states
├── services/
│   ├── api.js             # API client with endpoints
│   └── auth.js            # Authentication context
├── App.jsx                # Main application component
├── App.css                # Global styles
└── index.js               # Application entry point
```

## 🚀 Technology Stack

- **React 18** - Modern React with hooks
- **Material-UI (MUI)** - Professional UI components
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Recharts** - Interactive charts and graphs
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## 🎨 Design System

### Color Palette
- Primary: `#2563eb` (Blue)
- Secondary: `#f59e0b` (Amber)
- Success: `#059669` (Green)
- Warning: `#dc2626` (Red)
- Background: `#f8fafc` (Light Gray)

### Typography
- Font Family: Inter (Google Fonts)
- Weights: 300, 400, 500, 600, 700, 800

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📊 Pages Overview

### Dashboard
- Real-time analytics and insights
- Skill trend charts
- Job market distribution
- Recent activity feed
- Quick action buttons

### Jobs
- Comprehensive job listings
- Advanced search and filtering
- Job details with skill requirements
- Application tracking
- Bookmark functionality

### Skills
- Interactive skill profile builder
- AI-powered skill recommendations
- Career path suggestions
- Learning resource recommendations
- Progress tracking

### AI Assistant
- Multiple AI endpoints for different use cases
- Skill prediction and analysis
- Job matching algorithms
- Career advisory services
- Market trend analysis

## 🔒 Authentication

The application includes a modern authentication system with:

### Standard Authentication
- Sign in / Sign up forms
- JWT token management
- Protected routes
- Session persistence

### Phoenix.edu SSO Integration
- **Single Sign-On (SSO)** with Phoenix.edu
- **University Login Page**: Redirects to authentic University of Phoenix login interface
- **Credential Authentication**: Users enter their phoenix.edu email and password
- **Email Domain Validation**: Only `@phoenix.edu` email addresses are allowed
- **User Role Detection**: Automatically detects Students, Instructors, and Administrators
- **Company Selection Flow**: After Phoenix.edu login, users are redirected to select their company
- **Seamless Integration**: Works with existing authentication flow

#### Phoenix.edu SSO Flow:
1. User clicks "Sign in with Phoenix.edu" on the main login page
2. System redirects to University of Phoenix login page (`/phoenix-login`)
3. User enters their phoenix.edu email and password
4. System validates credentials and email domain
5. User information is extracted and stored
6. User is redirected to company selection page
7. After company selection, user is redirected to dashboard

#### Phoenix.edu Login Features:
- ✅ Authentic University of Phoenix branding and design
- ✅ Real-time email validation (must be @phoenix.edu)
- ✅ Password strength requirements
- ✅ Secure credential handling
- ✅ Error handling and user feedback
- ✅ Cancel option to return to main login
- ✅ Forgot password assistance

#### Phoenix.edu User Types:
- **Students**: `student@phoenix.edu` - Includes student ID
- **Instructors**: `instructor@phoenix.edu` - Includes employee ID  
- **Administrators**: `admin@phoenix.edu` - Includes employee ID
- **General Users**: Any valid `@phoenix.edu` email - Defaults to student role

### Company Selection
After Phoenix.edu SSO login, users must select a company to personalize their experience:
- Browse available companies
- View company details and industry information
- One-time selection required
- Redirects to dashboard after selection

## 🔄 Loading Components

The application includes a comprehensive set of loading components for different use cases:

### Available Loading Variants

1. **Full Page Loader** (`variant="full"`)
   - Covers entire viewport with Skills Snapshot branding
   - Animated background and rotating brain icon
   - Optional progress bar support
   - Smooth fade-in animations

2. **Phoenix.edu Loader** (`variant="phoenix"`)
   - University of Phoenix themed loading screen
   - Orange/amber color scheme
   - Graduation cap animation
   - Used during Phoenix.edu authentication

3. **Dashboard Skeleton** (`variant="dashboard"`)
   - Skeleton loading for dashboard content
   - Placeholder cards and charts
   - Maintains layout structure
   - Smooth content replacement

4. **Job Skeleton** (`variant="jobs"`)
   - Skeleton loading for job listings
   - Job card placeholders
   - Skill tag placeholders
   - Realistic loading experience

5. **AI Chat Loader** (`variant="ai"`)
   - Animated thinking indicator
   - Sparkles icon with rotation
   - Pulsing dots animation
   - Used during AI responses

6. **Company Selection Loader** (`variant="company"`)
   - Briefcase icon animation
   - Company loading message
   - Gradient background
   - Used while fetching companies

7. **Simple Spinner** (`variant="spinner"`)
   - Basic circular progress indicator
   - Customizable size and color
   - Minimal loading state

8. **Spinner with Text** (`variant="text"`)
   - Spinner with descriptive text
   - Vertical layout
   - Customizable message

### Usage Examples

```jsx
import Loading from './pages/Loading';

// Full page loading
<Loading variant="full" message="Loading Skills Snapshot..." />

// Phoenix.edu authentication
<Loading variant="phoenix" message="Connecting to Phoenix.edu..." />

// Dashboard loading
<Loading variant="dashboard" />

// Job listings loading
<Loading variant="jobs" />

// AI response loading
<Loading variant="ai" message="AI is thinking..." />

// Company selection loading
<Loading variant="company" />

// Simple spinner
<Loading variant="spinner" size={40} />

// Spinner with text
<Loading variant="text" message="Loading content..." />
```

### Demo Page

Visit `/loading-demo` to see all loading components in action with interactive controls.

## 🌟 Key Features

### Modern UI Components
- Glassmorphism effects
- Smooth hover animations
- Interactive cards and buttons
- Loading states and skeletons
- Toast notifications

### AI-Powered Insights
- Skill demand prediction
- Career path recommendations
- Job matching algorithms
- Market trend analysis
- Personalized suggestions

### Data Visualization
- Interactive charts and graphs
- Skill trend analysis
- Job market distribution
- Career progression tracking
- Performance metrics

## 🌐 API Integration

### Emsi Services Job Postings API

This application integrates with the Emsi Services Job Postings API to provide real-time job market data:

- **Endpoint**: `https://emsiservices.com/jpa/postings`
- **Features**:
  - Job search by title, skills, and location
  - Salary insights and market trends
  - Aggregated job market data
  - Real-time posting updates

### API Configuration

1. Create a `.env` file in the frontend directory:
```bash
cp .env.example .env
```

2. Add your Emsi Services API key:
```
REACT_APP_EMSI_API_KEY=your_emsi_api_key_here
REACT_APP_EMSI_BASE_URL=https://emsiservices.com/jpa/postings
```

### Available API Methods

- `searchPostings(params)` - Search job postings with filters
- `searchByTitle(title, location)` - Search jobs by title
- `searchBySkills(skills, location)` - Search jobs by skills
- `getTrendingJobTitles()` - Get trending job titles
- `getSalaryInsights(jobTitle, location)` - Get salary data

## 🔌 API Integration

The application is designed to work with a backend API providing:
- User authentication
- Job data and analytics
- AI-powered insights
- Skill analysis
- Market trends

## 🎯 Future Enhancements

- Real-time notifications
- Advanced analytics dashboard
- Social features and networking
- Learning management system
- Mobile app development
- Advanced AI features

## 📈 Performance

The application is optimized for:
- Fast initial load times
- Smooth animations
- Efficient re-renders
- Responsive interactions
- SEO optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Skills Snapshot** - Empowering careers through AI-driven insights 🚀
