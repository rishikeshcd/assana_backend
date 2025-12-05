import mongoose from 'mongoose';

// Model for GutBrainAxisMain component
const GutBrainAxisMainSchema = new mongoose.Schema({
  mainTitle: {
    type: String,
    default: 'Assana Life',
  },
  subtitle: {
    type: String,
    default: 'Our Gut Wellness Programme.',
  },
  mainHeading: {
    type: String,
    default: 'Transforming Health from the Inside Out.',
  },
  introDescription: {
    type: String,
    default: '',
  },
  approachHeading: {
    type: String,
    default: 'Our Holistic Approach to Gut Wellness',
  },
  approaches: [{
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  }],
  conclusion: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
GutBrainAxisMainSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      approaches: [],
    });
  }
  return doc;
};

const GutBrainAxisMain = mongoose.model('GutBrainAxisMain', GutBrainAxisMainSchema);

export default GutBrainAxisMain;

