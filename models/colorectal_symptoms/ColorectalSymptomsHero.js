import mongoose from 'mongoose';

// Model for ColorectalSymptomsHero component
const ColorectalSymptomsHeroSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Colorectal Symptoms',
  },
  description: {
    type: String,
    default: '',
  },
  buttonText: {
    type: String,
    default: 'Book Consultation',
  },
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
ColorectalSymptomsHeroSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const ColorectalSymptomsHero = mongoose.model('ColorectalSymptomsHero', ColorectalSymptomsHeroSchema);

export default ColorectalSymptomsHero;

