import mongoose from 'mongoose';

// Model for ColorectalSymptomsMain component
const ColorectalSymptomsMainSchema = new mongoose.Schema({
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
    whatIsItHeading: {
      type: String,
      default: 'What is it?',
    },
    whatIsIt: {
      type: String,
      default: '',
    },
    howCanHelpHeading: {
      type: String,
      default: 'Symptoms',
    },
    howCanHelp: {
      type: String,
      default: '',
    },
    symptomsHeading: {
      type: String,
      default: 'How Assana Can Help',
    },
    symptoms: [{
      type: String,
      default: '',
    }],
  }],
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
ColorectalSymptomsMainSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      sections: [],
    });
  }
  return doc;
};

const ColorectalSymptomsMain = mongoose.model('ColorectalSymptomsMain', ColorectalSymptomsMainSchema);

export default ColorectalSymptomsMain;

