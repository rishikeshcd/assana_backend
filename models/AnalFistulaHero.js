import mongoose from 'mongoose';

// Model for AnalFistulaHero component
const AnalFistulaHeroSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Anal Fistula',
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
AnalFistulaHeroSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const AnalFistulaHero = mongoose.model('AnalFistulaHero', AnalFistulaHeroSchema);

export default AnalFistulaHero;

