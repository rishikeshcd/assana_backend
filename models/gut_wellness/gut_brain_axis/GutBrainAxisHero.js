import mongoose from 'mongoose';

// Model for GutBrainAxisHero component
const GutBrainAxisHeroSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Gut Brain Axis & The Gut Microbiome',
  },
  description: {
    type: String,
    default: '',
  },
  buttonText: {
    type: String,
    default: 'Book a Consultation',
  },
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
GutBrainAxisHeroSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const GutBrainAxisHero = mongoose.model('GutBrainAxisHero', GutBrainAxisHeroSchema);

export default GutBrainAxisHero;

