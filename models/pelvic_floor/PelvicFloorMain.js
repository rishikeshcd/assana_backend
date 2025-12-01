import mongoose from 'mongoose';

// Model for PelvicFloorMain component
const PelvicFloorMainSchema = new mongoose.Schema({
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
      default: 'How Azura Can Help',
    },
    howCanHelp: {
      type: String,
      default: '',
    },
    symptomsHeading: {
      type: String,
      default: 'Symptoms',
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
PelvicFloorMainSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      sections: [],
    });
  }
  return doc;
};

const PelvicFloorMain = mongoose.model('PelvicFloorMain', PelvicFloorMainSchema);

export default PelvicFloorMain;

