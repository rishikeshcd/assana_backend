import mongoose from 'mongoose';

// Model for AnalWoundCareHero component
const AnalWoundCareHeroSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'After Anal Surgery Wound Care',
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
AnalWoundCareHeroSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const AnalWoundCareHero = mongoose.model('AnalWoundCareHero', AnalWoundCareHeroSchema);

export default AnalWoundCareHero;

