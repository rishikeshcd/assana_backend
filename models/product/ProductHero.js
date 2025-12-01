import mongoose from 'mongoose';

// Model for ProductHero component
const ProductHeroSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Find the Right Supplements for Your Lifestyle',
  },
  description: {
    type: String,
    default: 'Explore a curated range of wellness products designed to boost energy, immunity, and overall health.',
  },
  buttonText: {
    type: String,
    default: 'Book a Consultation',
  },
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
ProductHeroSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const ProductHero = mongoose.model('ProductHero', ProductHeroSchema);

export default ProductHero;

