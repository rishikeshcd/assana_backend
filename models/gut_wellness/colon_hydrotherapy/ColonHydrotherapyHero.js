import mongoose from 'mongoose';

// Model for ColonHydrotherapyHero component
const ColonHydrotherapyHeroSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Colon Hydrotherapy',
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
ColonHydrotherapyHeroSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      backgroundImage: '',
      title: 'Colon Hydrotherapy',
      description: '',
      buttonText: 'Book a Consultation',
    });
  }
  return doc;
};

const ColonHydrotherapyHero = mongoose.model('ColonHydrotherapyHero', ColonHydrotherapyHeroSchema);

export default ColonHydrotherapyHero;

