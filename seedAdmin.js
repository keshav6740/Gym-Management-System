const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');
require('dotenv').config();

// --- Configuration ---
// Set the details for your first admin user here
const adminCredentials = {
  email: 'admin@flexfusion.com',
  password: 'AdminPassword123' // Choose a strong password
};
// ---------------------

const seedDB = async () => {
  try {
    // 1. Connect to the database
    await connectDB();

    // 2. Check if an admin with this email already exists
    const existingAdmin = await Admin.findOne({ email: adminCredentials.email });
    if (existingAdmin) {
      console.log('An admin with this email already exists. Aborting.');
      return; // Exit if admin exists
    }

    // 3. Create a new admin instance
    // The password will be automatically hashed by the pre-save hook in your Admin.js model
    const newAdmin = new Admin(adminCredentials);
    
    // 4. Save the new admin to the database
    await newAdmin.save();
    
    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${adminCredentials.email}`);
    console.log(`   Password: ${adminCredentials.password}`);

  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  } finally {
    // 5. Disconnect from the database
    mongoose.disconnect();
    console.log('Disconnected from database.');
  }
};

// Run the seed function
seedDB();