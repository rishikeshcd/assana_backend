import mongoose from 'mongoose';

// Model for AssanaButtCheckHero component
const AssanaButtCheckHeroSchema = new mongoose.Schema({
  backgroundImage: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: 'Assana Butt Check',
  },
  description: {
    type: String,
    default: 'At Assana Colorectal & Gut Wellness Centre, we believe that prevention and early detection are key to maintaining optimal gut and colorectal health. That\'s why we\'ve designed the Assana Butt Check, a comprehensive master health check-up that evaluates the overall health of your gut and butt, helping you stay ahead of potential issues while improving your overall wellness.',
  },
  buttonText: {
    type: String,
    default: 'Book a Consultation',
  },
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
AssanaButtCheckHeroSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const AssanaButtCheckHero = mongoose.model('AssanaButtCheckHero', AssanaButtCheckHeroSchema);

export default AssanaButtCheckHero;

