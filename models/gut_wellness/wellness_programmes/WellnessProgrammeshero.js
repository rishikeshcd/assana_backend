import mongoose from 'mongoose';

// Model for SeniorCitizensProgrammeHero component
const WellnessProgrammesHeroSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'wellness Programme',
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
WellnessProgrammesHeroSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      backgroundImage: '',
      title: 'Wellness Programme',
      description: '',
      buttonText: 'Book a Consultation',
    });
  }
  return doc;
};

const WellnessProgrammesHero = mongoose.model('WellnessProgrammesHero', WellnessProgrammesHeroSchema);

export default WellnessProgrammesHero;