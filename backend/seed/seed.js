import 'dotenv/config';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import Project from '../models/Project.js';
import GalleryItem from '../models/GalleryItem.js';
import SiteSettings from '../models/SiteSettings.js';
import Admin from '../models/Admin.js';

const projects = [
  {
    title: 'Becoming the 1%',
    tag: 'Writing',
    tagColor: 'accent-magenta',
    category: 'highlight',
    role: 'Author',
    region: 'Personal writing project',
    image: '',
    problem: '',
    outcome: 'A book project on discipline, identity, excellence, and intentional personal growth.',
    description: 'A personal book project exploring what it means to choose growth deliberately and become part of the few who live with clarity, courage, and discipline.',
    keyOutput: 'Book updates, early notes, and reader community are being built around the project.',
    order: 1,
  },
  {
    title: 'Civic Leadership',
    tag: 'Leadership',
    tagColor: 'primary',
    category: 'highlight',
    role: 'Community leader',
    region: 'Leadership and service',
    image: '',
    problem: '',
    outcome: 'Led skills-focused conversations and initiatives for young people exploring work, purpose, and enterprise.',
    description: 'A personal commitment to civic participation, skills development, and leadership spaces where young people can find direction and confidence.',
    keyOutput: 'Recognized for leadership contribution and practical community programming.',
    order: 2,
  },
  {
    title: 'Community Experiments',
    tag: 'Community',
    tagColor: 'accent-green',
    category: 'highlight',
    role: 'Builder',
    region: 'Independent initiatives',
    image: '',
    problem: '',
    outcome: 'Creating spaces for reflection, accountability, opportunity sharing, and personal development.',
    description: 'Independent community work focused on the people and conversations that help others move from intention to action.',
    keyOutput: 'A growing community around education, leadership, entrepreneurship, and personal growth.',
    order: 3,
  },
];

const galleryItems = [
  { title: 'Community Gathering', image: '', accentColor: 'primary', order: 1 },
  { title: 'Speaking Moment', image: '', accentColor: 'accent-magenta', order: 2 },
  { title: 'Learning Circle', image: '', accentColor: 'accent-green', order: 3 },
  { title: 'Writing and Reflection', image: '', accentColor: 'primary', order: 4 },
  { title: 'Leadership Room', image: '', accentColor: 'accent-magenta', order: 5 },
  { title: 'Personal Milestone', image: '', accentColor: 'accent-green', order: 6 },
];

const siteSettings = {
  hero: {
    fullName: 'FAVOUR ODEDELE',
    bioText: 'Author, community builder, and future social entrepreneur writing about education, leadership, entrepreneurship, and personal growth.',
    portrait: '',
  },
  book: {
    title: 'Becoming the 1%',
    teaser: 'A personal book on discipline, identity, excellence, and the quiet decisions that shape who we become.',
    coverUrl: '',
    pdfUrl: '',
    progress: 0,
    stats: [],
  },
  footer: {
    quote: 'Ideas, writing, and community.',
    linkedIn: '',
    email: '',
    bookCall: '',
    substack: '',
    twitter: '',
  },
};

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('\nStarting database seed...\n');

    await Promise.all([
      Project.deleteMany({}),
      GalleryItem.deleteMany({}),
      SiteSettings.deleteMany({}),
      Admin.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    await Project.insertMany(projects);
    console.log(`Inserted ${projects.length} highlights`);

    await GalleryItem.insertMany(galleryItems);
    console.log(`Inserted ${galleryItems.length} gallery items`);

    await SiteSettings.create(siteSettings);
    console.log('Inserted site settings');

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
    });
    console.log(`Created admin account: ${process.env.ADMIN_EMAIL}`);

    console.log('\nDatabase seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();

