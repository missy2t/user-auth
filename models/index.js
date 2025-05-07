const Department = require('./Department');
const AcademicYear = require('./AcademicYear');
const Course = require('./Course');
const Material = require('./Material');

// Relationships
Department.hasMany(AcademicYear, { onDelete: 'CASCADE' });
AcademicYear.belongsTo(Department);

AcademicYear.hasMany(Course, { onDelete: 'CASCADE' });
Course.belongsTo(AcademicYear);

Course.hasMany(Material, { onDelete: 'CASCADE' });
Material.belongsTo(Course);

module.exports = { Department, AcademicYear, Course, Material };
