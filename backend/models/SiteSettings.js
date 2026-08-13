import mongoose from 'mongoose';

// SiteSettings is a SINGLETON — only ONE document ever exists.
// It stores content that doesn't belong to a list: hero text, book info, footer.
const siteSettingsSchema = new mongoose.Schema(
  {
    hero: {
      fullName: { type: String, default: 'FAVOUR ODEDELE' },
      bioText: {
        type: String,
        default: 'Programs Manager specializing in Education, Entrepreneurship, and Human Capacity Development.',
      },
      portrait: { type: String, default: '' }, // Hero image Cloudinary URL
    },
    about: {
      eyebrow: { type: String, default: 'About Me' },
      heading: {
        type: String,
        default: 'I am building a life around ideas, people, and personal becoming.',
      },
      paragraph1: {
        type: String,
        default:
          'My work sits at the intersection of education, leadership, writing, and community. I am drawn to the question of how people grow: what shapes discipline, what gives people courage, and what kind of environments help them become more than they once imagined.',
      },
      paragraph2: {
        type: String,
        default:
          'This site is a home for my personal reflections, independent initiatives, book updates, community experiments, and the work I am gradually building as a future social entrepreneur.',
      },
      bookBadge: { type: String, default: 'Author of Becoming the 1%' },
      focusAreas: [
        {
          title: { type: String, default: 'Education and growth' },
          description: {
            type: String,
            default:
              'I care about learning as a personal discipline and as a tool for helping people see wider possibilities for their lives.',
          },
        },
        {
          title: { type: String, default: 'Ideas in public' },
          description: {
            type: String,
            default:
              'I write, reflect, and build around leadership, entrepreneurship, identity, discipline, and becoming a more intentional person.',
          },
        },
        {
          title: { type: String, default: 'Community building' },
          description: {
            type: String,
            default:
              'I am interested in rooms, circles, and initiatives that help people find clarity, accountability, and courage to move forward.',
          },
        },
      ],
    },
    highlightsSection: {
      eyebrow: { type: String, default: 'Major Highlights' },
      heading: {
        type: String,
        default: 'A few personal milestones from the work I am building.',
      },
    },
    book: {
      title: { type: String, default: 'Becoming the 1%' },
      teaser: { type: String, default: 'A personal book on discipline, identity, excellence, and the quiet decisions that shape who we become.' },
      coverUrl: { type: String, default: '' },
      pdfUrl: { type: String, default: '' },
      purchaseUrl: { type: String, default: '' },
      progress: { type: Number, default: 70 }, // Percentage complete
      stats: [
        {
          label: { type: String },
          target: { type: Number },
        },
      ],
    },
    footer: {
      quote: {
        type: String,
        default: 'Program management is not about you... It is more about your beneficiaries.',
      },
      linkedIn: { type: String, default: '' },
      email: { type: String, default: '' },
      bookCall: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    community: {
      title: { type: String, default: 'Join my community on Substack' },
      description: {
        type: String,
        default:
          'Join my community on Substack for essays, reflections, opportunities, book updates, and insights on education, leadership, entrepreneurship, and personal growth.',
      },
      buttonText: { type: String, default: 'Join my community on Substack' },
      substackUrl: { type: String, default: 'https://favourodedele.substack.com/subscribe' },
      openInNewTab: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;



