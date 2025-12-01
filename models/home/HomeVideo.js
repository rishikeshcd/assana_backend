import mongoose from 'mongoose';

// Model for Healing component - matches exact field names from Healing.jsx
const HomeVideoSchema = new mongoose.Schema({
  Heading: {
    type: String,
    default: '',
  },
  subHeading: {
    type: String,
    default: '',
  },
  videoLink: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

HomeVideoSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const HomeVideo = mongoose.model('HomeVideo', HomeVideoSchema);

export default HomeVideo;

