import mongoose from 'mongoose';

// Model for Banner component - matches exact field names from Banner.jsx
const HomeBannerSchema = new mongoose.Schema({
  mainTitle: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  introductionParagraph: {
    type: String,
    default: '',
  },
  experienceSectionTitle: {
    type: String,
    default: '',
  },
  experienceItems: {
    type: [String],
    default: [],
  },
  // Keep old fields for backward compatibility
  experienceItems_1: {
    type: String,
    default: '',
  },
  experienceItems_2: {
    type: String,
    default: '',
  },
  experienceItems_3: {
    type: String,
    default: '',
  },
  experienceItems_4: {
    type: String,
    default: '',
  },
  experienceItems_5: {
    type: String,
    default: '',
  },
  experienceItems_6: {
    type: String,
    default: '',
  },
  experienceItems_7: {
    type: String,
    default: '',
  },
  backgroundImage: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
HomeBannerSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const HomeBanner = mongoose.model('HomeBanner', HomeBannerSchema);

export default HomeBanner;

