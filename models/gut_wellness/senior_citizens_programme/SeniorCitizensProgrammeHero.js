import mongoose from 'mongoose';

// Model for SeniorCitizensProgrammeHero component
const SeniorCitizensProgrammeHeroSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Senior Citizens Programme',
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
SeniorCitizensProgrammeHeroSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      backgroundImage: '',
      title: 'Senior Citizens Programme',
      description: '',
      buttonText: 'Book a Consultation',
    });
  }
  return doc;
};

const SeniorCitizensProgrammeHero = mongoose.model('SeniorCitizensProgrammeHero', SeniorCitizensProgrammeHeroSchema);

export default SeniorCitizensProgrammeHero;

