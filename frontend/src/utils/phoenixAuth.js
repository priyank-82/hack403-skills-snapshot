// Phoenix.edu authentication utilities

export const validatePhoenixEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!email.endsWith('@phoenix.edu')) {
    return { 
      isValid: false, 
      error: 'Access denied. Only phoenix.edu email addresses are allowed.' 
    };
  }
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@phoenix\.edu$/;
  if (!emailRegex.test(email)) {
    return { 
      isValid: false, 
      error: 'Invalid email format' 
    };
  }
  
  return { isValid: true };
};

export const extractPhoenixUserInfo = (email) => {
  const validation = validatePhoenixEmail(email);
  if (!validation.isValid) {
    return null;
  }
  
  // Extract username from email
  const username = email.split('@')[0];
  
  // Determine likely role based on username patterns
  let role = 'Student';
  if (username.includes('admin') || username.includes('staff')) {
    role = 'Administrator';
  } else if (username.includes('instructor') || username.includes('prof') || username.includes('dr')) {
    role = 'Instructor';
  }
  
  return {
    username,
    email,
    role,
    domain: 'phoenix.edu'
  };
};

// Mock Phoenix.edu SSO response
export const mockPhoenixSSOResponse = () => {
  const sampleUsers = [
    {
      email: 'student@phoenix.edu',
      name: 'Alex Johnson',
      department: 'Information Technology',
      role: 'Student',
      studentId: 'PHX' + Math.floor(Math.random() * 1000000)
    },
    {
      email: 'instructor@phoenix.edu',
      name: 'Dr. Sarah Williams',
      department: 'Computer Science',
      role: 'Instructor',
      employeeId: 'EMP' + Math.floor(Math.random() * 10000)
    },
    {
      email: 'admin@phoenix.edu',
      name: 'Michael Chen',
      department: 'Academic Affairs',
      role: 'Administrator',
      employeeId: 'ADM' + Math.floor(Math.random() * 10000)
    }
  ];
  
  return sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
};
