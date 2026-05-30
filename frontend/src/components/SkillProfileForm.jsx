import {
  Alert,
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  BarChart3,
  BookOpen,
  Building,
  Check,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Lightbulb,
  Plus,
  RefreshCw,
  Search,
  Star,
  Target,
  TrendingUp,
  User,
  X,
  Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNotifications } from '../hooks';
import {
  useGenerateRecommendationsMutation,
  useGetProfileQuery,
  useGetSkillsQuery,
  useGetUserSkillsQuery,
  useScrapeJobSkillsQuery,
  useUpdateProfileMutation
} from '../store/api';
import { companies } from '../utils/companies';
import CompanySelectionDropdown from './CompanySelectionDropdown';
import './Skills.css'; // Import professional styling

const skillCategories = [
  { 
    id: 'programming', 
    name: 'Programming Languages', 
    icon: '💻',
    skills: ['JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin']
  },
  { 
    id: 'frontend', 
    name: 'Frontend Development', 
    icon: '🎨',
    skills: ['React', 'Vue.js', 'Angular', 'HTML/CSS', 'Sass/SCSS', 'Tailwind CSS', 'Material-UI', 'Bootstrap']
  },
  { 
    id: 'backend', 
    name: 'Backend Development', 
    icon: '⚙️',
    skills: ['Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'FastAPI']
  },
  { 
    id: 'data', 
    name: 'Data Science & Analytics', 
    icon: '📊',
    skills: ['Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'R', 'Tableau', 'Power BI', 'SQL']
  },
  { 
    id: 'cloud', 
    name: 'Cloud Computing', 
    icon: '☁️',
    skills: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitLab CI/CD']
  },
  { 
    id: 'mobile', 
    name: 'Mobile Development', 
    icon: '📱',
    skills: ['React Native', 'Flutter', 'iOS Development', 'Android Development', 'Xamarin', 'Ionic']
  },
  { 
    id: 'database', 
    name: 'Database Management', 
    icon: '🗄️',
    skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'ElasticSearch', 'DynamoDB', 'Cassandra']
  },
  { 
    id: 'tools', 
    name: 'Development Tools', 
    icon: '🔧',
    skills: ['Git', 'GitHub', 'Jira', 'Postman', 'VS Code', 'IntelliJ IDEA', 'Figma', 'Slack']
  }
];

const skillLevels = [
  { value: 1, label: 'Beginner', color: '#fb923c', description: 'Basic understanding' },
  { value: 2, label: 'Novice', color: '#f97316', description: 'Limited experience' },
  { value: 3, label: 'Intermediate', color: '#ea580c', description: 'Practical application' },
  { value: 4, label: 'Advanced', color: '#dc2626', description: 'Professional proficiency' },
  { value: 5, label: 'Expert', color: '#b91c1c', description: 'Thought leadership' }
];

const popularSkills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'TypeScript',
  'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'Git',
  'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
  'HTML/CSS', 'Vue.js', 'Angular', 'Express.js', 'Django',
  'PostgreSQL', 'Redis', 'GraphQL', 'REST APIs', 'Microservices'
];

const careerGoalOptions = [
  'Senior Developer', 'Tech Lead', 'Engineering Manager', 'Solutions Architect', 
  'Product Manager', 'DevOps Engineer', 'Data Scientist', 'AI/ML Engineer',
  'Full Stack Developer', 'Frontend Specialist', 'Backend Specialist', 'Mobile Developer'
];

const workPreferences = [
  { value: 'remote', label: 'Remote', icon: '🏠' },
  { value: 'hybrid', label: 'Hybrid', icon: '🏢' },
  { value: 'onsite', label: 'On-site', icon: '🏤' }
];

const industryOptions = [
  'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education', 
  'Entertainment', 'Government', 'Consulting', 'Automotive', 'Real Estate'
];

const experienceLevels = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior Level (6-10 years)' },
  { value: 'lead', label: 'Lead/Principal (10+ years)' }
];

function SkillProfileForm() {
  const { showSuccess, showError } = useNotifications();
  const dispatch = useDispatch();
  
  // Redux state
  const selectedCompany = useSelector((state) => state.ui.selectedCompany) || '';
  const selectedCompanyData = companies.find(c => c.id === selectedCompany);
  
  // RTK Query hooks
  const { data: userProfile, isLoading: profileLoading } = useGetProfileQuery();
  const { data: availableSkills = [], isLoading: skillsLoading } = useGetSkillsQuery();
  const { data: userSkills = [], isLoading: userSkillsLoading } = useGetUserSkillsQuery();
  const [updateProfile, { isLoading: updateLoading }] = useUpdateProfileMutation();
  const [generateRecommendations, { isLoading: recommendationsLoading }] = useGenerateRecommendationsMutation();
  
  // Company Skills Data
  const {
    data: skillsData,
    isLoading: skillsDataLoading,
    error: skillsDataError,
    refetch: refetchSkillsData
  } = useScrapeJobSkillsQuery(selectedCompanyData?.name, {
    skip: !selectedCompanyData?.name,
  });

  const [profile, setProfile] = useState({
    name: '',
    location: '',
    jobTitle: '',
    experience: 'mid',
    skills: [],
    skillLevels: {}, // New: skill proficiency levels
    careerGoals: [],
    salaryRange: [60000, 120000],
    preferredIndustries: [],
    workPreference: 'hybrid',
    yearsOfExperience: 3,
    education: '',
    certifications: []
  });

  const [skillInput, setSkillInput] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [skillSearchTerm, setSkillSearchTerm] = useState('');
  const [showSkillDetails, setShowSkillDetails] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Load user profile data when available
  useEffect(() => {
    if (userProfile) {
      setProfile(prev => ({
        ...prev,
        name: userProfile.name || '',
        location: userProfile.location || '',
        jobTitle: userProfile.jobTitle || '',
        experience: userProfile.experience || 'mid',
        skills: userProfile.skills || [],
        skillLevels: userProfile.skillLevels || {},
        careerGoals: userProfile.careerGoals || [],
        salaryRange: userProfile.salaryRange || [60000, 120000],
        preferredIndustries: userProfile.preferredIndustries || [],
        workPreference: userProfile.workPreference || 'hybrid',
        yearsOfExperience: userProfile.yearsOfExperience || 3,
        education: userProfile.education || '',
        certifications: userProfile.certifications || []
      }));
    }
  }, [userProfile]);

  // Check profile completeness
  useEffect(() => {
    const completeness = calculateProfileCompleteness();
    setIsProfileComplete(completeness >= 80);
  }, [profile]);

  // Combine available skills with user skills for autocomplete
  const allSkills = [...new Set([
    ...availableSkills.map(skill => skill.name || skill),
    ...userSkills.map(skill => skill.name || skill),
    ...popularSkills
  ])];

  const handleSkillAdd = (event, newValue) => {
    if (newValue && !profile.skills.includes(newValue)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newValue],
        skillLevels: {
          ...prev.skillLevels,
          [newValue]: 3 // Default to intermediate level
        }
      }));
    }
    setSkillInput('');
  };

  const handleSkillRemove = (skillToRemove) => {
    setProfile(prev => {
      const newSkillLevels = { ...prev.skillLevels };
      delete newSkillLevels[skillToRemove];
      
      return {
        ...prev,
        skills: prev.skills.filter(skill => skill !== skillToRemove),
        skillLevels: newSkillLevels
      };
    });
  };

  const handleSkillLevelChange = (skill, level) => {
    setProfile(prev => ({
      ...prev,
      skillLevels: {
        ...prev.skillLevels,
        [skill]: level
      }
    }));
  };

  const getSkillsByCategory = (categoryId) => {
    if (categoryId === 'all') return profile.skills;
    const category = skillCategories.find(cat => cat.id === categoryId);
    return profile.skills.filter(skill => 
      category?.skills.includes(skill)
    );
  };

  const getSkillLevel = (skill) => {
    return profile.skillLevels[skill] || 3;
  };

  const getSkillLevelInfo = (level) => {
    return skillLevels.find(sl => sl.value === level) || skillLevels[2];
  };

  const calculateProfileCompleteness = () => {
    const fields = [
      profile.name,
      profile.location,
      profile.jobTitle,
      profile.skills.length > 0,
      profile.careerGoals.length > 0,
      profile.preferredIndustries.length > 0
    ];
    
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const filteredSkills = allSkills.filter(skill => 
    skill.toLowerCase().includes(skillSearchTerm.toLowerCase())
  );

  const handleRefreshSkills = () => {
    if (selectedCompanyData?.name) {
      refetchSkillsData();
    }
  };

  const handleDownloadCSV = () => {
    if (selectedCompanyData?.name) {
      const csvUrl = `http://localhost:8000/download-skills-csv?company_name=${encodeURIComponent(selectedCompanyData.name)}`;
      window.open(csvUrl, '_blank');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Update user profile
      await updateProfile(profile).unwrap();
      showSuccess('Profile updated successfully!');
      
      // Generate AI recommendations
      try {
        const recommendationsData = await generateRecommendations({
          profile,
          skills: profile.skills,
          experience: profile.experience,
          careerGoals: profile.careerGoals
        }).unwrap();
        
        setRecommendations(recommendationsData);
        setShowResults(true);
        showSuccess('Recommendations generated successfully!');
      } catch (recommendationError) {
        // Fall back to mock recommendations for testing
        console.warn('AI recommendations API failed, using mock data for testing:', recommendationError.message);
        
        const mockRecommendations = {
          skillGaps: [
            { skill: 'TypeScript', importance: 'High', trend: '+25%' },
            { skill: 'Docker', importance: 'Medium', trend: '+18%' },
            { skill: 'GraphQL', importance: 'Medium', trend: '+15%' }
          ],
          careerPath: [
            { role: 'Senior Frontend Developer', match: 85, salary: '$110,000 - $140,000' },
            { role: 'Full Stack Developer', match: 78, salary: '$95,000 - $125,000' },
            { role: 'Tech Lead', match: 72, salary: '$130,000 - $165,000' }
          ],
          learningResources: [
            { title: 'Advanced TypeScript Patterns', provider: 'TechEd', duration: '6 weeks' },
            { title: 'Docker for Developers', provider: 'DevAcademy', duration: '4 weeks' },
            { title: 'GraphQL Fundamentals', provider: 'CodeSchool', duration: '3 weeks' }
          ]
        };
        
        setRecommendations(mockRecommendations);
        setShowResults(true);
        showSuccess('Recommendations generated successfully! (Using test data)');
      }
      
    } catch (error) {
      showError(error?.data?.message || 'Failed to update profile');
    }
  };

  const getSkillColor = (level) => {
    const levelInfo = getSkillLevelInfo(level);
    return levelInfo.color;
  };

  const loading = profileLoading || skillsLoading || userSkillsLoading;
  const profileCompleteness = calculateProfileCompleteness();

  // Enhanced Skills Section Component with Advanced UI
  const SkillsSection = () => (
    <Card 
      sx={{ 
        height: '100%',
        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          zIndex: 1
        }
      }}
    >
      <CardContent sx={{ p: 3, position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              <Box 
                sx={{ 
                  p: 1, 
                  borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Target size={24} />
              </Box>
              Skills & Expertise
              <Badge 
                badgeContent={profile.skills.length} 
                color="error" 
                sx={{ 
                  ml: 1,
                  '& .MuiBadge-badge': {
                    background: 'linear-gradient(45deg, #f97316, #ea580c)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    animation: 'pulse 2s infinite'
                  }
                }} 
              />
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              variant="contained"
              size="small"
              startIcon={<Filter size={16} />}
              onClick={() => setShowSkillDetails(!showSkillDetails)}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }
              }}
            >
              {showSkillDetails ? 'Hide' : 'Show'} Details
            </Button>
          </motion.div>
        </Box>

        {/* Enhanced Skill Categories Filter */}
        <Box sx={{ mb: 3 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Box 
              sx={{ 
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                p: 2,
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
            >
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                Filter by Category
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label="All Categories"
                    onClick={() => setSelectedCategory('all')}
                    variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
                    sx={{
                      background: selectedCategory === 'all' 
                        ? 'linear-gradient(45deg, #f97316, #ea580c)' 
                        : 'rgba(255,255,255,0.1)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      fontWeight: 600,
                      '&:hover': {
                        background: selectedCategory === 'all' 
                          ? 'linear-gradient(45deg, #f97316, #ea580c)' 
                          : 'rgba(255,255,255,0.2)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  />
                </motion.div>
                {skillCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Chip
                      label={`${category.icon} ${category.name}`}
                      onClick={() => setSelectedCategory(category.id)}
                      variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                      sx={{
                        background: selectedCategory === category.id 
                          ? 'linear-gradient(45deg, #f97316, #ea580c)' 
                          : 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        fontWeight: 600,
                        '&:hover': {
                          background: selectedCategory === category.id 
                            ? 'linear-gradient(45deg, #f97316, #ea580c)' 
                            : 'rgba(255,255,255,0.2)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            </Box>
          </motion.div>
        </Box>

        {/* Enhanced Skill Input */}
        <Box sx={{ mb: 3 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Box 
              sx={{ 
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                p: 3,
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
            >
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                Add New Skills
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search skills..."
                  value={skillSearchTerm}
                  onChange={(e) => setSkillSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search size={20} style={{ marginRight: 8, color: 'white' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 3,
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(255,255,255,0.7)',
                      }
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255,255,255,0.7)',
                    }
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<Lightbulb size={20} />}
                  sx={{
                    background: 'linear-gradient(45deg, #f97316, #ea580c)',
                    minWidth: 140,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ea580c, #dc2626)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }
                  }}
                >
                  Suggest
                </Button>
              </Box>
              
              <Autocomplete
                options={filteredSkills}
                value={skillInput}
                onChange={handleSkillAdd}
                inputValue={skillInput}
                onInputChange={(event, newInputValue) => setSkillInput(newInputValue)}
                disabled={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Skills"
                    placeholder="Type to add skills..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                          <Plus size={16} style={{ color: 'white' }} />
                        </Box>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 3,
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255,255,255,0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'rgba(255,255,255,0.7)',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255,255,255,0.7)',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: 'white',
                      }
                    }}
                  />
                )}
                freeSolo
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{
                      '&:hover': {
                        background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                      }
                    }}
                  >
                    <Zap size={16} style={{ marginRight: 8, color: '#f97316' }} />
                    {option}
                  </Box>
                )}
              />
            </Box>
          </motion.div>
        </Box>

        {/* Enhanced Skills Display */}
        <AnimatePresence>
          {getSkillsByCategory(selectedCategory).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Box 
                sx={{ 
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  p: 3,
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                  Your Skills Portfolio
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
                  {getSkillsByCategory(selectedCategory).map((skill, index) => {
                    const level = getSkillLevel(skill);
                    const levelInfo = getSkillLevelInfo(level);
                    
                    return (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          sx={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                            backdropFilter: 'blur(20px)',
                            border: `2px solid ${levelInfo.color}40`,
                            borderRadius: 4,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: 4,
                              background: `linear-gradient(90deg, ${levelInfo.color}, ${levelInfo.color}80)`,
                              animation: 'skillGlow 2s ease-in-out infinite alternate'
                            },
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: `0 10px 30px ${levelInfo.color}30`,
                              border: `2px solid ${levelInfo.color}80`
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${levelInfo.color}, ${levelInfo.color}80)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: `0 4px 12px ${levelInfo.color}30`
                                  }}
                                >
                                  <Star size={18} color="white" />
                                </Box>
                                <Box>
                                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>
                                    {skill}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                                    {skillCategories.find(cat => cat.skills.includes(skill))?.name || 'General'}
                                  </Typography>
                                </Box>
                              </Box>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => handleSkillRemove(skill)}
                                  sx={{ 
                                    color: 'rgba(255,255,255,0.8)',
                                    background: 'rgba(255,255,255,0.1)',
                                    '&:hover': {
                                      background: 'rgba(255,255,255,0.2)',
                                      color: '#ff6b6b'
                                    }
                                  }}
                                >
                                  <X size={16} />
                                </IconButton>
                              </motion.div>
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                                  Proficiency Level
                                </Typography>
                                <Chip
                                  label={levelInfo.label}
                                  size="small"
                                  sx={{ 
                                    background: `linear-gradient(135deg, ${levelInfo.color}, ${levelInfo.color}80)`,
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    border: `1px solid ${levelInfo.color}40`
                                  }}
                                />
                              </Box>
                              
                              <Box sx={{ position: 'relative', height: 8, mb: 1 }}>
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '100%',
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: 4,
                                    overflow: 'hidden'
                                  }}
                                >
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(level / 5) * 100}%` }}
                                    transition={{ duration: 1, delay: index * 0.2 }}
                                    style={{
                                      height: '100%',
                                      background: `linear-gradient(90deg, ${levelInfo.color}, ${levelInfo.color}80)`,
                                      borderRadius: 4,
                                      position: 'relative',
                                      overflow: 'hidden'
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: '-100%',
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                        animation: 'skillShimmer 2s infinite'
                                      }}
                                    />
                                  </motion.div>
                                </Box>
                              </Box>
                            </Box>
                            
                            <Collapse in={showSkillDetails}>
                              <Box sx={{ mt: 2, p: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1, fontWeight: 600 }}>
                                  Rate Your Proficiency
                                </Typography>
                                <Rating
                                  value={level}
                                  onChange={(e, newValue) => handleSkillLevelChange(skill, newValue)}
                                  max={5}
                                  size="small"
                                  sx={{
                                    '& .MuiRating-iconFilled': {
                                      color: levelInfo.color
                                    },
                                    '& .MuiRating-iconEmpty': {
                                      color: 'rgba(255,255,255,0.3)'
                                    }
                                  }}
                                />
                                <Typography variant="caption" display="block" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
                                  {levelInfo.description}
                                </Typography>
                              </Box>
                            </Collapse>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {getSkillsByCategory(selectedCategory).length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: '2px dashed rgba(255,255,255,0.3)'
              }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 3,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}
                >
                  <Plus size={32} color="white" />
                </Box>
              </motion.div>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                No Skills Yet
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, maxWidth: 400, mx: 'auto' }}>
                Start building your skills portfolio! Add your first skill using the search box above.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript'].map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Chip
                      label={`+ ${skill}`}
                      onClick={() => handleSkillAdd(null, skill)}
                      sx={{
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.2)',
                          transform: 'translateY(-2px)',
                          cursor: 'pointer'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            </Box>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );

  // Enhanced Profile Summary Component
  const ProfileSummary = () => (
    <Card 
      sx={{ 
        height: '100%',
        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          zIndex: 1
        }
      }}
    >
      <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}
              >
                <User size={36} color="white" />
              </Avatar>
            </motion.div>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 0.5 }}>
                {profile.name || 'Your Profile'}
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 0.5 }}>
                {profile.jobTitle || 'Job Title'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                📍 {profile.location || 'Location'}
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box 
            sx={{ 
              mb: 4,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              p: 3,
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                Profile Completeness
              </Typography>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Chip
                  label={`${profileCompleteness}%`}
                  sx={{ 
                    background: profileCompleteness >= 80 
                      ? 'linear-gradient(45deg, #4caf50, #81c784)' 
                      : 'linear-gradient(45deg, rgb(237, 130, 53)0, rgb(237, 130, 53))',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}
                />
              </motion.div>
            </Box>
            
            <Box sx={{ position: 'relative', height: 12, mb: 2 }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '100%',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 6,
                  overflow: 'hidden'
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompleteness}%` }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  style={{
                    height: '100%',
                    background: profileCompleteness >= 80 
                      ? 'linear-gradient(90deg, #4caf50, #81c784)' 
                      : 'linear-gradient(90deg, rgb(237, 130, 53), rgb(237, 130, 53))',
                    borderRadius: 6,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      animation: 'profileShimmer 2s infinite'
                    }}
                  />
                </motion.div>
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
              {profileCompleteness >= 80 ? '🎉 Profile Complete!' : '⚡ Almost there! Keep building your profile'}
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <motion.div
              whileHover={{ scale: 1.02, x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 2,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  <Zap size={16} color="white" />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    {profile.skills.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Skills Added
                  </Typography>
                </Box>
              </Box>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 2,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <Target size={16} color="white" />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    {profile.careerGoals.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Career Goals
                  </Typography>
                </Box>
              </Box>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 2,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                  }}
                >
                  <Clock size={16} color="white" />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    {profile.yearsOfExperience}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Years Experience
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </motion.div>

        {isProfileComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Alert 
              severity="warning" 
              sx={{ 
                mt: 3,
                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(129, 199, 132, 0.2))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                color: 'white',
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#4caf50'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Check size={16} />
                Profile is complete! Ready for recommendations.
              </Box>
            </Alert>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#fff7ed' }}>
      {/* Enhanced Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box 
          sx={{ 
            mb: 2, 
            textAlign: 'center',
            position: 'left',
            py: 2,
            background: 'linear-gradient(135deg,rgb(237, 130, 53) 0%,rgb(237, 130, 53) 100%)',
            borderRadius: 4,
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'center',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width=55" height="45" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              zIndex: 1
            }
          }}
        >
          <Box sx={{ position: 'relative',align:'left', zIndex: 2 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 2, 
                  color: 'white',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                🚀 Skills Analysis Dashboard
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  color: 'rgba(255,255,255,0.9)',
                  fontWeight: 400,
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Discover in-demand skills, track your progress, and accelerate your career growth with AI-powered insights
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                    {profile.skills.length}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Skills Tracked
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                    {skillCategories.length}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Categories
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                    {profileCompleteness}%
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Complete
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </motion.div>

      {/* Enhanced Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box 
              sx={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Card 
                sx={{ 
                  p: 4,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 4,
                  textAlign: 'center',
                  minWidth: 300
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
                </motion.div>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                  Loading Your Profile
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Please wait while we prepare your personalized experience...
                </Typography>
              </Card>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <Grid container spacing={3}>
        {/* Company Selection */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Building size={20} />
                  Target Company Analysis
                </Typography>
                <CompanySelectionDropdown />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Skills Analysis Results */}
        {selectedCompanyData && (
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BarChart3 size={20} />
                      Skills Analysis for {selectedCompanyData.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<RefreshCw size={16} />}
                        onClick={handleRefreshSkills}
                        disabled={skillsDataLoading}
                      >
                        Refresh
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Download size={16} />}
                        onClick={handleDownloadCSV}
                        disabled={!skillsData || skillsDataLoading}
                      >
                        Download CSV
                      </Button>
                    </Box>
                  </Box>

                  {skillsDataLoading && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <CircularProgress size={24} />
                      <Typography variant="body2">
                        Analyzing job postings for {selectedCompanyData.name}...
                      </Typography>
                    </Box>
                  )}

                  {skillsDataError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      Error loading skills data: {skillsDataError.message || 'Unknown error'}
                    </Alert>
                  )}

                  {skillsData && (
                    <Box>
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={4}>
                          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3 }}>
                            <Typography variant="h4" color="warning.main">
                              {skillsData.total_postings || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Job Postings Analyzed
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3 }}>
                            <Typography variant="h4" color="warning.main">
                              {skillsData.skills?.unique_skills_discovered || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Unique Skills Found
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3 }}>
                            <Typography variant="h4" color="warning.main">
                              {skillsData.skills?.average_skills_per_job_description || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Avg Skills per Job
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>

                      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUp size={20} />
                        Top Skills in Demand
                      </Typography>
                      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 600 }}>Skill</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600 }}>Frequency</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600 }}>Percentage</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 600 }}>Trend</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {skillsData.skills?.skills && Object.entries(skillsData.skills.skills)
                              .slice(0, 10)
                              .map(([skill, frequency], index) => (
                                <TableRow key={skill} hover>
                                  <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                    {skill}
                                  </TableCell>
                                  <TableCell align="right">{frequency}</TableCell>
                                  <TableCell align="right">
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                      {((frequency / skillsData.total_postings) * 100).toFixed(1)}%
                                      <Box 
                                        sx={{ 
                                          width: 40, 
                                          height: 8, 
                                          backgroundColor: '#fed7aa', 
                                          borderRadius: 1,
                                          overflow: 'hidden'
                                        }}
                                      >
                                        <Box 
                                          sx={{ 
                                            width: `${(frequency / skillsData.total_postings) * 100}%`, 
                                            height: '100%', 
                                            backgroundColor: '#f97316',
                                            borderRadius: 1
                                          }} 
                                        />
                                      </Box>
                                    </Box>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Chip
                                      label={index < 5 ? "🔥 Hot" : index < 10 ? "📈 Rising" : "📊 Stable"}
                                      size="small"
                                      color={index < 5 ? "error" : index < 10 ? "warning" : "default"}
                                      variant="outlined"
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        )}

        {/* Main Content Grid */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ProfileSummary />
          </motion.div>
        </Grid>

        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SkillsSection />
          </motion.div>
        </Grid>

        {/* Career Profile Form */}
        {/* 
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardContent sx={{ p: 3 }}>
                <form onSubmit={handleSubmit}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <User size={20} />
                    Career Profile & Preferences
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Current Job Title"
                        value={profile.jobTitle}
                        onChange={(e) => setProfile(prev => ({ ...prev, jobTitle: e.target.value }))}
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={profile.location}
                        onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth disabled={loading}>
                        <InputLabel>Experience Level</InputLabel>
                        <Select
                          value={profile.experience}
                          label="Experience Level"
                          onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                        >
                          {experienceLevels.map(level => (
                            <MenuItem key={level.value} value={level.value}>
                              {level.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>/

                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Autocomplete
                          multiple
                          options={careerGoalOptions}
                          value={profile.careerGoals}
                          onChange={(e, newValue) => setProfile(prev => ({ ...prev, careerGoals: newValue }))}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                variant="outlined"
                                label={option}
                                {...getTagProps({ index })}
                                key={option}
                              />
                            ))
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Career Goals"
                              placeholder="Select your career aspirations..."
                            />
                          )}
                        />
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="body2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        💰 Salary Range: ${profile.salaryRange[0].toLocaleString()} - ${profile.salaryRange[1].toLocaleString()}
                      </Typography>
                      <Slider
                        value={profile.salaryRange}
                        onChange={(e, newValue) => setProfile(prev => ({ ...prev, salaryRange: newValue }))}
                        valueLabelDisplay="auto"
                        min={30000}
                        max={250000}
                        step={5000}
                        valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        multiple
                        options={industryOptions}
                        value={profile.preferredIndustries}
                        onChange={(e, newValue) => setProfile(prev => ({ ...prev, preferredIndustries: newValue }))}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              variant="outlined"
                              label={option}
                              {...getTagProps({ index })}
                              key={option}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Preferred Industries"
                            placeholder="Select industries..."
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth disabled={loading}>
                        <InputLabel>Work Preference</InputLabel>
                        <Select
                          value={profile.workPreference}
                          label="Work Preference"
                          onChange={(e) => setProfile(prev => ({ ...prev, workPreference: e.target.value }))}
                        >
                          {workPreferences.map(pref => (
                            <MenuItem key={pref.value} value={pref.value}>
                              {pref.icon} {pref.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={updateLoading || recommendationsLoading}
                          startIcon={updateLoading ? <CircularProgress size={20} /> : <Save size={20} />}
                          sx={{
                            borderRadius: '12px',
                            minWidth: '200px',
                            py: 1.5,
                            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
                            }
                          }}
                        >
                          {updateLoading ? 'Updating...' : 'Update Profile & Get Recommendations'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        */}

        {/* Enhanced Results Panel */}
        {showResults && recommendations && (
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Award size={20} />
                    AI-Powered Career Recommendations
                  </Typography>

                  {recommendationsLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  )}

                  {recommendations && (
                    <Grid container spacing={3}>
                      {/* Skill Gaps */}
                      {recommendations.skillGaps && recommendations.skillGaps.length > 0 && (
                        <Grid item xs={12} md={4}>
                          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                              <TrendingUp size={20} color="#f59e0b" />
                              Skill Gaps to Address
                            </Typography>
                            <List>
                              {recommendations.skillGaps.map((gap, index) => (
                                <ListItem key={index} sx={{ px: 0 }}>
                                  <ListItemText 
                                    primary={
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                          {gap.skill}
                                        </Typography>
                                        <Chip
                                          label={gap.importance}
                                          size="small"
                                          color={gap.importance === 'High' ? 'error' : gap.importance === 'Medium' ? 'warning' : 'info'}
                                        />
                                      </Box>
                                    }
                                    secondary={`Growth trend: ${gap.trend}`}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Paper>
                        </Grid>
                      )}

                      {/* Career Paths */}
                      {recommendations.careerPath && recommendations.careerPath.length > 0 && (
                        <Grid item xs={12} md={4}>
                          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Target size={20} color="#f97316" />
                              Career Path Recommendations
                            </Typography>
                            <List>
                              {recommendations.careerPath.map((path, index) => (
                                <ListItem key={index} sx={{ px: 0 }}>
                                  <ListItemText 
                                    primary={
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                          {path.role}
                                        </Typography>
                                        <Chip
                                          label={`${path.match}% match`}
                                          size="small"
                                          color={path.match >= 80 ? 'success' : path.match >= 60 ? 'warning' : 'error'}
                                        />
                                      </Box>
                                    }
                                    secondary={path.salary}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Paper>
                        </Grid>
                      )}

                      {/* Learning Resources */}
                      {recommendations.learningResources && recommendations.learningResources.length > 0 && (
                        <Grid item xs={12} md={4}>
                          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BookOpen size={20} color="#f97316" />
                              Learning Resources
                            </Typography>
                            <List>
                              {recommendations.learningResources.map((resource, index) => (
                                <ListItem key={index} sx={{ px: 0 }}>
                                  <ListItemText 
                                    primary={
                                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {resource.title}
                                      </Typography>
                                    }
                                    secondary={`${resource.provider} • ${resource.duration}`}
                                  />
                                  <ListItemSecondaryAction>
                                    <IconButton size="small" color="primary">
                                      <ChevronRight size={16} />
                                    </IconButton>
                                  </ListItemSecondaryAction>
                                </ListItem>
                              ))}
                            </List>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default SkillProfileForm;
