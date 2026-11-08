const mongoose = require('mongoose');

const skillCategories = [
  'Programming Languages',
  'Web Development',
  'Database Management',
  'Data Structures and Algorithms',
  'Artificial Intelligence and Machine Learning',
  'Tools and Technologies',
  'Soft Skills',
];

const proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const learningStatuses = ['Not Started', 'Learning', 'Completed'];

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [100, 'Skill name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: {
        values: skillCategories,
        message: '{VALUE} is not a valid skill category',
      },
    },
    proficiencyLevel: {
      type: String,
      required: [true, 'Proficiency level is required'],
      enum: {
        values: proficiencyLevels,
        message: '{VALUE} is not a valid proficiency level',
      },
      default: 'Beginner',
    },
    progress: {
      type: Number,
      required: true,
      min: [0, 'Progress percentage cannot be below 0'],
      max: [100, 'Progress percentage cannot exceed 100'],
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: learningStatuses,
        message: '{VALUE} is not a valid learning status',
      },
      default: 'Not Started',
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Sync status with progress before validation/save
skillSchema.pre('validate', function (next) {
  if (this.progress === 100) {
    this.status = 'Completed';
  } else if (this.progress > 0 && this.status === 'Not Started') {
    this.status = 'Learning';
  } else if (this.progress === 0 && this.status === 'Completed') {
    this.status = 'Not Started';
  }
  next();
});

module.exports = {
  Skill: mongoose.model('Skill', skillSchema),
  SKILL_CATEGORIES: skillCategories,
  PROFICIENCY_LEVELS: proficiencyLevels,
  LEARNING_STATUSES: learningStatuses,
};
