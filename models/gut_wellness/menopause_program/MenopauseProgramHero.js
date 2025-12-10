import mongoose from 'mongoose';

// Model for MenopauseProgramHero component
const MenopauseProgramHeroSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Menopause Program',
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
MenopauseProgramHeroSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const MenopauseProgramHero = mongoose.model('MenopauseProgramHero', MenopauseProgramHeroSchema);

export default MenopauseProgramHero;

