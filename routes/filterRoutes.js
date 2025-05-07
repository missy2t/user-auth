const express = require('express');
const { getDepartments, getAcademicYears, getCourses, getMaterials } = require('../controllers/filterController');

const router = express.Router();

router.get('/departments', getDepartments);
router.get('/departments/:departmentId/academic-years', getAcademicYears);
router.get('/academic-years/:yearId/courses', getCourses);
router.get('/courses/:courseId/materials', getMaterials);

module.exports = router;
