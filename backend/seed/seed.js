/**
 * SEED SCRIPT — Run this ONCE to populate MongoDB with the existing portfolio data.
 * 
 * Usage: node seed/seed.js
 * 
 * WARNING: This will clear existing data and re-insert. Only run on a fresh/empty database.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import Project from '../models/Project.js';
import GalleryItem from '../models/GalleryItem.js';
import Metric from '../models/Metric.js';
import ExpertisePillar from '../models/ExpertisePillar.js';
import SiteSettings from '../models/SiteSettings.js';
import Admin from '../models/Admin.js';

// ─── Data (taken directly from the hardcoded frontend files) ─────────────────

const projects = [
  {
    title: 'Embark Academy',
    tag: 'Education Tech',
    tagColor: 'accent-magenta',
    role: 'Program Manager',
    region: 'Virtual Academy — West Africa (NG, GH, CI)',
    image: '',
    problem: 'Stagnant offline engagement models were failing to reach remote cohorts, resulting in a 40% drop in completion rates.',
    outcome: 'Deployed a hybrid learning framework that increased retention by 85% and expanded access to 3 new regions within 6 months.',
    description: 'Managed a 6-month virtual entrepreneurship academy. Oversaw rigorous selection, live sessions, spotlight shows, and mentorship.',
    keyOutput: 'Managed the "Capstone Project" (Business Ideation) and Pitch Competitions.',
    order: 1,
  },
  {
    title: 'Project Thrive',
    tag: 'Leadership Scaling',
    tagColor: 'primary',
    role: 'Cafe Session Manager',
    region: 'Social Impact & Scholarships',
    image: '',
    problem: 'Lack of standardized mentorship meant program quality varied significantly across 12 different project sites.',
    outcome: 'Designed a "Train-the-Trainer" blueprint, resulting in 100% KPI alignment and $200k in operational savings.',
    description: 'Curated intimate "Cafe Sessions" (30-50 people) for high-quality career development.',
    keyOutput: 'Managed a scholarship program receiving 5,000+ applications, selecting 50 beneficiaries for 50k Naira grants.',
    order: 2,
  },
  {
    title: 'The Audacity Challenge',
    tag: 'Community',
    tagColor: 'accent-green',
    role: 'Programs Lead',
    region: 'Community & Accountability',
    image: '',
    problem: 'A speaker cancellation mid-program threatened to derail a key engagement week during a 50-day community challenge.',
    outcome: 'Successfully pivoted into a "Presentation Day," turning a scheduling conflict into a valuable beneficiary feedback loop.',
    description: 'Lead for a 50-day community challenge focused on accountability and growth.',
    keyOutput: 'Turned crisis into opportunity through adaptive program management and rapid stakeholder communication.',
    order: 3,
  },
  {
    title: 'Junior Chamber International (JCI)',
    tag: 'Civic Engagement',
    tagColor: 'primary',
    role: 'Director of Skills Development',
    region: 'Leadership & Civic Engagement',
    image: '',
    problem: 'Young professionals in the chapter lacked structured skills development pathways and business acumen training.',
    outcome: 'Organized the maiden edition of "Pound Sapa" (Business of Skills) — now in its 3rd edition. Awarded "Most Outstanding Board Director."',
    description: 'Organized the maiden edition of "Pound Sapa" (Business of Skills).',
    keyOutput: 'The model is currently in its 3rd edition. Published "Journeys in Development" newsletter.',
    order: 4,
  },
];

const galleryItems = [
  { title: 'International Youth Summit', image: '', accentColor: 'primary', order: 1 },
  { title: 'Leadership Training', image: '', accentColor: 'accent-magenta', order: 2 },
  { title: 'Embark Academy Cohort 5', image: '', accentColor: 'accent-green', order: 3 },
  { title: 'Boardroom Strategy', image: '', accentColor: 'primary', order: 4 },
  { title: 'Convocation Ceremony', image: '', accentColor: 'accent-magenta', order: 5 },
  { title: 'Field Consultancy', image: '', accentColor: 'accent-green', order: 6 },
];

const metrics = [
  { number: '01', value: '10k+', label: 'Lives Impacted', targetValue: 10000, order: 1 },
  { number: '02', value: '20+', label: 'Global Contributors', targetValue: 20, order: 2 },
  { number: '03', value: 'Multi', label: 'Country Oversight', targetValue: null, order: 3 },
];

const expertisePillars = [
  {
    icon: 'Settings',
    title: 'Operational Excellence',
    description: 'Optimizing internal workflows and managing resources to ensure peak performance across global teams.',
    hoverColor: 'group-hover:bg-primary group-hover:text-white',
    iconBg: 'text-primary',
    borderHover: '',
    order: 1,
  },
  {
    icon: 'Handshake',
    title: 'Strategic Partnerships',
    description: 'Cultivating high-value alliances with stakeholders, NGOs, and corporate entities to scale program reach.',
    hoverColor: 'group-hover:bg-accent-magenta group-hover:text-white',
    iconBg: 'bg-accent-magenta/10 text-accent-magenta',
    borderHover: 'hover:border-accent-magenta',
    order: 2,
  },
  {
    icon: 'GraduationCap',
    title: 'Educational Innovation',
    description: 'Designing cutting-edge curriculum and hybrid learning frameworks for the modern digital era.',
    hoverColor: 'group-hover:bg-accent-green group-hover:text-white',
    iconBg: 'bg-accent-green/10 text-accent-green',
    borderHover: 'hover:border-accent-green',
    order: 3,
  },
  {
    icon: 'BarChart3',
    title: 'Scalable Impact',
    description: 'Developing data-driven models to replicate success across multiple geographic and socio-economic contexts.',
    hoverColor: 'group-hover:bg-primary group-hover:text-white',
    iconBg: 'text-primary',
    borderHover: '',
    order: 4,
  },
];

const siteSettings = {
  hero: {
    fullName: 'FAVOR ODEDELE',
    bioText: 'Programs Manager specializing in Education, Entrepreneurship, and Human Capacity Development.',
    portrait: '',
  },
  book: {
    title: 'Success Leaves Cues',
    teaser: 'A curated guide for fresh graduates moving beyond generic advice. Featuring interviews with peers from Dangote, LBS, Chevron, and the creative industry.',
    progress: 70,
    stats: [
      { label: 'Days Left', target: 45 },
      { label: 'Chapters Done', target: 7 },
      { label: 'Key Pillars', target: 4 },
    ],
  },
  footer: {
    quote: 'Program management is not about you... It is more about your beneficiaries.',
    linkedIn: '',
    email: '',
  },
};

// ─── Run the Seed ─────────────────────────────────────────────────────────────

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('\n🌱 Starting database seed...\n');

    // Clear existing data
    await Promise.all([
      Project.deleteMany({}),
      GalleryItem.deleteMany({}),
      Metric.deleteMany({}),
      ExpertisePillar.deleteMany({}),
      SiteSettings.deleteMany({}),
      Admin.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Insert new data
    await Project.insertMany(projects);
    console.log(`✅ Inserted ${projects.length} projects`);

    await GalleryItem.insertMany(galleryItems);
    console.log(`✅ Inserted ${galleryItems.length} gallery items`);

    await Metric.insertMany(metrics);
    console.log(`✅ Inserted ${metrics.length} metrics`);

    await ExpertisePillar.insertMany(expertisePillars);
    console.log(`✅ Inserted ${expertisePillars.length} expertise pillars`);

    await SiteSettings.create(siteSettings);
    console.log('✅ Inserted site settings');

    // Create admin account with a HASHED password
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    // The "12" is the salt rounds — higher = slower hash = harder to crack
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
    });
    console.log(`✅ Created admin account: ${process.env.ADMIN_EMAIL}`);

    console.log('\n🎉 Database seeded successfully!\n');
    process.exit(0); // Exit cleanly
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();
