import mongoose from 'mongoose';

// Model for AnalFissureHero component
const AnalFissureHeroSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Anal Fissure',
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
AnalFissureHeroSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const AnalFissureHero = mongoose.model('AnalFissureHero', AnalFissureHeroSchema);

export default AnalFissureHero;

