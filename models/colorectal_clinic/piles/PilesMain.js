import mongoose from 'mongoose';

// Model for PilesMain component - same as AnalFistulaMain with items (bullet points)
const PilesMainSchema = new mongoose.Schema({
  sections: [{
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
    imageTitle: {
      type: String,
      default: '',
    },
    items: [{
      type: String,
      default: '',
    }],
  }],
  conclusion: {
    title: {
      type: String,
      default: 'Conclusion',
    },
    description: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: 'Book a Consultation',
    },
  },
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
PilesMainSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      sections: [],
      conclusion: {},
    });
  }
  return doc;
};

const PilesMain = mongoose.model('PilesMain', PilesMainSchema);

export default PilesMain;

