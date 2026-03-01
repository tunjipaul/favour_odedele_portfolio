import mongoose from 'mongoose';

// SiteSettings is a SINGLETON — only ONE document ever exists.
// It stores content that doesn't belong to a list: hero text, book info, footer.
const siteSettingsSchema = new mongoose.Schema(
  {
    hero: {
      fullName: { type: String, default: 'FAVOR ODEDELE' },
      bioText: {
        type: String,
        default: 'Programs Manager specializing in Education, Entrepreneurship, and Human Capacity Development.',
      },
      portrait: { type: String, default: '' }, // Hero image Cloudinary URL
      cvUrl: { type: String, default: '' }, // CV PDF Cloudinary URL
    },
    book: {
      title: { type: String, default: 'Success Leaves Cues' },
      teaser: { type: String, default: '' },
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
      substack: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
