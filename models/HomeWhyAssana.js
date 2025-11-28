import mongoose from 'mongoose';

// Model for WhyAssana component - contains both WhyAssana and WhyDifferent sections
const HomeWhyAssanaSchema = new mongoose.Schema({
  // Why Assana Section
  mainTitle: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  introductionParagraph: {
    type: String,
    default: '',
  },
  // Why Different Section
  whyDifferentMainTitle: {
    type: String,
    default: '',
  },
  whyDifferentSubtitle: {
    type: String,
    default: '',
  },
  whyDifferentIntroductionParagraph: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

HomeWhyAssanaSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const HomeWhyAssana = mongoose.model('HomeWhyAssana', HomeWhyAssanaSchema);

export default HomeWhyAssana;
