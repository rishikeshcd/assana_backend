import mongoose from 'mongoose';

// Model for FrequentlyQA component - matches exact field names from FrequentlyQA.jsx
const HomeAskedQuestionsComponentSchema = new mongoose.Schema({
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

HomeAskedQuestionsComponentSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const HomeAskedQuestionsComponent = mongoose.model('HomeAskedQuestionsComponent', HomeAskedQuestionsComponentSchema);

export default HomeAskedQuestionsComponent;

