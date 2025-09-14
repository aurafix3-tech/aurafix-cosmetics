const mongoose = require('mongoose');
const PageBackground = require('../models/PageBackground');
require('dotenv').config();

const seedBackgrounds = [
  {
    pageName: 'loading',
    mediaType: 'image',
    mediaUrl: '/uploads/backgrounds/default-loading.jpg',
    alt: 'AuraFix Loading Screen',
    overlayOpacity: 0.4,
    overlayColor: '#000000',
    position: 'cover',
    duration: 2500,
    isActive: true
  },
  {
    pageName: 'home',
    mediaType: 'image',
    mediaUrl: '/uploads/backgrounds/default-home.jpg',
    alt: 'AuraFix Home Background',
    overlayOpacity: 0.3,
    overlayColor: '#000000',
    position: 'cover',
    isActive: true
  },
  {
    pageName: 'products',
    mediaType: 'image',
    mediaUrl: '/uploads/backgrounds/default-products.jpg',
    alt: 'AuraFix Products Background',
    overlayOpacity: 0.2,
    overlayColor: '#000000',
    position: 'cover',
    isActive: true
  },
  {
    pageName: 'about',
    mediaType: 'image',
    mediaUrl: '/uploads/backgrounds/default-about.jpg',
    alt: 'AuraFix About Background',
    overlayOpacity: 0.3,
    overlayColor: '#000000',
    position: 'cover',
    isActive: true
  },
  {
    pageName: 'contact',
    mediaType: 'image',
    mediaUrl: '/uploads/backgrounds/default-contact.jpg',
    alt: 'AuraFix Contact Background',
    overlayOpacity: 0.3,
    overlayColor: '#000000',
    position: 'cover',
    isActive: true
  }
];

async function seedPageBackgrounds() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://aurafix:honeywellT55$@cluster0.y6e7drb.mongodb.net/aurafix?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing backgrounds
    await PageBackground.deleteMany({});
    console.log('Cleared existing page backgrounds');

    // Insert seed data
    const insertedBackgrounds = await PageBackground.insertMany(seedBackgrounds);
    console.log(`Inserted ${insertedBackgrounds.length} page backgrounds`);

    console.log('Page backgrounds seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding page backgrounds:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedPageBackgrounds();
}

module.exports = { seedPageBackgrounds };
