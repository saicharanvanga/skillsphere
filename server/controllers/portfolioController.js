const User = require('../models/User');
const { Skill } = require('../models/Skill');
const Project = require('../models/Project');
const Certification = require('../models/Certification');

// @desc    Get consolidated portfolio data for current student
// @route   GET /api/portfolio/me
// @access  Private
const getMyPortfolio = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    const skills = await Skill.find({ user: req.user._id }).sort({
      progress: -1,
      name: 1,
    });

    const projects = await Project.find({ user: req.user._id }).sort({
      featured: -1,
      completionDate: -1,
    });

    const certifications = await Certification.find({ user: req.user._id }).sort({
      issueDate: -1,
    });

    // Calculate portfolio summaries
    const totalSkills = skills.length;
    const completedSkills = skills.filter((s) => s.status === 'Completed').length;
    const averageProficiency =
      totalSkills > 0
        ? Math.round(
            skills.reduce((acc, curr) => acc + (curr.progress || 0), 0) / totalSkills
          )
        : 0;

    // Group skills by category for rich portfolio presentation
    const skillsByCategory = {};
    skills.forEach((skill) => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill);
    });

    res.status(200).json({
      success: true,
      portfolio: {
        user,
        stats: {
          totalSkills,
          completedSkills,
          averageProficiency,
          totalProjects: projects.length,
          totalCertifications: certifications.length,
        },
        skills,
        skillsByCategory,
        projects,
        certifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public portfolio data by user ID
// @route   GET /api/portfolio/public/:userId
// @access  Public
const getPublicPortfolio = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student portfolio not found',
      });
    }

    const skills = await Skill.find({ user: user._id }).sort({
      progress: -1,
      name: 1,
    });

    const projects = await Project.find({ user: user._id }).sort({
      featured: -1,
      completionDate: -1,
    });

    const certifications = await Certification.find({ user: user._id }).sort({
      issueDate: -1,
    });

    const totalSkills = skills.length;
    const completedSkills = skills.filter((s) => s.status === 'Completed').length;
    const averageProficiency =
      totalSkills > 0
        ? Math.round(
            skills.reduce((acc, curr) => acc + (curr.progress || 0), 0) / totalSkills
          )
        : 0;

    const skillsByCategory = {};
    skills.forEach((skill) => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill);
    });

    res.status(200).json({
      success: true,
      portfolio: {
        user,
        stats: {
          totalSkills,
          completedSkills,
          averageProficiency,
          totalProjects: projects.length,
          totalCertifications: certifications.length,
        },
        skills,
        skillsByCategory,
        projects,
        certifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyPortfolio,
  getPublicPortfolio,
};
