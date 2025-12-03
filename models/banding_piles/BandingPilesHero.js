import mongoose from 'mongoose';

// Model for BandingPilesHero component
const BandingPilesHeroSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Banding of Piles or Haemorrhoids',
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
BandingPilesHeroSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const BandingPilesHero = mongoose.model('BandingPilesHero', BandingPilesHeroSchema);

export default BandingPilesHero;

