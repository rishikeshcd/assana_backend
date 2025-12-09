import mongoose from 'mongoose';

// Model for NewMomProgramMain component - dynamic left and right cards
const NewMomProgramMainSchema = new mongoose.Schema({
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
NewMomProgramMainSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({
      leftCards: [],
      rightCards: [],
    });
  }
  return doc;
};

const NewMomProgramMain = mongoose.model('NewMomProgramMain', NewMomProgramMainSchema);

export default NewMomProgramMain;

