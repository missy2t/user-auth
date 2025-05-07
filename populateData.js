const { Department, AcademicYear, Course, Material, User } = require('./models');
const sequelize = require('./config/database');

const populateData = async () => {
  try {
    console.log('Resetting database...');
    await sequelize.sync({ force: true }); // Reset the database

    console.log('Populating sample data...');

    // Create a sample user
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: await require('bcryptjs').hash('password123', 10), // Hash the password
      role: 'user',
    });

    console.log(`Sample user created with id: ${user.id}`);

    // Create Departments
    const csDepartment = await Department.create({ name: 'Computer Science' });
    const eeDepartment = await Department.create({ name: 'Electrical Engineering' });

    // Create Academic Years
    const year1 = await AcademicYear.create({ year: 'Year 1', DepartmentId: csDepartment.id });
    const year2 = await AcademicYear.create({ year: 'Year 2', DepartmentId: csDepartment.id });
    const year3 = await AcademicYear.create({ year: 'Year 1', DepartmentId: eeDepartment.id });

    // Create Courses
    const course1 = await Course.create({ name: 'Introduction to Programming', AcademicYearId: year1.id });
    const course2 = await Course.create({ name: 'Data Structures', AcademicYearId: year2.id });
    const course3 = await Course.create({ name: 'Circuit Analysis', AcademicYearId: year3.id });

    // Create Materials
    await Material.create({
      title: 'Programming Basics',
      description: 'An introduction to programming concepts.',
      price: 10.0,
      filePath: 'uploads/programming_basics.pdf',
      CourseId: course1.id,
    });

    await Material.create({
      title: 'Advanced Data Structures',
      description: 'Detailed notes on data structures.',
      price: 15.0,
      filePath: 'uploads/advanced_data_structures.pdf',
      CourseId: course2.id,
    });

    await Material.create({
      title: 'Circuit Analysis Notes',
      description: 'Comprehensive notes on circuit analysis.',
      price: 12.0,
      filePath: 'uploads/circuit_analysis.pdf',
      CourseId: course3.id,
    });

    console.log('Sample data populated successfully!');
  } catch (error) {
    console.error('Error populating data:', error);
  } finally {
    process.exit();
  }
};

populateData();
