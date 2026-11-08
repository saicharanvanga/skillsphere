const { Skill, SKILL_CATEGORIES, PROFICIENCY_LEVELS, LEARNING_STATUSES } = require('../models/Skill');

// Utility to escape regex special characters (prevents crashes with C++, C#, .NET, etc.)
const escapeRegex = (string) => {
  return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

// @desc    Get all skills for current user with filtering, searching, and sorting
// @route   GET /api/skills
// @access  Private
const getSkills = async (req, res, next) => {
  try {
    const { search, category, proficiencyLevel, status, sort } = req.query;

    const query = { user: req.user._id };

    // Search by skill name safely with regex escaping
    if (search && search.trim() !== '') {
      query.name = { $regex: escapeRegex(search.trim()), $options: 'i' };
    }

    // Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by Proficiency Level
    if (proficiencyLevel && proficiencyLevel !== 'All') {
      query.proficiencyLevel = proficiencyLevel;
    }

    // Filter by Learning Status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Sorting options
    let sortOptions = { createdAt: -1 }; // default: newest first
    if (sort === 'name-asc') {
      sortOptions = { name: 1 };
    } else if (sort === 'name-desc') {
      sortOptions = { name: -1 };
    } else if (sort === 'progress-desc') {
      sortOptions = { progress: -1 };
    } else if (sort === 'progress-asc') {
      sortOptions = { progress: 1 };
    } else if (sort === 'updated-desc') {
      sortOptions = { updatedAt: -1 };
    }

    const skills = await Skill.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: skills.length,
      skills,
      meta: {
        categories: SKILL_CATEGORIES,
        proficiencyLevels: PROFICIENCY_LEVELS,
        learningStatuses: LEARNING_STATUSES,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single skill by ID
// @route   GET /api/skills/:id
// @access  Private
const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, user: req.user._id });
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    res.status(200).json({
      success: true,
      skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res, next) => {
  try {
    const { name, category, proficiencyLevel, progress, status, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Skill name is required.',
      });
    }

    if (!category || !SKILL_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Please select a valid skill category: ${SKILL_CATEGORIES.join(', ')}`,
      });
    }

    // Check if skill with same name already exists for this user safely
    const escapedName = escapeRegex(name.trim());
    const existing = await Skill.findOne({
      user: req.user._id,
      name: { $regex: new RegExp(`^${escapedName}$`, 'i') },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `You already have a skill named "${name.trim()}".`,
      });
    }

    const numericProgress = Number(progress) || 0;
    let initialStatus = status;
    if (!initialStatus) {
      if (numericProgress === 100) initialStatus = 'Completed';
      else if (numericProgress > 0) initialStatus = 'Learning';
      else initialStatus = 'Not Started';
    }

    const skill = await Skill.create({
      user: req.user._id,
      name: name.trim(),
      category,
      proficiencyLevel: proficiencyLevel && PROFICIENCY_LEVELS.includes(proficiencyLevel)
        ? proficiencyLevel
        : 'Beginner',
      progress: Math.min(100, Math.max(0, numericProgress)),
      status: initialStatus,
      description: description ? description.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Skill added successfully',
      skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res, next) => {
  try {
    let skill = await Skill.findOne({ _id: req.params.id, user: req.user._id });
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    const { name, category, proficiencyLevel, progress, status, description } = req.body;

    // Check duplicate name if name is modified
    if (name && name.trim() !== skill.name) {
      const escapedName = escapeRegex(name.trim());
      const duplicate = await Skill.findOne({
        user: req.user._id,
        _id: { $ne: skill._id },
        name: { $regex: new RegExp(`^${escapedName}$`, 'i') },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Another skill named "${name.trim()}" already exists.`,
        });
      }
      skill.name = name.trim();
    }

    if (category) {
      if (!SKILL_CATEGORIES.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid skill category provided.',
        });
      }
      skill.category = category;
    }

    if (proficiencyLevel) {
      if (!PROFICIENCY_LEVELS.includes(proficiencyLevel)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid proficiency level provided.',
        });
      }
      skill.proficiencyLevel = proficiencyLevel;
    }

    if (description !== undefined) {
      skill.description = description.trim();
    }

    if (progress !== undefined) {
      const numericProgress = Math.min(100, Math.max(0, Number(progress)));
      skill.progress = numericProgress;
      if (numericProgress === 100) {
        skill.status = 'Completed';
      } else if (numericProgress === 0) {
        skill.status = status || 'Not Started';
      } else {
        skill.status = status || 'Learning';
      }
    } else if (status) {
      skill.status = status;
      if (status === 'Completed' && skill.progress < 100) {
        skill.progress = 100;
      } else if (status === 'Not Started') {
        skill.progress = 0;
      }
    }

    const updatedSkill = await skill.save();

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      skill: updatedSkill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quick update skill progress percentage
// @route   PATCH /api/skills/:id/progress
// @access  Private
const updateSkillProgress = async (req, res, next) => {
  try {
    const { progress } = req.body;

    if (progress === undefined || isNaN(progress)) {
      return res.status(400).json({
        success: false,
        message: 'A valid numeric progress percentage (0 - 100) is required.',
      });
    }

    const numericProgress = Math.min(100, Math.max(0, Number(progress)));

    const skill = await Skill.findOne({ _id: req.params.id, user: req.user._id });
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    skill.progress = numericProgress;
    if (numericProgress === 100) {
      skill.status = 'Completed';
    } else if (numericProgress > 0) {
      skill.status = 'Learning';
    } else {
      skill.status = 'Not Started';
    }

    const updatedSkill = await skill.save();

    res.status(200).json({
      success: true,
      message: `Progress updated to ${numericProgress}%`,
      skill: updatedSkill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Skill "${skill.name}" removed successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  updateSkillProgress,
  deleteSkill,
};
