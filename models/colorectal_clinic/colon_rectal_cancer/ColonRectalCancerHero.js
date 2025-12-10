import mongoose from 'mongoose';

// Model for ColonRectalCancerHero component
const ColonRectalCancerHeroSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Colon & Rectal Cancer',
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
ColonRectalCancerHeroSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const ColonRectalCancerHero = mongoose.model('ColonRectalCancerHero', ColonRectalCancerHeroSchema);

export default ColonRectalCancerHero;


