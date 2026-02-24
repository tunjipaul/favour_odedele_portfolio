import mongoose from 'mongoose';

// Captures emails from the "Join Waitlist" button on the book teaser section
const waitlistEntrySchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, default: '' },
  },
  { timestamps: true } // createdAt doubles as "submittedAt"
);

const WaitlistEntry = mongoose.model('WaitlistEntry', waitlistEntrySchema);
export default WaitlistEntry;
