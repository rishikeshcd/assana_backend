import mongoose from 'mongoose';

// Model for AnalFissureMain component - same as PilesMain with items (bullet points)
const AnalFissureMainSchema = new mongoose.Schema({
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
AnalFissureMainSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      sections: [],
      conclusion: {},
    });
  }
  return doc;
};

const AnalFissureMain = mongoose.model('AnalFissureMain', AnalFissureMainSchema);

export default AnalFissureMain;

