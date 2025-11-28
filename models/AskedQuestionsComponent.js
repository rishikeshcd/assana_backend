import mongoose from 'mongoose';

// Model for FrequentlyQA component - matches exact field names from FrequentlyQA.jsx
const AskedQuestionsComponentSchema = new mongoose.Schema({
  componentHeading: {
    type: String,
    default: '',
  },
  faqs: [{
    questionHeading: {
      type: String,
      default: '',
    },
    answerPara: {
      type: String,
      default: '',
    },
  }],
}, {
  timestamps: true,
});

AskedQuestionsComponentSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const AskedQuestionsComponent = mongoose.model('AskedQuestionsComponent', AskedQuestionsComponentSchema);

export default AskedQuestionsComponent;

