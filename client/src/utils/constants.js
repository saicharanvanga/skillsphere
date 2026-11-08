export const SKILL_CATEGORIES = [
  'Programming Languages',
  'Web Development',
  'Database Management',
  'Data Structures and Algorithms',
  'Artificial Intelligence and Machine Learning',
  'Tools and Technologies',
  'Soft Skills',
];

export const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const LEARNING_STATUSES = ['Not Started', 'Learning', 'Completed'];

export const CATEGORY_COLORS = {
  'Programming Languages': '#3B82F6', // Blue
  'Web Development': '#10B981',       // Emerald
  'Database Management': '#8B5CF6',   // Purple
  'Data Structures and Algorithms': '#EC4899', // Pink
  'Artificial Intelligence and Machine Learning': '#F59E0B', // Amber
  'Tools and Technologies': '#06B6D4', // Cyan
  'Soft Skills': '#64748B',            // Slate
};

export const STATUS_COLORS = {
  'Completed': {
    bg: '#DEF7EC',
    text: '#03543F',
    border: '#BCF0DA',
    dot: '#10B981',
  },
  'Learning': {
    bg: '#E0E7FF',
    text: '#3730A3',
    border: '#C7D2FE',
    dot: '#6366F1',
  },
  'Not Started': {
    bg: '#F1F5F9',
    text: '#475569',
    border: '#E2E8F0',
    dot: '#94A3B8',
  },
};

export const PROFICIENCY_BADGES = {
  'Beginner': { bg: '#FEF3C7', text: '#92400E' },
  'Intermediate': { bg: '#DBEAFE', text: '#1E40AF' },
  'Advanced': { bg: '#E0E7FF', text: '#4338CA' },
  'Expert': { bg: '#D1FAE5', text: '#065F46' },
};
