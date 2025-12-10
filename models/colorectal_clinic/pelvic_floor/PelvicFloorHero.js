import mongoose from 'mongoose';

// Model for PelvicFloorHero component
const PelvicFloorHeroSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Pelvic Floor Problems',
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
PelvicFloorHeroSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const PelvicFloorHero = mongoose.model('PelvicFloorHero', PelvicFloorHeroSchema);

export default PelvicFloorHero;

