const Certification = require('../models/Certification');

// @desc    Get all certifications for current student
// @route   GET /api/certifications
// @access  Private
const getCertifications = async (req, res, next) => {
  try {
    const certifications = await Certification.find({ user: req.user._id }).sort({
      issueDate: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: certifications.length,
      certifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single certification by ID
// @route   GET /api/certifications/:id
// @access  Private
const getCertificationById = async (req, res, next) => {
  try {
    const cert = await Certification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found',
      });
    }

    res.status(200).json({
      success: true,
      certification: cert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new certification
// @route   POST /api/certifications
// @access  Private
const createCertification = async (req, res, next) => {
  try {
    const { name, issuingOrganization, issueDate, credentialUrl, credentialId } = req.body;

    if (!name || !issuingOrganization) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both certification name and issuing organization.',
      });
    }

    const certification = await Certification.create({
      user: req.user._id,
      name: name.trim(),
      issuingOrganization: issuingOrganization.trim(),
      issueDate: issueDate ? new Date(issueDate) : new Date(),
      credentialUrl: credentialUrl ? credentialUrl.trim() : '',
      credentialId: credentialId ? credentialId.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Certification added successfully',
      certification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update certification
// @route   PUT /api/certifications/:id
// @access  Private
const updateCertification = async (req, res, next) => {
  try {
    let cert = await Certification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found',
      });
    }

    const { name, issuingOrganization, issueDate, credentialUrl, credentialId } = req.body;

    if (name) cert.name = name.trim();
    if (issuingOrganization) cert.issuingOrganization = issuingOrganization.trim();
    if (issueDate) cert.issueDate = new Date(issueDate);
    if (credentialUrl !== undefined) cert.credentialUrl = credentialUrl.trim();
    if (credentialId !== undefined) cert.credentialId = credentialId.trim();

    const updatedCert = await cert.save();

    res.status(200).json({
      success: true,
      message: 'Certification updated successfully',
      certification: updatedCert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete certification
// @route   DELETE /api/certifications/:id
// @access  Private
const deleteCertification = async (req, res, next) => {
  try {
    const cert = await Certification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Certification "${cert.name}" removed successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
};
