const { Skill, SKILL_CATEGORIES, PROFICIENCY_LEVELS } = require('../models/Skill');
const Project = require('../models/Project');
const Certification = require('../models/Certification');

// @desc    Get aggregated dashboard metrics for current student
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all skills for this user
    const skills = await Skill.find({ user: userId }).sort({ updatedAt: -1 });

    const totalSkills = skills.length;
    const completedSkills = skills.filter((s) => s.status === 'Completed').length;
    const learningSkills = skills.filter((s) => s.status === 'Learning').length;
    const notStartedSkills = skills.filter((s) => s.status === 'Not Started').length;

    // Average proficiency percentage
    const averageProficiency =
      totalSkills > 0
        ? Math.round(
            skills.reduce((acc, curr) => acc + (curr.progress || 0), 0) / totalSkills
          )
        : 0;

    // Category-wise skill breakdown
    const categoryDistribution = SKILL_CATEGORIES.map((cat) => {
      const catSkills = skills.filter((s) => s.category === cat);
      const catTotal = catSkills.length;
      const catAvgProgress =
        catTotal > 0
          ? Math.round(
              catSkills.reduce((acc, curr) => acc + curr.progress, 0) / catTotal
            )
          : 0;

      return {
        category: cat,
        count: catTotal,
        averageProgress: catAvgProgress,
        completedCount: catSkills.filter((s) => s.status === 'Completed').length,
      };
    });

    // Proficiency level breakdown
    const proficiencyDistribution = PROFICIENCY_LEVELS.map((level) => {
      return {
        level,
        count: skills.filter((s) => s.proficiencyLevel === level).length,
      };
    });

    // Status distribution
    const statusDistribution = [
      { name: 'Completed', count: completedSkills, color: '#10b981' },
      { name: 'Learning', count: learningSkills, color: '#6366f1' },
      { name: 'Not Started', count: notStartedSkills, color: '#94a3b8' },
    ];

    // Recently updated skills (latest 5)
    const recentlyUpdatedSkills = skills.slice(0, 5).map((s) => ({
      _id: s._id,
      name: s.name,
      category: s.category,
      proficiencyLevel: s.proficiencyLevel,
      progress: s.progress,
      status: s.status,
      updatedAt: s.updatedAt,
    }));

    // Additional quick metrics
    const totalProjects = await Project.countDocuments({ user: userId });
    const totalCertifications = await Certification.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      stats: {
        totalSkills,
        completedSkills,
        learningSkills,
        notStartedSkills,
        averageProficiency,
        totalProjects,
        totalCertifications,
        categoryDistribution,
        proficiencyDistribution,
        statusDistribution,
        recentlyUpdatedSkills,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
