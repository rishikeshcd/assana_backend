import mongoose from 'mongoose';

// Model for "Why Choose ASSANA?" section
const AboutWhyChooseSchema = new mongoose.Schema({
  heading: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  buttonText: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
AboutWhyChooseSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const AboutWhyChoose = mongoose.model('AboutWhyChoose', AboutWhyChooseSchema);

export default AboutWhyChoose;

