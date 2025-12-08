import mongoose from 'mongoose';

// Model for ColonHydrotherapyMain component
const ColonHydrotherapyMainSchema = new mongoose.Schema({
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
    contentBlocks: [{
      heading: {
        type: String,
        default: '',
      },
      text: {
        type: String,
        default: '',
      },
    }],
  }],
  conclusion: {
    text: {
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
ColonHydrotherapyMainSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      sections: [],
      conclusion: {
        text: '',
        buttonText: 'Book a Consultation',
      },
    });
  }
  return doc;
};

const ColonHydrotherapyMain = mongoose.model('ColonHydrotherapyMain', ColonHydrotherapyMainSchema);

export default ColonHydrotherapyMain;

