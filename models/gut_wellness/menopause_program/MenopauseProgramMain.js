import mongoose from 'mongoose';

// Model for MenopauseProgramMain component - dynamic left and right cards
const MenopauseProgramMainSchema = new mongoose.Schema({
  mainTitle: {
    type: String,
    default: 'All you need to know..',
  },
  leftCards: [{
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  }],
  centerImage: {
    type: String,
    default: '',
  },
  centerImageAlt: {
    type: String,
    default: '',
  },
  rightCards: [{
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  }],
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
MenopauseProgramMainSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      leftCards: [],
      rightCards: [],
    });
  }
  return doc;
};

const MenopauseProgramMain = mongoose.model('MenopauseProgramMain', MenopauseProgramMainSchema);

export default MenopauseProgramMain;

