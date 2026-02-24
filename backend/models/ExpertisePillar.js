import mongoose from 'mongoose';

// Expertise pillars are the 4 cards in the "Core Competencies" section
const expertisePillarSchema = new mongoose.Schema(
  {
    icon: { type: String, required: true },        // Lucide icon name e.g. "Settings", "Handshake"
    title: { type: String, required: true },
    description: { type: String, required: true },
    hoverColor: { type: String, default: 'group-hover:bg-primary group-hover:text-white' },
    iconBg: { type: String, default: 'text-primary' },
    borderHover: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ExpertisePillar = mongoose.model('ExpertisePillar', expertisePillarSchema);
export default ExpertisePillar;
