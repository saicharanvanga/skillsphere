const User = require('../models/User');

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, institution, department, graduationYear } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your full name.',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address.',
      });
    }

    const sanitizedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address format.',
      });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const userExists = await User.findOne({ email: sanitizedEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A student account with this email address already exists.',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: sanitizedEmail,
      password,
      institution: institution ? institution.trim() : 'University Institute of Technology',
      department: department ? department.trim() : 'Computer Science & Engineering',
      graduationYear: graduationYear ? graduationYear.trim() : '2026',
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      message: 'Student account registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        headline: user.headline,
        bio: user.bio,
        institution: user.institution,
        department: user.department,
        graduationYear: user.graduationYear,
        socialLinks: user.socialLinks,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: sanitizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        headline: user.headline,
        bio: user.bio,
        institution: user.institution,
        department: user.department,
        graduationYear: user.graduationYear,
        socialLinks: user.socialLinks,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student account not found.',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student account not found.',
      });
    }

    const {
      name,
      headline,
      bio,
      institution,
      department,
      graduationYear,
      socialLinks,
      avatar,
    } = req.body;

    if (name && name.trim()) user.name = name.trim();
    if (headline !== undefined) user.headline = headline.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (institution !== undefined) user.institution = institution.trim();
    if (department !== undefined) user.department = department.trim();
    if (graduationYear !== undefined) user.graduationYear = graduationYear.trim();
    if (avatar !== undefined) user.avatar = avatar.trim();
    if (socialLinks && typeof socialLinks === 'object') {
      user.socialLinks = {
        ...user.socialLinks,
        ...socialLinks,
      };
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        headline: updatedUser.headline,
        bio: updatedUser.bio,
        institution: updatedUser.institution,
        department: updatedUser.department,
        graduationYear: updatedUser.graduationYear,
        socialLinks: updatedUser.socialLinks,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};
