'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Seed Users
    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@yem.com',
        password: '$2a$10$someHashedPassword', // (Use bcrypt in real apps)
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'mentor@yem.com',
        password: '$2a$10$someHashedPassword',
        first_name: 'John',
        last_name: 'Doe',
        role: 'mentor',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'mentee@yem.com',
        password: '$2a$10$someHashedPassword',
        first_name: 'Jane',
        last_name: 'Smith',
        role: 'mentee',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    // Seed Mentor Profiles (assuming users were inserted first)
    await queryInterface.bulkInsert('mentor_profiles', [
      {
        user_id: 2, // John Doe (mentor)
        expertise: JSON.stringify(['Business Strategy', 'Marketing']),
        experience: 5,
        company: 'Tech Corp',
        position: 'Senior Advisor',
        availability: JSON.stringify({ days: ['Mon', 'Wed', 'Fri'] }),
        mentorship_style: 'Structured',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    // Seed Mentorships
    await queryInterface.bulkInsert('mentorships', [
      {
        mentor_id: 2, // John Doe (mentor)
        mentee_id: 3, // Jane Smith (mentee)
        status: 'active',
        start_date: new Date(),
        goals: JSON.stringify(['Improve business plan', 'Learn marketing']),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});

    // Add more seed data for other tables (events, resources, etc.)...
  },

  async down(queryInterface, Sequelize) {
    // Clear all seeded data
    await queryInterface.bulkDelete('mentorships', null, {});
    await queryInterface.bulkDelete('mentor_profiles', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};