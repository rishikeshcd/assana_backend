import mongoose from 'mongoose';

// Model for TryDemo component - matches exact field names from TryDemo.jsx
const HomeGetStartedComponentSchema = new mongoose.Schema({
  Heading: {
    type: String,
    default: '',
  },
  subHeading: {
    type: String,
    default: '',
  },
  backgroundImage: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

HomeGetStartedComponentSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const HomeGetStartedComponent = mongoose.model('HomeGetStartedComponent', HomeGetStartedComponentSchema);

export default HomeGetStartedComponent;

