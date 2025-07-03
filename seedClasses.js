const mongoose = require('mongoose');
const Class = require('./models/Class'); // Import the Class model
const connectDB = require('./config/db');
require('dotenv').config();

// --- PREDEFINED CLASS DATA (30 Classes) ---
const classesToSeed = [
  // --- Strength & Conditioning ---
  {
    name: 'Strength Basics',
    description: 'Learn the fundamentals of strength training with proper form on major lifts like squats, deadlifts, and bench press.',
    trainer: 'Rajesh Kumar',
    schedule: 'Mon, Wed at 6:00 PM',
    difficulty: 'Beginner',
    maxSize: 12
  },
  {
    name: 'Powerlifting Club',
    description: 'Advanced session for experienced lifters focusing on the three main powerlifting movements. Not for beginners.',
    trainer: 'Rajesh Kumar',
    schedule: 'Sat at 9:00 AM',
    difficulty: 'Advanced',
    maxSize: 8
  },
  {
    name: 'Olympic Weightlifting',
    description: 'Master the snatch and clean & jerk in this technical class focused on explosive power and precision.',
    trainer: 'Arjun Rao',
    schedule: 'Tue at 7:00 PM',
    difficulty: 'Advanced',
    maxSize: 6
  },
  {
    name: 'Kettlebell Flow',
    description: 'A dynamic, full-body workout using kettlebells to build strength, endurance, and coordination through fluid movements.',
    trainer: 'Priya Sharma',
    schedule: 'Thu at 8:00 AM',
    difficulty: 'Intermediate',
    maxSize: 15
  },
  {
    name: 'Functional Fitness',
    description: 'Train for life with movements that mimic everyday activities. Improve your overall fitness and prevent injuries.',
    trainer: 'Rajesh Kumar',
    schedule: 'Fri at 9:00 AM',
    difficulty: 'All Levels',
    maxSize: 18
  },
  {
    name: 'BodyPump™ Fusion',
    description: 'The original barbell class that strengthens your entire body. This 60-minute workout challenges all your major muscle groups.',
    trainer: 'Arjun Rao',
    schedule: 'Mon, Wed at 5:30 PM',
    difficulty: 'Intermediate',
    maxSize: 20
  },
  {
    name: 'Cross-Training WOD',
    description: 'Our "Workout of the Day" combines elements of cardio, weightlifting, and gymnastics for a challenging and varied session.',
    trainer: 'Arjun Rao',
    schedule: 'Daily at 12:00 PM',
    difficulty: 'Intermediate',
    maxSize: 16
  },
  // --- Cardio & Endurance ---
  {
    name: 'HIIT Intensive',
    description: 'High-intensity interval training designed to maximize calorie burn and boost your metabolism in a short amount of time.',
    trainer: 'Arjun Rao',
    schedule: 'Tue, Thu at 6:30 AM',
    difficulty: 'Advanced',
    maxSize: 15
  },
  {
    name: 'Spin Cycle Burn',
    description: 'An energetic indoor cycling class with high-energy music and motivating instructors to push your limits.',
    trainer: 'Priya Sharma',
    schedule: 'Tue, Thu at 6:00 PM',
    difficulty: 'Intermediate',
    maxSize: 18
  },
  {
    name: 'Treadmill Titans',
    description: 'A guided running class on treadmills, focusing on interval training, hill climbs, and speed work to boost your cardio fitness.',
    trainer: 'Rajesh Kumar',
    schedule: 'Mon, Fri at 7:00 AM',
    difficulty: 'All Levels',
    maxSize: 12
  },
  {
    name: 'Boxing Conditioning',
    description: 'A high-energy workout combining boxing fundamentals on heavy bags with intense cardio drills. No sparring.',
    trainer: 'Arjun Rao',
    schedule: 'Wed at 7:00 PM',
    difficulty: 'Intermediate',
    maxSize: 16
  },
  {
    name: 'Rowing Powerhouse',
    description: 'Master the rowing machine with a workout that builds full-body strength and cardiovascular endurance.',
    trainer: 'Rajesh Kumar',
    schedule: 'Sat at 11:00 AM',
    difficulty: 'All Levels',
    maxSize: 10
  },
  {
    name: 'Jump Rope Agility',
    description: 'A fun and challenging class focused on jump rope techniques, footwork, and coordination for a serious cardio burn.',
    trainer: 'Priya Sharma',
    schedule: 'Thu at 12:00 PM',
    difficulty: 'Beginner',
    maxSize: 20
  },
  // --- Mind & Body ---
  {
    name: 'Morning Yoga Flow',
    description: 'A revitalizing yoga session to start your day with energy and focus. All levels welcome.',
    trainer: 'Priya Sharma',
    schedule: 'Mon, Wed, Fri at 7:00 AM',
    difficulty: 'All Levels',
    maxSize: 20
  },
  {
    name: 'Restorative Yin Yoga',
    description: 'A slow-paced, meditative yoga style with long-held passive poses to target deep connective tissues and increase flexibility.',
    trainer: 'Priya Sharma',
    schedule: 'Sun at 4:00 PM',
    difficulty: 'Beginner',
    maxSize: 25
  },
  {
    name: 'Power Vinyasa',
    description: 'An athletic and challenging yoga class that links breath to movement in a heated room for a detoxifying sweat.',
    trainer: 'Arjun Rao',
    schedule: 'Tue, Thu at 5:30 PM',
    difficulty: 'Intermediate',
    maxSize: 15
  },
  {
    name: 'Pilates Mat Fusion',
    description: 'Strengthen your core and improve posture with this classic mat Pilates class focusing on precision and control.',
    trainer: 'Priya Sharma',
    schedule: 'Mon, Wed at 9:00 AM',
    difficulty: 'Beginner',
    maxSize: 18
  },
  {
    name: 'Guided Meditation',
    description: 'A 30-minute session to calm the mind, reduce stress, and improve focus. Perfect for post-workout recovery or a midday reset.',
    trainer: 'Priya Sharma',
    schedule: 'Fri at 12:30 PM',
    difficulty: 'All Levels',
    maxSize: 30
  },
  {
    name: 'Mobility & Flexibility',
    description: 'Improve your range of motion, reduce muscle soreness, and prevent injuries with foam rolling and deep stretching.',
    trainer: 'Rajesh Kumar',
    schedule: 'Sat at 1:00 PM',
    difficulty: 'All Levels',
    maxSize: 20
  },
  // --- Dance & Fun ---
  {
    name: 'Zumba Dance Party',
    description: 'Burn calories while having fun! A Latin-inspired dance fitness class that feels more like a party than a workout.',
    trainer: 'Priya Sharma',
    schedule: 'Wed at 7:00 PM',
    difficulty: 'Beginner',
    maxSize: 30
  },
  {
    name: 'Hip-Hop Cardio',
    description: 'Learn fun, high-energy hip-hop choreography set to the latest hits. No dance experience necessary.',
    trainer: 'Priya Sharma',
    schedule: 'Fri at 6:30 PM',
    difficulty: 'All Levels',
    maxSize: 25
  },
  {
    name: 'Barre Sculpt',
    description: 'A ballet-inspired workout using the barre and light weights to create long, lean muscles and improve posture.',
    trainer: 'Priya Sharma',
    schedule: 'Tue at 9:30 AM',
    difficulty: 'Beginner',
    maxSize: 15
  },
  // --- Specialty & Express Classes ---
  {
    name: 'Core & Abs Blast',
    description: 'A 30-minute express class focused entirely on strengthening and defining your core and abdominal muscles.',
    trainer: 'Arjun Rao',
    schedule: 'Mon, Wed, Fri at 12:00 PM',
    difficulty: 'All Levels',
    maxSize: 25
  },
  {
    name: 'Glute Camp',
    description: 'A 45-minute workout dedicated to building and sculpting your glutes using bands, weights, and targeted exercises.',
    trainer: 'Priya Sharma',
    schedule: 'Thu at 5:30 PM',
    difficulty: 'Intermediate',
    maxSize: 20
  },
  {
    name: 'TRX Suspension Training',
    description: 'Use your body weight and TRX straps to build strength, balance, flexibility, and core stability simultaneously.',
    trainer: 'Rajesh Kumar',
    schedule: 'Tue at 12:00 PM',
    difficulty: 'Intermediate',
    maxSize: 10
  },
  {
    name: 'Senior Fit',
    description: 'A low-impact class for older adults focusing on strength, balance, and flexibility to enhance daily living.',
    trainer: 'Rajesh Kumar',
    schedule: 'Mon, Wed at 11:00 AM',
    difficulty: 'Beginner',
    maxSize: 15
  },
  {
    name: 'Pre-Natal Fitness',
    description: 'A safe and effective workout for expectant mothers, designed to maintain strength and fitness throughout pregnancy.',
    trainer: 'Priya Sharma',
    schedule: 'Sat at 11:00 AM',
    difficulty: 'Beginner',
    maxSize: 10
  },
  {
    name: 'Athletic Recovery',
    description: 'An active recovery session using foam rollers, stretching, and light movement to reduce muscle soreness and improve performance.',
    trainer: 'Rajesh Kumar',
    schedule: 'Sun at 10:00 AM',
    difficulty: 'All Levels',
    maxSize: 20
  },
  {
    name: 'Teen Strength Program',
    description: 'A supervised program for teenagers (13-17) to learn safe and effective strength training techniques.',
    trainer: 'Rajesh Kumar',
    schedule: 'Tue, Thu at 4:00 PM',
    difficulty: 'Beginner',
    maxSize: 10
  },
  {
    name: 'Weekend Warrior Bootcamp',
    description: 'An intense, 90-minute bootcamp-style workout on Saturday mornings to kickstart your weekend.',
    trainer: 'Arjun Rao',
    schedule: 'Sat at 8:00 AM',
    difficulty: 'Intermediate',
    maxSize: 25
  },
];
// ----------------------------

const seedDB = async () => {
  try {
    // 1. Connect to the database
    await connectDB();

    // 2. Clear existing classes to avoid duplicates
    await Class.deleteMany({});
    console.log('Previous classes deleted.');

    // 3. Insert the new classes into the database
    await Class.insertMany(classesToSeed);
    
    console.log(`✅ ${classesToSeed.length} classes have been successfully seeded!`);

  } catch (error) {
    console.error('Error seeding classes:', error.message);
  } finally {
    // 4. Disconnect from the database
    mongoose.disconnect();
    console.log('Disconnected from database.');
  }
};

// Run the seed function
seedDB();