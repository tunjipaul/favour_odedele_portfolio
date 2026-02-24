import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tag: { type: String, required: true },
    tagColor: { type: String, default: 'primary' },
    role: { type: String, required: true },
    region: { type: String, required: true },
    image: { type: String, default: '' },      // Cloudinary URL
    problem: { type: String, default: '' },
    outcome: { type: String, default: '' },
    description: { type: String, required: true },
    keyOutput: { type: String, default: '' },
    order: { type: Number, default: 0 },        // Controls display order
    isVisible: { type: Boolean, default: true }, // Toggle without deleting
  },
  { timestamps: true } // Auto-adds createdAt and updatedAt fields
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
