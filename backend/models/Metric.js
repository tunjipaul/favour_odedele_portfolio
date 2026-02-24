import mongoose from 'mongoose';

// Metrics are the animated stats in the ImpactMetrics section
// e.g. "10k+ Lives Impacted", "20+ Global Contributors", "Multi Country Oversight"
const metricSchema = new mongoose.Schema(
  {
    number: { type: String, required: true }, // Display number e.g. "01", "02"
    value: { type: String, required: true },  // Display value e.g. "10k+", "Multi"
    label: { type: String, required: true },  // Label e.g. "Lives Impacted"
    targetValue: { type: Number, default: null }, // Used for animation counter; null = static text
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Metric = mongoose.model('Metric', metricSchema);
export default Metric;
