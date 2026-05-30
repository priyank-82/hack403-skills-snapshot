// Course Skill Mapping API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://0.0.0.0:8000';

export const courseSkillMappingAPI = {
  // Get course skill mapping for a company
  getCourseSkillMapping: async (companyName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/course-skill-mapping?company_name=${encodeURIComponent(companyName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Course skill mapping API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch course skill mapping',
        timestamp: new Date().toISOString()
      };
    }
  },

  // Format course skill mapping data for display
  formatCourseSkillMapping: (data) => {
    if (!data || typeof data !== 'object') {
      return { skills: [], totalSkills: 0, totalCourses: 0 };
    }

    const skills = Object.entries(data).map(([skillName, skillData]) => ({
      name: skillName,
      degreeCourses: skillData.degree_courses || [],
      pdCourses: skillData.pd_courses || [],
      totalDegreeCourses: skillData.total_degree_courses || 0,
      totalPdCourses: skillData.total_pd_courses || 0,
      totalCourses: (skillData.total_degree_courses || 0) + (skillData.total_pd_courses || 0)
    }));

    const totalSkills = skills.length;
    const totalCourses = skills.reduce((sum, skill) => sum + skill.totalCourses, 0);

    return {
      skills: skills, // Preserve original order from backend JSON
      totalSkills,
      totalCourses
    };
  },

  // Get top skills with most course options
  getTopSkillsWithCourses: (formattedData, limit = 5) => {
    return formattedData.skills
      .filter(skill => skill.totalCourses > 0)
      .slice(0, limit);
  },

  // Get top UOP courses across all skills
  getTopUOPCourses: (formattedData, limit = 10) => {
    const courseFrequency = {};
    
    formattedData.skills.forEach(skill => {
      // Count degree courses
      skill.degreeCourses.forEach(course => {
        courseFrequency[course] = (courseFrequency[course] || 0) + 1;
      });
      
      // Count professional development courses
      skill.pdCourses.forEach(course => {
        courseFrequency[course] = (courseFrequency[course] || 0) + 1;
      });
    });

    return Object.entries(courseFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([course, frequency]) => ({
        name: course,
        frequency,
        type: 'course'
      }));
  }
};

export default courseSkillMappingAPI;
