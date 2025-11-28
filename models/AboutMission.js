import mongoose from 'mongoose';

// Model for AboutMission component - matches exact field names from AboutMission.jsx
const AboutMissionSchema = new mongoose.Schema({
  whyAssanaHeading: {
    type: String,
    default: '',
  },
  whyAssanaSubHeading: {
    type: String,
    default: '',
  },
  whyAssanaPara: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Ensure only one document exists (singleton pattern)
AboutMissionSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const AboutMission = mongoose.model('AboutMission', AboutMissionSchema);

export default AboutMission;

