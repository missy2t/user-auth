const { Department, AcademicYear, Course, Material } = require('../models');

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments', details: error.message });
  }
};

exports.getAcademicYears = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const academicYears = await AcademicYear.findAll({ where: { DepartmentId: departmentId } });
    res.status(200).json(academicYears);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch academic years', details: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const { yearId } = req.params;
    const courses = await Course.findAll({ where: { AcademicYearId: yearId } });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses', details: error.message });
  }
};

exports.getMaterials = async (req, res) => {
  try {
    const { courseId } = req.params;
    const materials = await Material.findAll({ where: { CourseId: courseId } });
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch materials', details: error.message });
  }
};
