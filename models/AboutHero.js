import mongoose from 'mongoose';

// Model for AboutHero component - matches exact field names from AboutHero.jsx
const AboutHeroSchema = new mongoose.Schema({
  aboutBanner: {
    type: String,
    default: '',
  },
  bannerHeading: {
    type: String,
    default: '',
  },
  bannerSubHeading: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
AboutHeroSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const AboutHero = mongoose.model('AboutHero', AboutHeroSchema);

export default AboutHero;

