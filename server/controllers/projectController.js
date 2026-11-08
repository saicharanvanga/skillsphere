const Project = require('../models/Project');

// @desc    Get all projects for current student
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({
      completionDate: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Helper to normalize technologies array
const parseTechnologies = (tech) => {
  if (Array.isArray(tech)) {
    return tech.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof tech === 'string') {
    return tech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
};

// @desc    Add a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      technologies,
      githubUrl,
      liveDemoUrl,
      completionDate,
      featured,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both a project title and description.',
      });
    }

    const project = await Project.create({
      user: req.user._id,
      title: title.trim(),
      description: description.trim(),
      technologies: parseTechnologies(technologies),
      githubUrl: githubUrl ? githubUrl.trim() : '',
      liveDemoUrl: liveDemoUrl ? liveDemoUrl.trim() : '',
      completionDate: completionDate ? new Date(completionDate) : new Date(),
      featured: Boolean(featured),
    });

    res.status(201).json({
      success: true,
      message: 'Project added successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const {
      title,
      description,
      technologies,
      githubUrl,
      liveDemoUrl,
      completionDate,
      featured,
    } = req.body;

    if (title) project.title = title.trim();
    if (description) project.description = description.trim();
    if (technologies !== undefined) {
      project.technologies = parseTechnologies(technologies);
    }
    if (githubUrl !== undefined) project.githubUrl = githubUrl.trim();
    if (liveDemoUrl !== undefined) project.liveDemoUrl = liveDemoUrl.trim();
    if (completionDate) project.completionDate = new Date(completionDate);
    if (featured !== undefined) project.featured = Boolean(featured);

    const updatedProject = await project.save();

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Project "${project.title}" removed successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
