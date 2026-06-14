require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/project.model');
const chalk = require('chalk');

const PH_THUMB  = '/uploads/projects/placeholder-thumb.webp';
const PH_BANNER = '/uploads/projects/placeholder-banner.webp';

const projects = [
  {
    title: 'OLU',
    client: 'OLU Agency',
    cat: 'Web Design & Development',
    img:       '/uploads/olu 1.png',
    bannerImg: '/uploads/olu 1.png',
    mainHeadingStart: 'Original.',
    mainHeadingMute: 'Limitless.',
    mainHeadingEnd: 'Unforgettable.',
    description: 'OLU is a high-end Saudi creative agency built around one idea — creativity without boundaries. We designed and developed their complete digital presence: a visually immersive website that reflects their identity as a "creative operating system." The result is a cinematic, scroll-driven experience packed with bold typography, layered animations, and a portfolio showcase that commands attention.',
    website: 'https://olu.com.sa',
    featured: true,
    categories: [
      { name: 'Brand Identity',  tags: ['Logo', 'Visual Identity', 'Brand Guidelines', 'Typography'] },
      { name: 'Web Development', tags: ['Angular', 'GSAP Animations', 'Responsive Design', 'CMS'] },
      { name: 'UI/UX Design',    tags: ['Motion Design', 'Art Direction', 'User Experience'] },
    ],
    gallery: [
      '/uploads/olu 1.png',
      '/uploads/olu 2.png',
      '/uploads/olu 3.png',
      '/uploads/olu 4.png',
      '/uploads/olu 5.png',
      '/uploads/olu 6.png',
    ],
  },
  {
    title: "Qimam Al-A'mal",
    client: "Qimam Al-A'mal Contracting",
    cat: 'Web Design & Development',
    img:       '/uploads/qimam-alamaal cover.png',
    bannerImg: '/uploads/qimam-alamaal cover.png',
    mainHeadingStart: 'Building',
    mainHeadingMute: 'trust',
    mainHeadingEnd: 'from the ground up.',
    description: "Qimam Al-A'mal is a leading contracting company that needed a corporate digital identity matching the scale of their work. We crafted a professional, confidence-inspiring website that communicates reliability, expertise, and scope — translating the weight of physical construction into a sharp digital experience. Clean layouts, strong imagery, and bilingual content come together to establish authority in a competitive market.",
    website: 'https://qimam-alamaal.com',
    featured: true,
    categories: [
      { name: 'Web Design',      tags: ['Corporate Website', 'Bilingual AR/EN', 'Responsive'] },
      { name: 'Web Development', tags: ['Frontend', 'CMS Integration', 'SEO Setup'] },
      { name: 'Copywriting',     tags: ['Arabic Content', 'English Content', 'Brand Tone'] },
    ],
    gallery: [
      '/uploads/qimam-alamaal 1.png',
      '/uploads/qimam-alamaal 2.png',
      '/uploads/qimam-alamaal 3.png',
      '/uploads/qimam-alamaal 4.png',
      '/uploads/qimam-alamaal 5.png',
    ],
  },
  {
    title: 'Mora Beauty Hub',
    client: 'Mora Beauty Hub',
    cat: 'E-Commerce & Brand Identity',
    img:       '/uploads/mora-beautyhub cover.png',
    bannerImg: '/uploads/mora-beautyhub cover.png',
    mainHeadingStart: 'Premium beauty,',
    mainHeadingMute: 'beautifully',
    mainHeadingEnd: 'delivered.',
    description: 'Mora Beauty Hub is a premium beauty retail brand that demanded a digital storefront as refined as the products it carries. We delivered a full e-commerce experience — from brand identity and visual language to the complete frontend build. Soft tones, elegant typography, and an intuitive product browsing experience create a shopping environment that feels luxurious at every touchpoint.',
    website: 'https://mora-beautyhub.com',
    featured: true,
    categories: [
      { name: 'Brand Identity', tags: ['Logo', 'Color Palette', 'Packaging Design', 'Brand Voice'] },
      { name: 'E-Commerce',     tags: ['Product Pages', 'Cart & Checkout', 'Payment Integration'] },
      { name: 'UI/UX Design',   tags: ['Mobile-First', 'User Journey', 'Conversion Optimisation'] },
    ],
    gallery: [
      '/uploads/mora-beautyhub 1.png',
      '/uploads/mora-beautyhub 2.png',
      '/uploads/mora-beautyhub 3.png',
      '/uploads/mora-beautyhub 4.png',
      '/uploads/mora-beautyhub 5.png',
      '/uploads/mora-beautyhub 6.png',
      '/uploads/mora-beautyhub 7.png',
    ],
  },
  {
    title: 'BoneCare UK',
    client: 'BoneCare UK',
    cat: 'Medical Web Design',
    img:       '/uploads/bonecare Cover.png',
    bannerImg: '/uploads/bonecare Cover.png',
    mainHeadingStart: 'Expert care,',
    mainHeadingMute: 'precisely',
    mainHeadingEnd: 'presented.',
    description: "BoneCare UK is the personal practice of a consultant orthopaedic surgeon specialising in paediatric orthopaedics, foot & ankle surgery, and limb reconstruction. We designed a clinical yet approachable website that builds immediate patient trust — surfacing the surgeon's Royal College credentials, research publications, and GMC registration in a clean, easy-to-navigate layout. The result is a professional digital presence that reflects world-class expertise.",
    website: 'https://bonecare.uk',
    featured: true,
    categories: [
      { name: 'Medical Web Design', tags: ['Healthcare UX', 'Patient Journey', 'Trust Signals'] },
      { name: 'Web Development',    tags: ['SEO', 'Accessibility', 'Mobile Responsive'] },
      { name: 'Brand Identity',     tags: ['Logo', 'Medical Branding', 'Colour System'] },
    ],
    gallery: [
      '/uploads/bonecare 1.png',
      '/uploads/bonecare 2.png',
      '/uploads/bonecare 3.png',
    ],
  },
  {
    title: 'CareNova Health',
    client: 'CareNova Health',
    cat: 'Healthcare Web Design',
    img:       '/uploads/carenova-health Cover.png',
    bannerImg: '/uploads/carenova-health Cover.png',
    mainHeadingStart: 'Healthcare made',
    mainHeadingMute: 'simple,',
    mainHeadingEnd: 'personal & effective.',
    description: 'CareNova is an integrated healthcare company operating across Egypt and the MENA region, offering training, medical services, and consultancy under one roof. We built a comprehensive digital platform that communicates their "Local Experts, Global Standards" promise — structuring three distinct service pillars into a unified, confident web experience that speaks equally well to patients, professionals, and institutional partners.',
    website: 'https://carenova-health.com',
    featured: true,
    categories: [
      { name: 'Web Design',      tags: ['Multi-Service Platform', 'Healthcare UI', 'Bilingual'] },
      { name: 'Brand Strategy',  tags: ['Positioning', 'Messaging', 'Visual Language'] },
      { name: 'Web Development', tags: ['Frontend', 'CMS', 'Performance Optimisation'] },
    ],
    gallery: [
      '/uploads/carenova-health 1.png',
      '/uploads/carenova-health 2.png',
      '/uploads/carenova-health 3.png',
    ],
  },
];

const seedProjects = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/se_agency');
    console.log(chalk.cyan('Connected to MongoDB...'));

    for (const project of projects) {
      await Project.findOneAndUpdate(
        { title: project.title },
        project,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(chalk.green(`Upserted: ${project.title}`));
    }

    console.log(chalk.green.bold('\nAll projects seeded!'));
  } catch (error) {
    console.error(chalk.red.bold('Error seeding projects:'), error.message);
  } finally {
    await mongoose.connection.close();
    console.log(chalk.cyan('MongoDB connection closed.'));
  }
};

seedProjects();
