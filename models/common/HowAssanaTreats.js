import mongoose from 'mongoose';

// Model for HowAssanaTreats component - common section for all pages
const HowAssanaTreatsSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'How Assana Treats It',
  },
  treatments: [
    {
      title: {
        type: String,
        default: '',
      },
      image: {
        type: String,
        default: '',
      },
      imageAlt: {
        type: String,
        default: '',
      },
    },
  ],
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
HowAssanaTreatsSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      treatments: [
        {
          title: 'Ayurvedic Therapies',
          image: '',
          imageAlt: 'Ayurvedic Therapies',
        },
        {
          title: 'Lifestyle & Diet Coaching',
          image: '',
          imageAlt: 'Lifestyle & Diet Coaching',
        },
        {
          title: 'Colon Hydrotherapy',
          image: '',
          imageAlt: 'Colon Hydrotherapy',
        },
        {
          title: 'Pelvic Floor Strengthening',
          image: '',
          imageAlt: 'Pelvic Floor Strengthening',
        },
      ],
    });
  }
  return doc;
};

const HowAssanaTreats = mongoose.model('HowAssanaTreats', HowAssanaTreatsSchema);

export default HowAssanaTreats;

