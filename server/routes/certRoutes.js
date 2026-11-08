const express = require('express');
const router = express.Router();
const {
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
} = require('../controllers/certController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All certification routes are protected

router.route('/')
  .get(getCertifications)
  .post(createCertification);

router.route('/:id')
  .get(getCertificationById)
  .put(updateCertification)
  .delete(deleteCertification);

module.exports = router;
