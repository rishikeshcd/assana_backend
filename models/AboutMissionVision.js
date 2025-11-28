import mongoose from 'mongoose';

// Model for Mission and Vision section
const AboutMissionVisionSchema = new mongoose.Schema({
  missionHeading: {
    type: String,
    default: '',
  },
  missionText: {
    type: String,
    default: '',
  },
  visionHeading: {
    type: String,
    default: '',
  },
  visionText: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
AboutMissionVisionSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const AboutMissionVision = mongoose.model('AboutMissionVision', AboutMissionVisionSchema);

export default AboutMissionVision;

