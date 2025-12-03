import mongoose from 'mongoose';

// Model for LaserSurgeryHero component
const LaserSurgeryHeroSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Laser Surgery For Piles',
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
LaserSurgeryHeroSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const LaserSurgeryHero = mongoose.model('LaserSurgeryHero', LaserSurgeryHeroSchema);

export default LaserSurgeryHero;


